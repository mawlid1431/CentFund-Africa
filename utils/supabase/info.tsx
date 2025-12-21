// Supabase project information
// SECURITY: Never hardcode credentials or project IDs
// Always use environment variables from .env file

// This file is deprecated - use environment variables directly
// Import from client.ts which properly uses environment variables

export const getProjectInfo = () => ({
    url: import.meta.env.VITE_SUPABASE_URL,
    // Project ID can be extracted from URL if needed
    projectId: import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || ''
});