import React, { useState } from 'react';
import { SchoolSettings } from '../types/index.ts';
import {
  FileText,
  CheckCircle,
  HelpCircle,
  Phone,
  MessageCircle,
  Send,
  AlertCircle,
  UserCheck,
  Calendar,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface AdmissionsSectionProps {
  settings: SchoolSettings;
  onEnquirySuccess?: () => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({
  settings,
  onEnquirySuccess
}) => {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    applyingClass: '',
    phone: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResponse, setSuccessResponse] = useState<{ message: string; enquiryId?: string } | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const classesList = [
    'Nursery',
    'LKG',
    'UKG',
    'Class I',
    'Class II',
    'Class III',
    'Class IV',
    'Class V',
    'Class VI',
    'Class VII',
    'Class VIII',
    'Class IX',
    'Class X'
  ];

  const steps = [
    {
      num: '01',
      title: 'Enquiry & Campus Visit',
      desc: 'Submit the online enquiry form below or visit our school office opposite Post Office, Kamalapuram to meet with our admissions counsellors.'
    },
    {
      num: '02',
      title: 'Informal Interaction & Baseline Check',
      desc: 'An encouraging, age-appropriate conversation with the child to evaluate foundational reading, spoken fluency, and class readiness.'
    },
    {
      num: '03',
      title: 'Document Verification',
      desc: 'Submission of original and copies of birth certificate, previous school records (for Classes I–X), student Aadhaar card, and photographs.'
    },
    {
      num: '04',
      title: 'Enrolment & Welcome',
      desc: 'Completion of formal enrolment forms, student handbook issuance, uniform measurement, and welcome kit.'
    }
  ];

  const requiredDocuments = [
    'Child’s Official Birth Certificate (original for verification + 2 photocopies)',
    'Transfer Certificate (T.C.) from previous recognised school (mandatory for Class II and above)',
    'Previous Academic Year Progress Card / Marksheet',
    'Student and Parent/Guardian Aadhaar Card photocopies',
    'Recent passport-size colour photographs of student (4 copies)',
    'Recent passport-size photograph of Father and Mother / Guardian (2 copies)'
  ];

  const faqs = [
    {
      q: 'Which classes are admissions open for in the 2026–2027 academic session?',
      a: 'Admissions are open from Nursery, LKG, UKG up through Secondary Classes (Class I to Class X), subject to seat availability in each respective classroom.'
    },
    {
      q: 'What is the medium of instruction and language policy?',
      a: 'The primary medium of instruction across all scholastic subjects is English. Telugu is taught as the state regional language and Hindi as an essential national language. In addition, basic Arabic phonetics and Deeniyat are integrated daily.'
    },
    {
      q: 'What are the school working and office hours for admissions?',
      a: 'The administrative and admissions office is open Monday through Saturday from 8:30 AM to 4:30 PM (closed on Sundays and declared government holidays). Parents are welcome to visit without prior appointment during these hours.'
    },
    {
      q: 'Does the school provide Islamic moral education for all students?',
      a: 'Yes, moral education, daily supplications (Duas), Noorani Qaida phonetics, and life values are integral to our student character development curriculum.'
    },
    {
      q: 'How can parents track their child’s academic progress?',
      a: 'We maintain regular communication through student diaries, unit test reports, term assessment cards, and scheduled parent-teacher meetings.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessResponse(null);

    // Basic frontend checks
    if (!formData.parentName.trim() || !formData.studentName.trim()) {
      setErrorMessage('Please provide both Parent/Guardian name and Student name.');
      return;
    }
    if (!formData.applyingClass) {
      setErrorMessage('Please select the class applying for.');
      return;
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    const phonePattern = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!phonePattern.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g., 9963377320).');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccessResponse({
        message: data.message || 'Your enquiry has been submitted successfully!',
        enquiryId: data.enquiryId
      });

      setFormData({
        parentName: '',
        studentName: '',
        applyingClass: '',
        phone: '',
        email: '',
        message: ''
      });

      if (onEnquirySuccess) {
        onEnquirySuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || '919963377320'}?text=${encodeURIComponent(
    'Assalamu Alaikum. I would like to enquire about admission at Ideal Global Islamic English Medium School, Kamalapuram.'
  )}`;

  return (
    <section id="admissions" className="py-16 md:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Callout */}
        <div className="p-6 md:p-8 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#065F46] text-white mb-16 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
              Session 2026 – 2027
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Admissions Open: Nursery to Class X
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Limited seats per class to guarantee personal attention and sound values. Apply early to secure your child’s enrolment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="px-4 py-2.5 bg-white text-[#064E3B] font-semibold text-xs sm:text-sm rounded hover:bg-stone-100 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#D97706]" />
              <span>{settings.displayPhone || settings.phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs sm:text-sm rounded transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* Admission Procedure (4 Steps) */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
              How to Apply
            </span>
            <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
              Simple 4-Step Admission Procedure
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-6 rounded-xl border border-stone-200 relative flex flex-col justify-between"
              >
                <div>
                  <span className="font-display text-2xl font-black text-[#D97706] block mb-3">
                    {st.num}
                  </span>
                  <h4 className="font-display font-bold text-base text-slate-900 mb-2">
                    {st.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Admission Form + Required Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs">
            <div className="mb-6">
              <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
                Online Enquiry
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                Student Admission Enquiry Form
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Please complete the form below. Our admissions coordinator will get in touch with you promptly.
              </p>
            </div>

            {successResponse ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-lg text-[#064E3B] space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h4 className="font-semibold text-base">Enquiry Registered Successfully</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {successResponse.message}
                </p>
                {successResponse.enquiryId && (
                  <p className="text-xs font-mono bg-white p-2 rounded border border-emerald-200 text-emerald-800">
                    Reference ID: {successResponse.enquiryId}
                  </p>
                )}
                <button
                  onClick={() => setSuccessResponse(null)}
                  className="mt-3 text-xs font-semibold text-[#064E3B] underline cursor-pointer"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Parent Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parent / Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shaik Mohammed"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
                    />
                  </div>

                  {/* Student Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zayan Shaik"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Applying Class */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Class Applying For <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.applyingClass}
                      onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
                    >
                      <option value="">-- Select Class --</option>
                      {classesList.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
                    />
                  </div>
                </div>

                {/* Email Optional */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="parent.email@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Questions or Special Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your child's previous schooling or any queries you may have..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#064E3B] hover:bg-[#065F46] text-white font-semibold text-sm rounded-md transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span>Registering Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Admission Enquiry</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center">
                  Your information is kept strictly confidential and used solely for admission communication.
                </p>
              </form>
            )}
          </div>

          {/* Right Column: Required Documents & Direct Office Visit */}
          <div className="lg:col-span-5 space-y-6">
            {/* Required Documents Card */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-2 text-[#064E3B] mb-4">
                <FileText className="w-5 h-5 text-[#D97706]" />
                <h4 className="font-display font-bold text-lg text-slate-900">
                  Required Documents Checklist
                </h4>
              </div>

              <ul className="space-y-3">
                {requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-[#065F46] shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-stone-200">
                <p className="text-xs text-slate-500 italic">
                  Note: For Nursery & LKG admissions, transfer certificate is not required. Original birth certificate will be verified and returned immediately.
                </p>
              </div>
            </div>

            {/* School Office Walk-in Details */}
            <div className="bg-[#FAF8F5] p-6 rounded-xl border border-stone-200 space-y-3">
              <span className="text-xs font-semibold text-[#065F46] uppercase tracking-wider">
                Direct Campus Enquiries
              </span>
              <h4 className="font-display font-bold text-base text-slate-900">
                Visit School Office in Person
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {settings.address}
              </p>
              <div className="text-xs text-slate-700 pt-1 space-y-1">
                <div>
                  <strong>Hours:</strong> {settings.workingHours}
                </div>
                <div>
                  <strong>Phone:</strong> {settings.displayPhone || settings.phone}
                </div>
                <div>
                  <strong>Email:</strong> {settings.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admissions FAQs Accordion */}
        <div className="max-w-3xl mx-auto pt-6">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
              Frequently Asked Questions
            </span>
            <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
              Admissions & School Life FAQs
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-stone-200 rounded-lg overflow-hidden bg-white transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-800 hover:text-[#064E3B] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'transform rotate-180 text-[#064E3B]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-stone-100 leading-relaxed bg-[#FAF8F5]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
