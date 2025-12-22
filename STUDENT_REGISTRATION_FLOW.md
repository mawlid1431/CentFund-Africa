# Student Registration & Authentication Flow

## Complete User Journey

### 1. **Student Clicks "Apply Now"**
- Redirected to Student Authentication page
- Options: Login or Register

---

### 2. **NEW USER - Registration Flow**

#### Step 1: Create Account
Student fills registration form:
- Full Name
- Email Address
- Phone Number
- City & Country
- Date of Birth
- Password (min 8 characters)
- Confirm Password

**Database Actions:**
```sql
-- Insert into users table
INSERT INTO users (email, password_hash, full_name, phone, role, status)
VALUES ('student@example.com', 'hashed_password', 'John Doe', '+252611234567', 'applicant', 'active');

-- Create eligibility record
INSERT INTO user_eligibility (user_id, quiz_passed, eligible_to_apply)
VALUES ('user-id', FALSE, FALSE);
```

#### Step 2: Take Eligibility Quiz
- **40 Multiple Choice Questions**
  - 10 Grammar questions
  - 10 Computer basics questions
  - 10 Logic questions
  - 10 Mathematics questions
- Questions are **randomized** (different for each student)
- **Time tracked** automatically
- **Pass Score**: 28/40 or higher ✅
- **Fail Score**: Below 23/40 ❌
- **Between 23-27**: Can retake

**Quiz Evaluation:**
```sql
-- Call evaluation function
SELECT * FROM evaluate_quiz(
    'user-id',
    '{"question-id-1": "A", "question-id-2": "C", ...}'::jsonb,
    1200 -- time in seconds
);

-- Returns: score, passed, message
```

#### Step 3A: Quiz PASSED (28+)
- ✅ **Congratulations message**
- User eligibility updated:
```sql
UPDATE user_eligibility 
SET quiz_passed = TRUE, 
    eligible_to_apply = TRUE,
    best_score = 32
WHERE user_id = 'user-id';
```
- **Redirected to**: Student Dashboard
- **Can now**: Apply for programs

#### Step 3B: Quiz FAILED (<23)
- ❌ **"Sorry, try again" message**
- Shows score and feedback
- **Can retake** the quiz
- Different questions next time (randomized)

---

### 3. **EXISTING USER - Login Flow**

#### Step 1: Login
Student enters:
- Email
- Password

**Authentication Check:**
```sql
-- Verify credentials
SELECT u.*, ue.quiz_passed, ue.eligible_to_apply
FROM users u
LEFT JOIN user_eligibility ue ON u.id = ue.user_id
WHERE u.email = 'student@example.com'
AND u.password_hash = 'hashed_password'
AND u.role = 'applicant';
```

#### Step 2: Check Eligibility
**If quiz_passed = FALSE:**
- Redirect to Eligibility Quiz
- Must pass before accessing dashboard

**If quiz_passed = TRUE:**
- Redirect to Student Dashboard
- Full access to apply for programs

---

### 4. **Student Dashboard (After Login)**

#### What Students See:
1. **Stats Cards**
   - Total Applications
   - Pending
   - In Progress
   - Completed

2. **My Applications Tab**
   - List of all applications
   - Progress bars (0-100%)
   - Status badges
   - Real-time updates
   - Sponsor information

3. **Available Projects Tab**
   - Browse certification programs
   - AWS, Cisco, IELTS, CompTIA, etc.
   - "Apply Now" buttons

4. **Application Progress Tracking**
   - Pending (10%)
   - Under Review (25%)
   - Stage 1 Approved (40%)
   - Assigned to Sponsor (55%)
   - Sponsor Accepted (75%)
   - Payment Processing (85%)
   - **Fully Funded! (100%)** 🎉

---

## Database Schema

### Tables Used

#### 1. `users` table
```sql
id UUID PRIMARY KEY
email TEXT UNIQUE
password_hash TEXT
full_name TEXT
phone TEXT
role TEXT ('applicant')
status TEXT ('active')
created_at TIMESTAMP
```

#### 2. `user_eligibility` table
```sql
id UUID PRIMARY KEY
user_id UUID (FK to users)
quiz_passed BOOLEAN
best_score INTEGER
total_attempts INTEGER
last_attempt_at TIMESTAMP
eligible_to_apply BOOLEAN
```

#### 3. `quiz_questions` table
```sql
id UUID PRIMARY KEY
category TEXT ('grammar', 'computer', 'logic', 'mathematics')
question TEXT
option_a TEXT
option_b TEXT
option_c TEXT
option_d TEXT
correct_answer TEXT ('A', 'B', 'C', 'D')
active BOOLEAN
```

#### 4. `quiz_attempts` table
```sql
id UUID PRIMARY KEY
user_id UUID (FK to users)
score INTEGER
total_questions INTEGER (40)
passed BOOLEAN
time_taken_seconds INTEGER
answers JSONB
attempt_number INTEGER
created_at TIMESTAMP
```

