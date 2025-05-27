import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure
    .input(
        z.object({
            name: z.string().min(1, "Project name is required"),
            githubUrl: z.string().url("Invalid GitHub URL").min(1, "GitHub URL is required"),
            githubToken: z.string().optional(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        console.log('input', input);
        return true;
    }),
});