"use client";

import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CommitLog = () => {
    const { projectId, project } = useProject();

    const { data: commits } = api.project.getCommits.useQuery({ projectId });

    if (!commits) {
        return <div>No commits found</div>;
    }

    return (
        <>
            <ul className="space-y-6">
                {commits?.map((commit, commitIdx) => (
                    <li key={commit.id} className="relative flex gap-x-4">
                        <div
                            className={cn(
                                commitIdx === commits.length - 1
                                    ? "h-6"
                                    : "-bottom-6",
                                "absolute top-0 left-0 flex w-6 justify-center"
                            )}
                        >
                            <div className="bg-primary/20 w-px translate-x-1" />
                        </div>

                        <>
                            <Image
                                src={
                                    commit.commitAuthorAvatar ||
                                    "/default-avatar.png"
                                }
                                alt={commit.commitAuthorName}
                                width={40}
                                height={40}
                                className="bg-background/50 relative mt-4 size-8 flex-none rounded-full"
                            />
                            <div className="bg-background/50 ring-foreground/20 flex-auto rounded-md p-4 ring-1 ring-inset">
                                <div className="flex justify-between gap-x-4">
                                    <Link
                                        href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                                        className="text-foreground/80 hover:text-foreground/100 flex items-center gap-1 py-0.5 text-xs leading-5 font-medium hover:underline"
                                        target="_blank"
                                    >
                                        <span className="text-foreground font-medium">
                                            {commit.commitAuthorName}
                                        </span>
                                        <span className="item-center text-foreground/60 inline-flex">
                                            commited
                                            <ExternalLink className="ml-1 size-4" />
                                        </span>
                                    </Link>
                                </div>
                                <span className="text-primary/90 font-semibold">
                                    {commit.commitMessage ||
                                        "No commit message provided."}
                                </span>
                                <pre className="text-foreground/60 mt-2 text-sm leading-6 whitespace-pre-wrap">
                                    {commit.summary}
                                </pre>
                            </div>
                        </>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default CommitLog;