#### 5. `applications` table
```sql
id UUID PRIMARY KEY
applicant_id UUID (FK to users)
full_name TEXT
email TEXT
certification_name TEXT
status TEXT
-- ... other fields
```

---

## Implementation Steps

### 1. Update AdminPage.tsx
Add routing for student authentication:
```typescript
const [view, setView] = useState<'auth' | 'quiz' | 'dashboard'>('auth');
const [userId, setUserId] = useState<string | null>(null);
const [needsQuiz, setNeedsQuiz] = useState(false);

const handleAuthSuccess = (id: string, email: string, name: string, needsQuiz: boolean) => {
    setUserId(id);
    localStorage.setItem('userId', id);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    
    if (needsQuiz) {
        setView('quiz');
    } else {
        setView('dashboard');
    }
};

const handleQuizComplete = (passed: boolean, score: number) => {
    if (passed) {
        setView('dashboard');
    } else {
        alert(`Score: ${score}/40. Please try again!`);
        // Stay on quiz page for retake
    }
};

// Render based on view
{view === 'auth' && <StudentAuth darkMode={darkMode} onAuthSuccess={handleAuthSuccess} />}
{view === 'quiz' && <EligibilityQuiz darkMode={darkMode} onQuizComplete={handleQuizComplete} />}
{view === 'dashboard' && <StudentDashboard darkMode={darkMode} ... />}
```

### 2. Create Supabase Helper Functions

**File**: `utils/supabase/studentHelpers.ts`

```typescript
// Register new student
export async function registerStudent(data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    city: string;
    country: string;
    dateOfBirth: string;
}) {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });
    
    if (authError) throw authError;
    
    // 2. Insert into users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
            id: authData.user!.id,
            email: data.email,
            full_name: data.fullName,
            phone: data.phone,
            role: 'applicant',
            status: 'active',
        })
        .select()
        .single();
    
    if (userError) throw userError;
    
    // 3. Create eligibility record
    await supabase.from('user_eligibility').insert({
        user_id: authData.user!.id,
        quiz_passed: false,
        eligible_to_apply: false,
    });
    
    return userData;
}

// Login student
export async function loginStudent(email: string, password: string) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    if (authError) throw authError;
    
    // Check eligibility
    const { data: eligibility } = await supabase
        .from('user_eligibility')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();
    
    return {
        user: authData.user,
        needsQuiz: !eligibility?.quiz_passed,
    };
}

// Get random quiz questions
export async function getQuizQuestions() {
    const { data, error } = await supabase.rpc('get_random_quiz_questions');
    if (error) throw error;
    return data;
}

// Submit quiz answers
export async function submitQuiz(userId: string, answers: Record<string, string>, timeInSeconds: number) {
    const { data, error } = await supabase.rpc('evaluate_quiz', {
        p_user_id: userId,
        p_answers: answers,
        p_time_taken: timeInSeconds,
    });
    
    if (error) throw error;
    return data[0]; // { score, passed, message }
}

// Check if user is eligible
export async function checkEligibility(userId: string) {
    const { data, error } = await supabase
        .from('user_eligibility')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error) throw error;
    return data;
}
```

### 3. Run Database Migrations

```bash
# 1. Run quiz system setup
psql -h your-host -U postgres -d postgres -f database/quiz_system.sql

# 2. Run sponsor workflow update
psql -h your-host -U postgres -d postgres -f database/sponsor_workflow_update_v2.sql
```

---

## Security Features

### Password Requirements
- Minimum 8 characters
- Hashed using bcrypt/Supabase auth
- Never stored in plain text

### Quiz Security
- Questions randomized per attempt
- Correct answers not sent to frontend
- Evaluation done server-side
- Attempt tracking prevents cheating

### Authentication
- JWT tokens via Supabase Auth
- Row Level Security (RLS) policies
- Users can only see their own data

---

## User Experience Flow Chart

```
Student Clicks "Apply"
        ↓
    Has Account?
    ↙         ↘
  YES          NO
   ↓            ↓
Login      Register
   ↓            ↓
Passed Quiz? Create Account
   ↙    ↘       ↓
 YES    NO   Take Quiz
  ↓      ↓      ↓
Dashboard Quiz  Pass?
          ↓    ↙  ↘
      Dashboard  YES  NO
                 ↓    ↓
            Dashboard Retry
```

---

## Testing Checklist

- [ ] New user can register
- [ ] Registration data saved to database
- [ ] User receives 40 random quiz questions
- [ ] Quiz evaluates correctly (28+ pass, <23 fail)
- [ ] Passed users can access dashboard
- [ ] Failed users can retake quiz
- [ ] Existing users can login
- [ ] Login checks quiz eligibility
- [ ] Dashboard shows applications
- [ ] Progress bars update correctly
- [ ] Status changes reflect in real-time

---

## Next Steps

1. ✅ Database migrations completed
2. ✅ UI components created
3. ⏳ Connect Supabase helpers
4. ⏳ Test registration flow
5. ⏳ Test quiz system
6. ⏳ Test login flow
7. ⏳ Deploy to production
