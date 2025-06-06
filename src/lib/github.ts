import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { getAiSummarisedCommit } from "./gemini";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const githubUrl = 'https://github.com/Agent-006/IncogniNote';

type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {

    const [owner, repo] = githubUrl.replace('https://github.com/', '').split('/');
    
    const { data } = await octokit.rest.repos.listCommits({
        owner: owner ?? '',
        repo: repo ?? '',
    });
    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.data).getTime()) as any[];
    
    return sortedCommits.slice(0, 10).map((commit)=>({
        commitHash: commit?.sha as string,
        commitMessage: commit?.commit?.message ?? "",
        commitAuthorName: commit?.commit?.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate: commit?.commit?.author?.date ?? ""
    }));
}

const summariseCommit = async (githubUrl: string, commitHash: string) => {
    // get the diff and pass the diff into ai

    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    });

    return await getAiSummarisedCommit(data) || "No summary available";
}

const fetchProjectGithubUrl = async (projectId: string) => {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
            githubUrl: true,
        }
    });

    if (!project?.githubUrl) {
        throw new Error("Project has no github url");
    }

    return {
        project,
        githubUrl: project.githubUrl,
    };
}

const filterUnprocessedCommits = async (projectId: string, commitHashes: Response[]) =>{
    const processedCommits = await db.commit.findMany({
        where: {
            id: projectId,
        }
    });

    // using set for O(1) lookup time
    const processedHashes = new Set(processedCommits.map(commit => commit.commitHash));
    
    const unprocessedCommits = commitHashes.filter((commit) => {
        return !processedHashes.has(commit.commitHash);
    })

    return unprocessedCommits;
}

export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    
    const commitHashes = await getCommitHashes(githubUrl);

    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);

    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
        return summariseCommit(githubUrl, commit.commitHash);
    }));

    console.log(summaryResponses);
    
    // get the summaries from the responses
    const summaries = summaryResponses.map((response) => {
        if (response.status === 'fulfilled') {
            return response.value as string;
        }

        return "";
    });

    console.log(summaries);

    // create the commits in the database
    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            console.log(`Creating commit ${index} of ${summaries.length}`);
            return {
                projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary,
            }
        }),
    });

    return commits;
}