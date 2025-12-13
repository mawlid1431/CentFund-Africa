import { supabase } from './client';
import type { Database } from './types';

type Project = Database['public']['Tables']['projects']['Row'];

// Projects
export async function getProjects() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
}

export async function getActiveProjects() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
}

export async function getProjectById(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Project;
}

export async function createProject(project: Database['public']['Tables']['projects']['Insert']) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

    if (error) throw error;
    return data as Project;
}

export async function updateProject(id: string, updates: Database['public']['Tables']['projects']['Update']) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Project;
}

export async function deleteProject(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Team Members
export async function getTeamMembers() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        image: member.image,
        displayOrder: member.order_index,
        linkedinUrl: member.linkedin,
        email: member.email
    }));
}

export async function createTeamMember(member: {
    name: string;
    role: string;
    image: string;
    displayOrder: number;
    linkedinUrl?: string;
    email?: string;
}) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('team_members')
        .insert({
            name: member.name,
            role: member.role,
            image: member.image,
            order_index: member.displayOrder,
            linkedin: member.linkedinUrl,
            email: member.email
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateTeamMember(id: string, member: {
    name: string;
    role: string;
    image: string;
    displayOrder: number;
    linkedinUrl?: string;
    email?: string;
}) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('team_members')
        .update({
            name: member.name,
            role: member.role,
            image: member.image,
            order_index: member.displayOrder,
            linkedin: member.linkedinUrl,
            email: member.email
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteTeamMember(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Testimonials
export async function getTestimonials() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getTestimonialById(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createTestimonial(testimonial: Database['public']['Tables']['testimonials']['Insert']) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('testimonials')
        .insert(testimonial)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateTestimonial(id: string, updates: Database['public']['Tables']['testimonials']['Update']) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteTestimonial(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Success Stories
export async function getSuccessStories() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getSuccessStoryById(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createSuccessStory(story: Database['public']['Tables']['success_stories']['Insert']) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('success_stories')
        .insert(story)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateSuccessStory(id: string, updates: Database['public']['Tables']['success_stories']['Update']) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('success_stories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteSuccessStory(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { error } = await supabase
        .from('success_stories')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Dashboard Stats
export async function getDashboardStats() {
    if (!supabase) return { activeProjects: 0, totalProjects: 0 };
    const { data: projects } = await supabase
        .from('projects')
        .select('*');

    const activeProjects = projects?.length || 0;

    return {
        activeProjects,
        totalProjects: projects?.length || 0
    };
}

// Sponsors
export async function createSponsor(sponsor: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    organization?: string;
    project_id: string;
    amount: number;
    sponsor_type: 'full' | 'partial';
    status: 'pending' | 'approved' | 'rejected';
}) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('sponsors')
        .insert(sponsor)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getSponsors() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getSponsorById(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function updateSponsorStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('sponsors')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
