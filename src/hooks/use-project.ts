import { api } from '@/trpc/react';
import { useAuth } from '@clerk/nextjs';

import { useLocalStorage } from 'usehooks-ts';

const useProject = () => {
    const { isLoaded, userId } = useAuth();
    const [ projectId, setProjectId ] = useLocalStorage('dimpel-projectId', ' ');
    
    // Ensure user is loaded before making queries
    const { data: projects, error } = api.project.getProjects.useQuery(undefined, 
        {
            enabled: isLoaded && !!userId, // Only run query if user is loaded and userId is available
        }
    );
    
    const project = projects?.find((project) => project.id === projectId);

    return { 
        projects: projects || [],
        project,
        projectId,
        setProjectId, 
        isLoading: !isLoaded || !projects,
        error,
        isAuthenticated: !!userId,
    };
};

export default useProject;