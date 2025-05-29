import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({

    // This procedure creates a new project in the database.
    createProject: protectedProcedure
    .input(
        z.object({
            name: z.string().min(1, "Project name is required"),
            githubUrl: z.string().url("Invalid GitHub URL").min(1, "GitHub URL is required"),
            githubToken: z.string().optional(),
        }),
    )
    .mutation(async ({ ctx, input }) => {

        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId!,
            },
        });

        if (!user) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User not found or not authorized to create a project. Please log in again.',
                cause: new Error('User not found or not authorized'),
            });
        }
        
        try {
            const project = await ctx.db.project.create({
                data: {
                    name: input.name,
                    githubUrl: input.githubUrl,
                    userToProjects: {
                        create: {
                            userId: ctx.user.userId!,
                        },
                    },
                },
                include: {
                    userToProjects: true, // Return the relation if needed
                },
            });

            return project;
        } catch (error) {
            if (error instanceof Error && error.message.includes("Unique constraint")) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Project with this name or GitHub URL already exists",
                });
            }
    
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create project",
                cause: error,
            });
        }
    }),

    // This procedure retrieves all projects for the authenticated user.
    getProjects: protectedProcedure
    .query(async ({ ctx }) => {

        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId!,
            },
        });

        if(!user) {{
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User not found or not authorized to access projects. Please log in again.',
                cause: new Error('User not found or not authorized'),
            });
        }}

        
        try {
            const projects = await ctx.db.project.findMany({
                where: {
                    userToProjects: {
                        some: {
                            userId: ctx.user.userId!,
                        },
                    },
                    deletedAt: null, // Ensure we only get non-deleted projects
                },
            });

            return projects;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to retrieve projects",
                cause: error,
            });
        }
    }),

});