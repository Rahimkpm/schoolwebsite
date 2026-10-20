import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo.tsx';
import { SchoolSettings } from '../types/index.ts';
import { MapPin, Phone, Mail, MessageCircle, Shield, ChevronRight, X } from 'lucide-react';

interface FooterProps {
  settings: SchoolSettings;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();
  const [modalPolicy, setModalPolicy] = useState<'privacy' | 'terms' | null>(null);

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || '919963377320'}?text=${encodeURIComponent(
    'Assalamu Alaikum. I would like to enquire about Ideal Global Islamic English Medium School, Kamalapuram.'
  )}`;

  return (
    <footer className="bg-[#042F24] text-stone-200 pt-16 pb-12 border-t border-[#064E3B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-4">
            <SchoolLogo size="md" showText light />
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-md pt-2">
              Ideal Global Islamic English Medium School provides rigorous modern English-medium instruction combined with Islamic character building, digital education, and discipline in Kamalapuram, Andhra Pradesh.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Enquiry</span>
              </a>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>Call School</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-semibold text-sm text-amber-300 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              {['home', 'about', 'academics', 'admissions', 'facilities', 'gallery', 'notices', 'contact'].map(
                (item) => (
                  <li key={item}>
                    <button
                      onClick={() => onNavigate(item)}
                      className="hover:text-white transition-colors capitalize flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                      <span>{item === 'about' ? 'About Us' : item === 'contact' ? 'Contact Us' : item}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Academic Classes */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-semibold text-sm text-amber-300 uppercase tracking-wider">
              Academic Stages
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Early Childhood (Nursery – UKG)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Primary (Class I – V)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Middle School (Class VI – VIII)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Secondary (Class IX – X)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admissions')}
                  className="hover:text-white transition-colors text-left text-amber-400 font-semibold cursor-pointer"
                >
                  Admissions 2026–2027
                </button>
              </li>
            </ul>
          </div>

          {/* School Contact Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-semibold text-sm text-amber-300 uppercase tracking-wider">
              School Office
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.displayPhone || settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="break-all">{settings.email}</span>
              </div>
              <div className="text-[11px] text-emerald-200/80 pt-1">
                {settings.workingHours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Staff Login */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {currentYear} {settings.schoolName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalPolicy('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-emerald-800">·</span>
            <button
              onClick={() => setModalPolicy('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-emerald-800">·</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy / Terms Modal */}
      {modalPolicy && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setModalPolicy(null)}
        >
          <div
            className="max-w-xl w-full bg-white text-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalPolicy(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
              {modalPolicy === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
            </h3>

            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed max-h-96 overflow-y-auto pr-2">
              {modalPolicy === 'privacy' ? (
                <>
                  <p>
                    <strong>Student & Family Privacy:</strong> Ideal Global Islamic English Medium School, Kamalapuram is committed to safeguarding the privacy and personal data of our students and their guardians.
                  </p>
                  <p>
                    <strong>Data Collected:</strong> Information provided via our online admission enquiry forms (names, contact numbers, email addresses, and student grade details) is collected solely for processing admission inquiries and academic communications.
                  </p>
                  <p>
                    <strong>Photo & Media Consent:</strong> School photographs and classroom media are published only for educational documentation in full compliance with parental consent and modest dress ethics.
                  </p>
                  <p>
                    <strong>No Third-Party Sharing:</strong> We do not sell, rent, or distribute personal information to external commercial marketers.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Website Purpose:</strong> This website is the official portal of Ideal Global Islamic English Medium School, Kamalapuram, established to provide verified school information, admission guidelines, academic curricula, and circulars.
                  </p>
                  <p>
                    <strong>Accuracy:</strong> While every effort is made to maintain up-to-date circulars, parents are encouraged to consult the school office for definitive admissions schedules and formal enrolment formalities.
                  </p>
                  <p>
                    <strong>Intellectual Property:</strong> School emblems, logos, and written curricula are the property of Ideal Global Islamic English Medium School.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-stone-200 text-right">
              <button
                onClick={() => setModalPolicy(null)}
                className="px-4 py-2 bg-[#064E3B] text-white text-xs font-semibold rounded hover:bg-[#065F46] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
