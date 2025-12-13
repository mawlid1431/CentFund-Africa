/**
 * Admin Helper Functions for Database Management
 * These functions help admin panel interact with the database
 */

import { supabase } from './client';
import type { Database } from './types';

// ============================================
// APPLICATIONS MANAGEMENT
// ============================================

export async function getApplications(filters?: {
    status?: string;
    assignedSponsorId?: string;
    assignedAdminId?: string;
}) {
    if (!supabase) return [];

    let query = supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }
    if (filters?.assignedSponsorId) {
        query = query.eq('assigned_sponsor_id', filters.assignedSponsorId);
    }
    if (filters?.assignedAdminId) {
        query = query.eq('assigned_admin_id', filters.assignedAdminId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getApplicationById(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function updateApplicationStatus(
    id: string,
    status: string,
    adminId?: string,
    notes?: string
) {
    if (!supabase) throw new Error('Database not connected');

    const updates: any = {
        status,
        updated_at: new Date().toISOString(),
    };

    if (status === 'under_review') {
        updates.reviewed_at = new Date().toISOString();
    }
    if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    // Log status change in history
    if (adminId) {
        await logApplicationHistory(id, adminId, status, notes);
    }

    return data;
}

export async function assignSponsorToApplication(
    applicationId: string,
    sponsorId: string,
    adminId: string
) {
    if (!supabase) throw new Error('Database not connected');

    const { data, error } = await supabase
        .from('applications')
        .update({
            assigned_sponsor_id: sponsorId,
            sponsor_assigned_at: new Date().toISOString(),
            status: 'assigned_to_sponsor',
            updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select()
        .single();

    if (error) throw error;

    // Log assignment
    await logApplicationHistory(
        applicationId,
        adminId,
        'assigned_to_sponsor',
        `Assigned to sponsor ${sponsorId}`
    );

    return data;
}

async function logApplicationHistory(
    applicationId: string,
    changedById: string,
    newStatus: string,
    notes?: string
) {
    if (!supabase) return;

    await supabase.from('application_history').insert({
        application_id: applicationId,
        changed_by_id: changedById,
        new_status: newStatus,
        notes,
    });
}

// ============================================
// USERS MANAGEMENT
// ============================================

export async function getUsers(role?: string) {
    if (!supabase) return [];

    let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (role) {
        query = query.eq('role', role);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getUserByEmail(email: string) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) throw error;
    return data;
}

export async function createUser(user: {
    email: string;
    password_hash: string;
    full_name: string;
    phone?: string;
    role: 'applicant' | 'admin' | 'sponsor' | 'student_admin' | 'sponsor_admin';
}) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateUser(id: string, updates: {
    full_name?: string;
    phone?: string;
    status?: 'active' | 'inactive' | 'suspended';
}) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============================================
// SPONSORS MANAGEMENT
// ============================================

export async function updateSponsor(id: string, updates: {
    status?: 'pending' | 'approved' | 'rejected';
    total_sponsored?: number;
    active_sponsorships?: number;
}) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('sponsors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getSponsorApplications(sponsorEmail: string) {
    if (!supabase) return [];

    // First get the sponsor's user ID
    const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', sponsorEmail)
        .eq('role', 'sponsor')
        .single();

    if (!user) return [];

    // Get applications assigned to this sponsor
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('assigned_sponsor_id', user.id)
        .order('sponsor_assigned_at', { ascending: false });

    if (error) throw error;
    return data;
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function createNotification(notification: {
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
}) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getUserNotifications(userId: string, unreadOnly = false) {
    if (!supabase) return [];

    let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (unreadOnly) {
        query = query.eq('read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function markNotificationAsRead(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============================================
// DASHBOARD STATISTICS
// ============================================

export async function getAdminDashboardStats() {
    if (!supabase) {
        return {
            totalApplications: 0,
            pendingApplications: 0,
            approvedApplications: 0,
            totalSponsors: 0,
            activeSponsors: 0,
            totalProjects: 0,
            activeProjects: 0,
            totalFunding: 0,
        };
    }

    try {
        // Get applications stats
        const { data: applications } = await supabase
            .from('applications')
            .select('status, certification_cost');

        const totalApplications = applications?.length || 0;
        const pendingApplications = applications?.filter(a => a.status === 'pending').length || 0;
        const approvedApplications = applications?.filter(a =>
            ['accepted_stage1', 'accepted_stage2', 'completed'].includes(a.status)
        ).length || 0;

        // Get sponsors stats
        const { data: sponsors } = await supabase
            .from('sponsors')
            .select('status, amount');

        const totalSponsors = sponsors?.length || 0;
        const activeSponsors = sponsors?.filter(s => s.status === 'approved').length || 0;
        const totalFunding = sponsors?.reduce((sum, s) => sum + (Number(s.amount) || 0), 0) || 0;

        // Get projects stats
        const { data: projects } = await supabase
            .from('projects')
            .select('status');

        const totalProjects = projects?.length || 0;
        const activeProjects = projects?.filter(p => p.status === 'active').length || 0;

        return {
            totalApplications,
            pendingApplications,
            approvedApplications,
            totalSponsors,
            activeSponsors,
            totalProjects,
            activeProjects,
            totalFunding,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalApplications: 0,
            pendingApplications: 0,
            approvedApplications: 0,
            totalSponsors: 0,
            activeSponsors: 0,
            totalProjects: 0,
            activeProjects: 0,
            totalFunding: 0,
        };
    }
}

// ============================================
// PARTNERS MANAGEMENT
// ============================================

export async function getPartners() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
}

export async function createPartner(partner: any) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('partners')
        .insert(partner)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updatePartner(id: string, updates: any) {
    if (!supabase) throw new Error('Database not connected');
    const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deletePartner(id: string) {
    if (!supabase) throw new Error('Database not connected');
    const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
