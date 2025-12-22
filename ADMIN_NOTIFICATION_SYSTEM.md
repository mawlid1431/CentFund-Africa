# Admin Notification System

## Overview
Complete real-time notification system for admins to monitor student activities, quiz results, and application progress.

---

## 🔔 Automatic Notifications

### 1. **New Student Registration**
**Trigger**: When a student creates an account

**Notification Includes**:
- Student name
- Email address
- Registration time (e.g., "14:30 on 22 Dec 2024")
- Location (City, Country)
- Link to student profile

**Example**:
```
🎓 New Student Registered
Ahmed Mohamed (ahmed@example.com) registered from Hargeisa, Somalia at 14:30 on 22 Dec 2024
```

---

### 2. **Quiz Completion**
**Trigger**: When a student completes the eligibility quiz

**Notification Includes**:
- Student name and email
- Score (e.g., "32/40")
- Pass/Fail status
- Eligibility status

**Examples**:
```
✅ Student Passed Quiz
Fatima Hassan (fatima@example.com) scored 32/40 on eligibility quiz. 
Student is now eligible to apply for programs!
```

```
❌ Student Failed Quiz
Ahmed Mohamed (ahmed@example.com) scored 21/40 on eligibility quiz. 
Student needs to retake the quiz.
```

---

### 3. **New Application Submitted**
**Trigger**: When a student applies for a certification program

**Notification Includes**:
- Student name
- Certification name
- Application ID (shortened)
- Current status
- Link to application

**Example**:
```
📝 New Application Submitted
Ahmed Mohamed applied for AWS Cloud Practitioner certification. 
Application ID: 8948af02... | Status: Pending Review
```

---

### 4. **Application Status Changes**
**Trigger**: When admin or sponsor changes application status

**Student Receives Notification**:
- Status update
- Next steps
- Relevant information

**Examples for Student**:
```
👀 Application Under Review
Your application for AWS Cloud Practitioner is now being reviewed by our team.

✅ Stage 1 Approved!
Congratulations! Your application for AWS Cloud Practitioner passed initial review.

🤝 Assigned to Sponsor
Great news! A sponsor is now reviewing your AWS Cloud Practitioner application.

🎉 Sponsor Accepted!
Amazing! A sponsor has accepted to fund your AWS Cloud Practitioner certification.

💰 Payment Completed!
Congratulations! Your AWS Cloud Practitioner certification is fully funded. 
You can now schedule your exam!

📋 Application Needs Review
Your AWS Cloud Practitioner application requires some updates. 
Please review the feedback.
```

---

## 📊 Admin Dashboard Views

### 1. **Student Overview** (`admin_student_overview`)
Complete view of all students with:
- Registration date
- Account status
- Quiz status (passed/failed, score, attempts)
- Eligibility status
- Total applications
- Pending applications
- In-progress applications
- Completed applications
- Location
- Last activity date

**SQL Query**:
```sql
SELECT * FROM admin_student_overview
ORDER BY registration_date DESC;
```

---

### 2. **Recent Activity** (`admin_recent_activity`)
Last 24 hours of activity:
- New registrations
- Quiz completions
- New applications

**SQL Query**:
```sql
SELECT * FROM admin_recent_activity
ORDER BY activity_time DESC;
```

---

### 3. **Student Timeline**
Complete activity history for a specific student:
- Account creation
- Quiz attempts (with scores)
- Applications submitted
- Status changes

**SQL Query**:
```sql
SELECT * FROM get_student_timeline('student-id-here')
ORDER BY event_time DESC;
```

---

## 🎯 Admin Features

### Notification Panel
- **Bell icon** with unread count badge
- **Slide-out panel** from right side
- **Filter tabs**: All / Unread
- **Mark as read**: Individual or all at once
- **Auto-refresh**: Every 30 seconds
- **Click notification**: Mark as read
- **Color-coded**: Success (green), Warning (yellow), Info (blue), Error (red)

### Student Monitoring
Admins can see:
1. **Registration Details**
   - When student registered
   - From which country/city
   - Contact information

2. **Quiz Status**
   - Not started
   - In progress
   - Passed (with score)
   - Failed (with score)
   - Number of attempts

3. **Application Progress**
   - Total applications
   - Pending review
   - In progress
   - Completed
   - Rejected

4. **Real-time Updates**
   - Notifications appear instantly
   - Status changes reflected immediately
   - Both admin and student see updates

---

## 🔧 Implementation

### Database Setup

**Run migrations in order**:
```bash
# 1. Quiz system
psql -f database/quiz_system.sql

# 2. Sponsor workflow
psql -f database/sponsor_workflow_update_v2.sql

# 3. Admin notifications
psql -f database/admin_notifications.sql
```

### Add to Admin Dashboard

**File**: `pages/AdminPage.tsx` or `components/admin/AdminDashboard.tsx`

