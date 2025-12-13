/**
 * Database Connection Test Utility
 * Run this to verify your Supabase connection and check data
 */

import { supabase } from './client';

export async function testDatabaseConnection() {
    console.log('🔍 Testing Supabase Connection...\n');

    if (!supabase) {
        console.error('❌ Supabase client not initialized!');
        console.error('Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        return false;
    }

    try {
        // Test 1: Check Projects
        console.log('📊 Testing Projects table...');
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .limit(5);

        if (projectsError) {
            console.error('❌ Projects Error:', projectsError.message);
        } else {
            console.log(`✅ Projects: Found ${projects?.length || 0} records`);
            if (projects && projects.length > 0) {
                console.log('   Sample:', projects[0].name);
            }
        }

        // Test 2: Check Success Stories
        console.log('\n📖 Testing Success Stories table...');
        const { data: stories, error: storiesError } = await supabase
            .from('success_stories')
            .select('*')
            .limit(5);

        if (storiesError) {
            console.error('❌ Success Stories Error:', storiesError.message);
        } else {
            console.log(`✅ Success Stories: Found ${stories?.length || 0} records`);
            if (stories && stories.length > 0) {
                console.log('   Sample:', stories[0].name);
            }
        }

        // Test 3: Check Testimonials
        console.log('\n💬 Testing Testimonials table...');
        const { data: testimonials, error: testimonialsError } = await supabase
            .from('testimonials')
            .select('*')
            .limit(5);

        if (testimonialsError) {
            console.error('❌ Testimonials Error:', testimonialsError.message);
        } else {
            console.log(`✅ Testimonials: Found ${testimonials?.length || 0} records`);
            if (testimonials && testimonials.length > 0) {
                console.log('   Sample:', testimonials[0].name);
            }
        }

        // Test 4: Check Team Members
        console.log('\n👥 Testing Team Members table...');
        const { data: team, error: teamError } = await supabase
            .from('team_members')
            .select('*')
            .limit(5);

        if (teamError) {
            console.error('❌ Team Members Error:', teamError.message);
        } else {
            console.log(`✅ Team Members: Found ${team?.length || 0} records`);
        }

        // Test 5: Check Users
        console.log('\n👤 Testing Users table...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('email, role')
            .limit(5);

        if (usersError) {
            console.error('❌ Users Error:', usersError.message);
        } else {
            console.log(`✅ Users: Found ${users?.length || 0} records`);
            if (users && users.length > 0) {
                console.log('   Roles:', users.map(u => u.role).join(', '));
            }
        }

        // Test 6: Check Applications
        console.log('\n📝 Testing Applications table...');
        const { data: applications, error: applicationsError } = await supabase
            .from('applications')
            .select('full_name, status')
            .limit(5);

        if (applicationsError) {
            console.error('❌ Applications Error:', applicationsError.message);
        } else {
            console.log(`✅ Applications: Found ${applications?.length || 0} records`);
            if (applications && applications.length > 0) {
                console.log('   Sample:', applications[0].full_name, '-', applications[0].status);
            }
        }

        // Test 7: Check Sponsors
        console.log('\n💰 Testing Sponsors table...');
        const { data: sponsors, error: sponsorsError } = await supabase
            .from('sponsors')
            .select('name, status')
            .limit(5);

        if (sponsorsError) {
            console.error('❌ Sponsors Error:', sponsorsError.message);
        } else {
            console.log(`✅ Sponsors: Found ${sponsors?.length || 0} records`);
            if (sponsors && sponsors.length > 0) {
                console.log('   Sample:', sponsors[0].name, '-', sponsors[0].status);
            }
        }

        console.log('\n✅ Database connection test completed!');
        console.log('\n📋 Summary:');
        console.log(`   Projects: ${projects?.length || 0}`);
        console.log(`   Success Stories: ${stories?.length || 0}`);
        console.log(`   Testimonials: ${testimonials?.length || 0}`);
        console.log(`   Team Members: ${team?.length || 0}`);
        console.log(`   Users: ${users?.length || 0}`);
        console.log(`   Applications: ${applications?.length || 0}`);
        console.log(`   Sponsors: ${sponsors?.length || 0}`);

        return true;
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        return false;
    }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testDatabaseConnection();
}
