/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { AcademicsSection } from './components/AcademicsSection.tsx';
import { AdmissionsSection } from './components/AdmissionsSection.tsx';
import { FacilitiesSection } from './components/FacilitiesSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { NoticesSection } from './components/NoticesSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import {
  SchoolSettings,
  Notice,
  AcademicStage,
  Facility,
  GalleryItem
} from './types/index.ts';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

const defaultSettings: SchoolSettings = {
  schoolName: 'IDEAL GLOBAL ISLAMIC ENGLISH MEDIUM SCHOOL, KAMALAPURAM',
  shortName: 'Ideal Global School',
  tagline: 'Shaping Bright Minds. Building Strong Values.',
  heroDescription:
    'Welcome to Ideal Global Islamic English Medium School, Kamalapuram — where quality English-medium education, Islamic values, discipline, creativity, and character development come together.',
  address: 'Opposite Post Office, R.S. Road, Kamalapuram – 516289, Andhra Pradesh, India.',
  landmark: 'Opposite Post Office, R.S. Road',
  city: 'Kamalapuram',
  pincode: '516289',
  state: 'Andhra Pradesh',
  phone: '+91 9963377320',
  displayPhone: '+91 9963377320',
  whatsappNumber: '919963377320',
  email: 'idealglobalschoolkdp@gmail.com',
  workingHours: 'Monday – Saturday: 8:30 AM – 4:30 PM (Sunday Closed)',
  announcement:
    'Admissions Open for Academic Year 2026–2027 from Nursery to Class X! Contact +91 9963377320 for enquiries.',
  announcementActive: true,
  principalMessage:
    'At Ideal Global Islamic English Medium School, we believe every child is blessed with a unique intellect and pure spirit. Our pedagogical journey is crafted to balance contemporary English-medium academics with timeless Islamic ethics, nurturing learners who think critically, behave respectfully, and excel with confidence.',
  principalTitle: 'Head of Institution',
  schoolHistory:
    'Founded with a sacred vision to provide children of Kamalapuram and surrounding areas with exemplary English-medium schooling rooted in Islamic morals, discipline, and modern technological readiness.'
};

export default function App() {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [academics, setAcademics] = useState<AcademicStage[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeSection, setActiveSection] = useState('home');
  const [adminOpen, setAdminOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch initial school data from persistent backend
  const loadPublicData = async () => {
    try {
      const [resSet, resNot, resAcad, resFac, resGal] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/notices'),
        fetch('/api/academics'),
        fetch('/api/facilities'),
        fetch('/api/gallery')
      ]);

      if (resSet.ok) setSettings(await resSet.json());
      if (resNot.ok) setNotices(await resNot.json());
      if (resAcad.ok) setAcademics(await resAcad.json());
      if (resFac.ok) setFacilities(await resFac.json());
      if (resGal.ok) setGallery(await resGal.json());
    } catch (err) {
      console.error('Error fetching school data:', err);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  // Track scroll position for active section & scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['home', 'about', 'academics', 'admissions', 'facilities', 'gallery', 'notices', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || '919963377320'}?text=${encodeURIComponent(
    'Assalamu Alaikum. I would like to enquire about admission at Ideal Global Islamic English Medium School, Kamalapuram.'
  )}`;

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-slate-800 flex flex-col font-sans selection:bg-[#064E3B] selection:text-white">
      {/* 1. Header & Navigation */}
      <Navbar
        settings={settings}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenApplyModal={() => scrollToSection('admissions')}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1">
        <div id="home">
          <Hero
            settings={settings}
            onApplyClick={() => scrollToSection('admissions')}
            onExploreClick={() => scrollToSection('about')}
          />
        </div>

        <AboutSection
          settings={settings}
          onApplyClick={() => scrollToSection('admissions')}
        />

        <AcademicsSection
          academics={academics}
          onApplyClick={() => scrollToSection('admissions')}
        />

        <AdmissionsSection
          settings={settings}
          onEnquirySuccess={() => {
            // Re-fetch data if needed
          }}
        />

        <FacilitiesSection
          facilities={facilities}
          onApplyClick={() => scrollToSection('admissions')}
        />

        <GallerySection gallery={gallery} />

        <NoticesSection notices={notices} />

        <ContactSection settings={settings} />
      </main>

      {/* 3. Footer */}
      <Footer
        settings={settings}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* 4. Staff CMS & Admin Modal */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onRefreshData={loadPublicData}
        initialSettings={settings}
      />

      {/* 5. Floating Quick Action Controls (WhatsApp & Direct Call & Scroll to Top) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2.5 bg-white text-slate-700 hover:text-[#064E3B] rounded-full shadow-md border border-stone-200 hover:bg-stone-50 transition-all cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer text-xs font-semibold"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp Enquiry</span>
        </a>
      </div>
    </div>
  );
}
