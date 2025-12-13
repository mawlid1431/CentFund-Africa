import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, GraduationCap, FileText, DollarSign, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';

export default function ApplicationPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Information
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        nationality: '',
        address: '',
        city: '',
        country: '',

        // Education Information
        education_level: '',
        institution_name: '',
        field_of_study: '',
        graduation_year: '',
        current_gpa: '',

        // Certification Details
        certification_name: '',
        certification_provider: '',
        exam_center: '',
        preferred_exam_date: '',
        certification_cost: '',

        // Motivation & Background
        why_certification: '',
        career_goals: '',
        financial_situation: '',
        previous_certifications: '',

        // Documents
        resume_url: '',
        id_document_url: '',
        transcript_url: '',
        motivation_letter_url: '',
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: any, fieldName: string) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const filePath = `applications/${fileName}`;

            const { error: uploadError } = await supabase!.storage
                .from('application-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase!.storage
                .from('application-documents')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, [fieldName]: publicUrl }));
            toast.success('File uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get current user (or create guest application)
            const { data: { user } } = await supabase!.auth.getUser();

            const applicationData = {
                ...formData,
                applicant_id: user?.id || null,
                status: 'pending',
                current_stage: 1,
                stage1_status: 'pending',
                stage2_status: 'not_started',
            };

            const { data, error } = await supabase!
                .from('applications')
                .insert([applicationData])
                .select()
                .single();

            if (error) throw error;

            toast.success('Application submitted successfully!');
            navigate(`/application-status/${data.id}`);
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Education', icon: GraduationCap },
        { number: 3, title: 'Certification', icon: FileText },
        { number: 4, title: 'Motivation', icon: FileText },
        { number: 5, title: 'Documents', icon: Upload },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Apply for Certification Sponsorship
                    </h1>
                    <p className="text-lg text-gray-600">
                        Complete the application to get sponsored for your professional certification
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStep >= step.number
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {currentStep > step.number ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <step.icon className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`h-1 flex-1 mx-2 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender *
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nationality *
                                    </label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Education Information */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Education Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Education Level *
                                    </label>
                                    <select
                                        name="education_level"
                                        value={formData.education_level}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="high_school">High School</option>
                                        <option value="associate">Associate Degree</option>
                                        <option value="bachelor">Bachelor's Degree</option>
                                        <option value="master">Master's Degree</option>
                                        <option value="phd">PhD</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Institution Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="institution_name"
                                        value={formData.institution_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Field of Study *
                                    </label>
                                    <input
                                        type="text"
                                        name="field_of_study"
                                        value={formData.field_of_study}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Graduation Year
                                    </label>
                                    <input
                                        type="number"
                                        name="graduation_year"
                                        value={formData.graduation_year}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current GPA
                                    </label>
                                    <input
                                        type="text"
                                        name="current_gpa"
                                        value={formData.current_gpa}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 3.5/4.0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Certification Details */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Certification Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certification Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="certification_name"
                                        value={formData.certification_name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., AWS Cloud Practitioner"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certification Provider *
                                    </label>
                                    <input
                                        type="text"
                                        name="certification_provider"
                                        value={formData.certification_provider}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Amazon Web Services"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Exam Center
                                    </label>
                                    <input
                                        type="text"
                                        name="exam_center"
                                        value={formData.exam_center}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Exam Date
                                    </label>
                                    <input
                                        type="date"
                                        name="preferred_exam_date"
                                        value={formData.preferred_exam_date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certification Cost (USD) *
                                    </label>
                                    <input
                                        type="number"
                                        name="certification_cost"
                                        value={formData.certification_cost}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., 100"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Motivation */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Motivation & Background</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Why do you want this certification? *
                                </label>
                                <textarea
                                    name="why_certification"
                                    value={formData.why_certification}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    What are your career goals? *
                                </label>
                                <textarea
                                    name="career_goals"
                                    value={formData.career_goals}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Describe your financial situation *
                                </label>
                                <textarea
                                    name="financial_situation"
                                    value={formData.financial_situation}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Previous Certifications (if any)
                                </label>
                                <textarea
                                    name="previous_certifications"
                                    value={formData.previous_certifications}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 5: Documents */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>

                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Resume/CV *
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload(e, 'resume_url')}
                                        className="w-full"
                                    />
                                    {formData.resume_url && (
                                        <p className="text-sm text-green-600 mt-2">✓ Uploaded</p>
                                    )}
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ID Document *
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, 'id_document_url')}
                                        className="w-full"
                                    />
                                    {formData.id_document_url && (
                                        <p className="text-sm text-green-600 mt-2">✓ Uploaded</p>
                                    )}
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Academic Transcript
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileUpload(e, 'transcript_url')}
                                        className="w-full"
                                    />
                                    {formData.transcript_url && (
                                        <p className="text-sm text-green-600 mt-2">✓ Uploaded</p>
                                    )}
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivation Letter
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload(e, 'motivation_letter_url')}
                                        className="w-full"
                                    />
                                    {formData.motivation_letter_url && (
                                        <p className="text-sm text-green-600 mt-2">✓ Uploaded</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                        )}

                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
