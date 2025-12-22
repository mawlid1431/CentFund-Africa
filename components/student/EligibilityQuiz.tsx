import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, XCircle, Award, Brain, Calculator, Code, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

interface EligibilityQuizProps {
    darkMode: boolean;
    onQuizComplete: (passed: boolean, score: number) => void;
}

interface Question {
    id: string;
    category: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
}

export function EligibilityQuiz({ darkMode, onQuizComplete }: EligibilityQuizProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ score: number; passed: boolean; message: string } | null>(null);

    useEffect(() => {
        if (quizStarted && !quizSubmitted) {
            const timer = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quizStarted, quizSubmitted]);

    const loadQuestions = async () => {
        setLoading(true);
        // TODO: Load from Supabase using get_random_quiz_questions()
        // For now, using mock data
        const mockQuestions: Question[] = [
            // Grammar questions
            { id: '1', category: 'grammar', question: 'Choose the correct sentence:', option_a: 'She don\'t like apples', option_b: 'She doesn\'t likes apples', option_c: 'She doesn\'t like apples', option_d: 'She not like apples' },
            { id: '2', category: 'grammar', question: 'Which word is a noun?', option_a: 'Quickly', option_b: 'Beautiful', option_c: 'Happiness', option_d: 'Run' },
            // Computer questions
            { id: '11', category: 'computer', question: 'What does CPU stand for?', option_a: 'Central Processing Unit', option_b: 'Computer Personal Unit', option_c: 'Central Program Utility', option_d: 'Computer Processing Utility' },
            { id: '12', category: 'computer', question: 'Which is an input device?', option_a: 'Monitor', option_b: 'Printer', option_c: 'Keyboard', option_d: 'Speaker' },
            // Logic questions
            { id: '21', category: 'logic', question: 'What comes next: 2, 4, 8, 16, __?', option_a: '24', option_b: '32', option_c: '20', option_d: '18' },
            { id: '22', category: 'logic', question: 'If A > B and B > C, then:', option_a: 'A < C', option_b: 'A = C', option_c: 'A > C', option_d: 'Cannot determine' },
            // Mathematics questions
            { id: '31', category: 'mathematics', question: 'What is 15 + 27?', option_a: '42', option_b: '41', option_c: '43', option_d: '40' },
            { id: '32', category: 'mathematics', question: 'What is 12 × 8?', option_a: '84', option_b: '96', option_c: '88', option_d: '92' },
        ];
        setQuestions(mockQuestions);
        setLoading(false);
    };

    const startQuiz = () => {
        loadQuestions();
        setQuizStarted(true);
        setTimeElapsed(0);
    };

    const handleAnswer = (answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestionIndex].id]: answer
        }));
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const submitQuiz = async () => {
        setLoading(true);
        // TODO: Call Supabase evaluate_quiz function
        // Mock evaluation
        const score = Math.floor(Math.random() * 15) + 25; // Random score between 25-40
        const passed = score >= 28;
        const message = passed
            ? `Congratulations! You scored ${score}/40. You are now eligible to apply for programs!`
            : score < 23
                ? `You scored ${score}/40. Unfortunately, you did not pass. Please try again!`
                : `You scored ${score}/40. You need at least 28/40 to pass. Keep trying!`;

        setResult({ score, passed, message });
        setQuizSubmitted(true);
        setLoading(false);

        setTimeout(() => {
            onQuizComplete(passed, score);
        }, 3000);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'grammar': return BookOpen;
            case 'computer': return Code;
            case 'logic': return Brain;
            case 'mathematics': return Calculator;
            default: return Award;
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    if (!quizStarted) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-2xl w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}
                >
                    <div className="text-center mb-8">
                        <Award className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-accent-orange' : 'text-accent-orange'}`} />
                        <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Eligibility Quiz
                        </h1>
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Complete this quiz to become eligible to apply for certification programs
                        </p>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quiz Details:</h3>
                            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <li>• Total Questions: 40 MCQs</li>
                                <li>• Categories: Grammar (10), Computer (10), Logic (10), Mathematics (10)</li>
                                <li>• Pass Score: 28/40 or higher</li>
                                <li>• Fail Score: Below 23/40</li>
                                <li>• Questions are randomized</li>
                                <li>• You can retake if you don't pass</li>
                            </ul>
                        </div>

                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                            <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                                ✓ Pass with 28+ correct answers to unlock program applications
                            </p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startQuiz}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg"
                    >
                        {loading ? 'Loading Questions...' : 'Start Quiz'}
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    if (quizSubmitted && result) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-2xl w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl text-center`}
                >
                    {result.passed ? (
                        <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-500" />
                    ) : (
                        <XCircle className="w-24 h-24 mx-auto mb-6 text-red-500" />
                    )}

                    <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {result.passed ? 'Congratulations! 🎉' : 'Not Quite There Yet'}
                    </h2>

                    <div className={`text-6xl font-bold mb-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                        {result.score}/40
                    </div>

                    <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {result.message}
                    </p>

                    <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Time taken: {formatTime(timeElapsed)}
                        </p>
                    </div>

                    {result.passed && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-lg ${darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}
                        >
                            <p className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                                You can now apply for certification programs!
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto py-8">
                {/* Header */}
                <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Clock className={`w-6 h-6 ${darkMode ? 'text-accent-orange' : 'text-accent-orange'}`} />
                            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {formatTime(timeElapsed)}
                            </span>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-accent-orange to-accent-orange-light"
                        />
                    </div>

                    <div className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Answered: {answeredCount}/{questions.length}
                    </div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    {currentQuestion && (
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className={`p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}
                        >
                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-6">
                                {(() => {
                                    const Icon = getCategoryIcon(currentQuestion.category);
                                    return <Icon className="w-5 h-5 text-accent-orange" />;
                                })()}
                                <span className={`text-sm font-medium capitalize ${darkMode ? 'text-accent-orange' : 'text-accent-orange'}`}>
                                    {currentQuestion.category}
                                </span>
                            </div>

                            {/* Question */}
                            <h3 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {currentQuestion.question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-4">
                                {['A', 'B', 'C', 'D'].map((option) => {
                                    const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                                    const isSelected = answers[currentQuestion.id] === option;

                                    return (
                                        <motion.button
                                            key={option}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(option)}
                                            className={`w-full p-4 rounded-xl text-left transition-all ${isSelected
                                                    ? 'bg-accent-orange text-white border-2 border-accent-orange'
                                                    : darkMode
                                                        ? 'bg-white/5 border-2 border-white/10 hover:border-accent-orange/50 text-white'
                                                        : 'bg-gray-50 border-2 border-gray-200 hover:border-accent-orange/50 text-gray-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isSelected ? 'bg-white text-accent-orange' : darkMode ? 'bg-white/10' : 'bg-gray-200'
                                                    }`}>
                                                    {option}
                                                </div>
                                                <span>{currentQuestion[optionKey]}</span>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-2 ${currentQuestionIndex === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : darkMode
                                    ? 'bg-white/5 text-white hover:bg-white/10'
                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </motion.button>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={submitQuiz}
                            disabled={answeredCount < questions.length || loading}
                            className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-2 ${answeredCount < questions.length || loading
                                    ? 'opacity-50 cursor-not-allowed bg-gray-400'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                }`}
                        >
                            {loading ? 'Submitting...' : 'Submit Quiz'}
                            <CheckCircle className="w-5 h-5" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextQuestion}
                            className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