```typescript
import { NotificationPanel } from '../components/admin/NotificationPanel';

// In your component
<NotificationPanel darkMode={darkMode} userId={adminUserId} />
```

### Supabase Helper Functions

**File**: `utils/supabase/adminHelpers.ts`

```typescript
// Get all notifications for admin
export async function getAdminNotifications(adminId: string) {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', adminId)
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
}

// Get unread count
export async function getUnreadCount(adminId: string) {
    const { data, error } = await supabase
        .rpc('get_unread_notification_count', { p_user_id: adminId });
    
    if (error) throw error;
    return data;
}

// Mark notifications as read
export async function markNotificationsRead(adminId: string, notificationIds: string[]) {
    const { error } = await supabase
        .rpc('mark_notifications_read', {
            p_user_id: adminId,
            p_notification_ids: notificationIds
        });
    
    if (error) throw error;
}

// Get student overview
export async function getStudentOverview() {
    const { data, error } = await supabase
        .from('admin_student_overview')
        .select('*')
        .order('registration_date', { ascending: false });
    
    if (error) throw error;
    return data;
}

// Get recent activity
export async function getRecentActivity() {
    const { data, error } = await supabase
        .from('admin_recent_activity')
        .select('*')
        .order('activity_time', { ascending: false });
    
    if (error) throw error;
    return data;
}

// Get student timeline
export async function getStudentTimeline(studentId: string) {
    const { data, error } = await supabase
        .rpc('get_student_timeline', { p_student_id: studentId });
    
    if (error) throw error;
    return data;
}
```

---

## 📱 Real-time Updates

### Enable Supabase Realtime

```typescript
// Subscribe to notifications
const notificationSubscription = supabase
    .channel('notifications')
    .on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${adminId}`
        },
        (payload) => {
            // Add new notification to state
            setNotifications(prev => [payload.new, ...prev]);
            // Show toast notification
            toast.success('New notification received!');
        }
    )
    .subscribe();

// Subscribe to application changes
const applicationSubscription = supabase
    .channel('applications')
    .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'applications'
        },
        (payload) => {
            // Refresh application list
            loadApplications();
        }
    )
    .subscribe();

// Cleanup
return () => {
    notificationSubscription.unsubscribe();
    applicationSubscription.unsubscribe();
};
```

---

## 🎨 UI Components

### Notification Bell
- Position: Top right of admin dashboard
- Badge: Shows unread count
- Animation: Pulse when new notification arrives
- Click: Opens notification panel

### Notification Panel
- Slide from right
- Full height
- Scrollable list
- Filter tabs (All/Unread)
- Mark all as read button
- Individual notification cards
- Color-coded by type
- Timestamp display
- Click to mark as read

### Notification Card
- Icon based on type
- Title (bold)
- Message (description)
- Timestamp
- Unread indicator (orange dot)
- Hover effect
- Click to mark as read

---

## 📈 Analytics & Reporting

### Admin Can Track:
1. **Registration Rate**
   - New students per day/week/month
   - Registration trends

2. **Quiz Performance**
   - Pass rate
   - Average score
   - Common failure points

3. **Application Flow**
   - Conversion rate (registered → applied)
   - Average time to apply
   - Application approval rate

4. **Sponsor Engagement**
   - Acceptance rate
   - Payment completion rate
   - Average funding time

---

## 🔐 Security & Privacy

### RLS Policies
- Admins can only see notifications for their role
- Students can only see their own notifications
- Notifications are user-specific

### Data Protection
- No sensitive data in notifications
- Links require authentication
- Automatic cleanup of old notifications (optional)

---

## ✅ Testing Checklist

- [ ] Admin receives notification on student registration
- [ ] Notification shows correct country and time
- [ ] Admin receives notification on quiz completion
- [ ] Quiz notification shows score and pass/fail
- [ ] Admin receives notification on new application
- [ ] Application notification shows certification name
- [ ] Student receives notification on status change
- [ ] Unread count updates correctly
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Filter tabs work (All/Unread)
- [ ] Notifications auto-refresh
- [ ] Real-time updates work
- [ ] Notification panel opens/closes smoothly
- [ ] Mobile responsive

---

## 🚀 Next Steps

1. ✅ Database migrations completed
2. ✅ Triggers created
3. ✅ Views created
4. ✅ UI components created
5. ⏳ Connect to Supabase
6. ⏳ Enable real-time subscriptions
7. ⏳ Test notification flow
8. ⏳ Deploy to production

---

## 📝 Summary

The admin notification system provides:
- **Real-time monitoring** of all student activities
- **Automatic notifications** for key events
- **Complete visibility** into student progress
- **Easy tracking** of applications and quiz results
- **Professional UI** with smooth animations
- **Mobile-friendly** design

Admins can now efficiently monitor and manage the entire student journey from registration to certification completion!
