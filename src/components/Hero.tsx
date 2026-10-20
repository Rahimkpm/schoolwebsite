import React from 'react';
import { SchoolSettings } from '../types/index.ts';
import { BookOpen, HeartHandshake, Laptop, Compass, CheckCircle2, ChevronRight, PhoneCall } from 'lucide-react';

interface HeroProps {
  settings: SchoolSettings;
  onApplyClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onApplyClick,
  onExploreClick
}) => {
  const heroImage = '/src/assets/images/hero_school_campus_1792501178861.jpg';

  const highlights = [
    {
      title: 'Quality English-Medium Education',
      desc: 'Structured curriculum fostering reading, spoken fluency, numeracy, and foundational sciences from Nursery to Class X.',
      icon: BookOpen
    },
    {
      title: 'Islamic Values & Character Building',
      desc: 'Daily Deeniyat, Quranic phonetics, respectful etiquette (Adaab), and moral integrity woven into school routine.',
      icon: HeartHandshake
    },
    {
      title: 'Student-Centred Learning',
      desc: 'Individualized care, active classroom engagement, friendly mentorship, and supportive academic remediation.',
      icon: Compass
    },
    {
      title: 'Technology-Enabled Education',
      desc: 'Hands-on computer laboratory sessions ensuring every pupil masters practical digital and computer literacy.',
      icon: Laptop
    }
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-4 pb-12 md:pb-16 lg:pb-20 border-b border-stone-200">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#064E3B_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Proposition & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Trust Kicker */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-[#065F46] tracking-wide uppercase">
              <span className="w-6 h-[2px] bg-[#D97706]" />
              <span>Admissions Open for Nursery to Class X</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Shaping Bright Minds.{' '}
              <span className="text-[#064E3B]">Building Strong Values.</span>
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Welcome to <strong className="text-slate-800 font-semibold">{settings.schoolName}</strong> — where quality English-medium education, Islamic values, discipline, creativity, and character development come together in a safe and nurturing campus.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onApplyClick}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-[#064E3B] hover:bg-[#065F46] rounded-md shadow-sm transition-all duration-150 flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-[#064E3B] focus:ring-offset-2"
              >
                <span>Apply for Admission</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-md shadow-2xs transition-all duration-150 flex items-center gap-2 cursor-pointer hover:border-slate-400"
              >
                <span>Explore Our School</span>
              </button>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#064E3B] hover:text-[#065F46] ml-1 py-2"
              >
                <PhoneCall className="w-4 h-4 text-[#D97706]" />
                <span>Call: {settings.displayPhone || settings.phone}</span>
              </a>
            </div>

            {/* Quick Trust Attributes */}
            <div className="pt-2 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-500 border-t border-stone-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
                <span>Nursery to Class X</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
                <span>Opposite Post Office, R.S. Road</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
                <span>Dedicated Faculty</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
                <span>Islamic Moral Education</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-md bg-stone-100 group">
              <img
                src={heroImage}
                alt="Ideal Global Islamic English Medium School Kamalapuram Campus"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[400px] lg:h-[440px] object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
              
              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                <div className="text-xs uppercase tracking-wider font-semibold text-amber-300 mb-1">
                  Kamalapuram Campus
                </div>
                <div className="font-display text-base sm:text-lg font-bold leading-tight">
                  Ideal Global Islamic English Medium School
                </div>
                <div className="text-xs text-stone-200 mt-1 flex items-center justify-between">
                  <span>Opposite Post Office, R.S. Road</span>
                  <span className="font-medium text-amber-300">Est. Kamalapuram</span>
                </div>
              </div>
            </div>

            {/* Subtle Gold Accent Corner */}
            <div className="hidden sm:block absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#D97706] rounded-tr-lg pointer-events-none" />
            <div className="hidden sm:block absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#064E3B] rounded-bl-lg pointer-events-none" />
          </div>
        </div>

        {/* Highlights Strip: 4 Core Pillars */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
              Our Core Educational Pillars
            </h2>
            <p className="text-lg font-bold text-slate-800 font-display mt-1">
              Building Academic Excellence on Foundations of Faith & Character
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-stone-200 hover:border-[#065F46]/40 transition-all duration-200 shadow-2xs hover:shadow-xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-md bg-emerald-50 text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-base text-slate-900 group-hover:text-[#064E3B] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
