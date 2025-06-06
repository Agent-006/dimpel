"use client";

import CommitLog from "@/components/commit-log";
import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashboardPage = () => {
    const { project } = useProject();

    return (
        <div>
            {project?.id}
            <div className="flex flex-wrap items-center justify-between gap-y-4">
                {/* connected github URL */}
                <div className="bg-primary w-fit rounded-md px-4 py-3">
                    <div className="flex items-center">
                        <Github className="text-foreground size-5" />
                        <div className="ml-2">
                            <p className="text-foreground text-sm font-medium">
                                This project is linked to :{" "}
                                <Link
                                    href={project?.githubUrl ?? ""}
                                    className="text-foreground/80 inline-flex items-center hover:underline"
                                >
                                    {project?.githubUrl}
                                    <ExternalLink className="hover:bg-foreground ml-1 size-4" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-4" />

                <div className="flex items-center gap-4">
                    TeamMembers InviteButton ArchiveButton
                </div>
            </div>

            <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    AskQuestionCard MeetingCard
                </div>
            </div>

            <div className="mt-8">
                <CommitLog />
            </div>
        </div>
    );
};

export default DashboardPage;
