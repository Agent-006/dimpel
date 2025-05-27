"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
};

const CreateProjectPage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();

    const createProject = api.project.createProject.useMutation();

    const onSubmit = (data: FormInput) => {
        window.alert(JSON.stringify(data));
        createProject.mutate(
            {
                githubUrl: data.repoUrl,
                name: data.projectName,
                githubToken: data.githubToken,
            },
            {
                onSuccess: () => {
                    toast.success("Project created successfully!", {
                        description:
                            "Your project has been linked with Dimpel.",
                    });
                    reset(); // Reset the form after successful submission
                },
                onError: (error) => {
                    toast.error("Failed to create project", {
                        description: error.message,
                    });
                },
            }
        );

        return true;
    };

    return (
        <div className="flex h-full items-center justify-center gap-12">
            <div>
                <div>
                    <h1 className="text-2xl font-semibold">
                        Link your Github Repository
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Enter the URL of your Github repository to link it with
                        Dimpel.
                    </p>
                </div>
                <div className="h-4" />
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            required
                            {...register("projectName", {
                                required: true,
                            })}
                            placeholder="Project Name"
                            className="mb-4"
                        />
                        <Input
                            required
                            {...register("repoUrl", {
                                required: true,
                            })}
                            placeholder="Enter your Github repository URL"
                            className="mb-4"
                        />
                        <Input
                            {...register("githubToken")}
                            placeholder="Enter your Github token (optional)"
                            className="mb-4"
                        />
                        <Button type="submit">Create Project</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectPage;
