import React, { useState } from 'react';
import { SchoolSettings } from '../types/index.ts';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ContactSectionProps {
  settings: SchoolSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  const mapsQuery = encodeURIComponent(
    'Post Office, R.S. Road, Kamalapuram, Andhra Pradesh 516289'
  );
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || '919963377320'}?text=${encodeURIComponent(
    `Assalamu Alaikum. I am reaching out to Ideal Global Islamic English Medium School, Kamalapuram regarding: ${contactForm.subject || 'School Information'}.`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    setSentSuccess(false);

    if (!contactForm.name.trim() || !contactForm.phone.trim() || !contactForm.message.trim()) {
      setContactError('Please fill in your name, contact phone, and message.');
      return;
    }

    try {
      setSubmitting(true);
      // We route this through the persistent admission enquiry endpoint
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: contactForm.name,
          studentName: contactForm.subject ? `Subject: ${contactForm.subject}` : 'General Enquiry',
          applyingClass: 'Contact Form Message',
          phone: contactForm.phone,
          email: contactForm.email,
          message: contactForm.message
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSentSuccess(true);
      setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setContactError(err.message || 'Failed to submit form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
            Get In Touch
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Visit Our Campus or Reach Out to Us
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Conveniently situated in Kamalapuram opposite the Post Office on R.S. Road. We welcome parent visits and inquiries during school hours.
          </p>
        </div>

        {/* 2-Column Split: Contact Cards & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Campus Address Card */}
            <div className="p-6 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-[#064E3B] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    School Campus Location
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                    {settings.schoolName}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                    {settings.address}
                  </p>
                  <div className="mt-3">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] hover:text-[#065F46]"
                    >
                      <span>Open Location in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Telephone & WhatsApp Card */}
            <div className="p-6 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Call or WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    For admissions, circulars, or general questions:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="px-3.5 py-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-xs font-semibold rounded transition-colors flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{settings.displayPhone || settings.phone}</span>
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded transition-colors flex items-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email & Working Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200">
                <div className="flex items-center gap-2 text-[#064E3B] mb-1">
                  <Mail className="w-4 h-4 text-[#D97706]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Official Email
                  </span>
                </div>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-xs font-medium text-slate-700 hover:text-[#064E3B] break-all block mt-1"
                >
                  {settings.email}
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200">
                <div className="flex items-center gap-2 text-[#064E3B] mb-1">
                  <Clock className="w-4 h-4 text-[#D97706]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Office Hours
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {settings.workingHours}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs">
            <div className="mb-6">
              <h3 className="font-display font-bold text-xl text-slate-900">
                Send a Message to the School
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Have a query regarding fee structure, academic calendar, or visiting hours? Send us a message and our administrative team will reply.
              </p>
            </div>

            {sentSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-lg text-[#064E3B] space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h4 className="font-semibold text-base">Message Received</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Thank you for reaching out. We have logged your enquiry and our staff will respond via phone or email shortly.
                </p>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="mt-2 text-xs font-semibold text-[#064E3B] underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {contactError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{contactError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Syed Imran"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Class VI Admission Enquiry"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-[#064E3B] hover:bg-[#065F46] text-white font-semibold text-sm rounded-md transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {submitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to School</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
