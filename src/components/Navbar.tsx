import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo.tsx';
import { SchoolSettings } from '../types/index.ts';
import { Phone, MessageCircle, Menu, X, Shield, ChevronRight } from 'lucide-react';

interface NavbarProps {
  settings: SchoolSettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenApplyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeSection,
  onNavigate,
  onOpenAdmin,
  onOpenApplyModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'notices', label: 'Notices' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || '919963377320'}?text=${encodeURIComponent(
    'Assalamu Alaikum. I would like to enquire about admission at Ideal Global Islamic English Medium School, Kamalapuram.'
  )}`;

  return (
    <div className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-stone-200">
      {/* 1. Slim Announcement Bar */}
      {settings.announcementActive && settings.announcement && (
        <div className="bg-[#064E3B] text-white text-xs font-medium py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="bg-amber-500 text-stone-900 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded shrink-0">
                Notice
              </span>
              <span className="truncate text-stone-100">{settings.announcement}</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 shrink-0 text-[11px] text-emerald-100">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Call School Office"
              >
                <Phone className="w-3 h-3 text-amber-400" />
                <span>{settings.displayPhone || settings.phone}</span>
              </a>
              <span className="text-emerald-700">|</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3 h-3 text-emerald-300" />
                <span>WhatsApp</span>
              </a>
              <span className="text-emerald-700">|</span>
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
                title="Staff & Admin Portal"
              >
                <Shield className="w-3 h-3" />
                <span>Staff Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Zone */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
          >
            <SchoolLogo size="sm" />
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider text-amber-700 uppercase">
                Ideal Global
              </span>
              <span className="font-display text-sm sm:text-base md:text-lg font-bold text-slate-900 group-hover:text-[#065F46] transition-colors leading-tight">
                Islamic English Medium School
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Kamalapuram, Kadapa Dist. (A.P.)
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap cursor-pointer hover:text-[#065F46] ${
                    isActive ? 'text-[#064E3B] font-semibold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#064E3B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenApplyModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#065F46] rounded-md shadow-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus:ring-2 focus:ring-[#065F46] focus:ring-offset-1"
            >
              <span>Apply for Admission</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-emerald-100/70 text-[#064E3B] font-semibold'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />}
                </button>
              );
            })}

            <div className="pt-4 border-t border-stone-200 flex flex-col gap-2">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-800 bg-white border border-stone-200 rounded-md hover:bg-stone-100"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Call School: {settings.displayPhone || settings.phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-[#059669] rounded-md hover:bg-[#047857]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Admission Enquiry on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-800 text-center justify-center mt-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>School Staff Portal</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
