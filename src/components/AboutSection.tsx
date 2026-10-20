import React from 'react';
import { SchoolSettings } from '../types/index.ts';
import { Eye, Target, Sparkles, BookOpen, Users, ShieldCheck, Award } from 'lucide-react';

interface AboutSectionProps {
  settings: SchoolSettings;
  onApplyClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onApplyClick }) => {
  const classroomImage = '/src/assets/images/classroom_learning_1792501180266.jpg';

  const principles = [
    {
      title: 'Academic Excellence',
      desc: 'Rigorous English-medium curriculum focusing on conceptual mastery in Mathematics, Sciences, Languages (English, Telugu, Hindi), and Social Studies with regular assessments.',
      icon: BookOpen
    },
    {
      title: 'Moral & Spiritual Growth',
      desc: 'Structured Islamic studies (Deeniyat, basic Tajweed, Prophet’s sunnah and etiquettes) instilling integrity, truthfulness, humility, and compassion towards society.',
      icon: ShieldCheck
    },
    {
      title: 'Individual Student Care',
      desc: 'Optimal teacher-to-student ratios allowing teachers to closely track reading progress, handwriting, numeracy development, and emotional well-being.',
      icon: Sparkles
    },
    {
      title: 'Partnership with Parents',
      desc: 'Regular parent-teacher meetings, transparent feedback through student diaries, and proactive communication to support each student’s holistic growth.',
      icon: Users
    }
  ];

  return (
    <section id="about" className="py-16 md:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
            About Our Institution
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Nurturing Minds with Knowledge. Guiding Hearts with Faith.
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Ideal Global Islamic English Medium School in Kamalapuram was founded to address a paramount community need: delivering rigorous, modern English-medium education while preserving and honoring timeless Islamic values and ethical character.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Vision Card */}
          <div className="p-8 rounded-xl bg-[#FAF8F5] border border-stone-200 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#064E3B] text-white flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#D97706] tracking-wider uppercase">
                Our Educational Vision
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 mt-1 mb-3">
                Excellence with Moral Integrity
              </h3>
              <blockquote className="text-base text-slate-700 italic border-l-2 border-[#D97706] pl-4 py-1 leading-relaxed">
                “To nurture knowledgeable, confident, disciplined, and compassionate learners who excel academically and uphold strong moral values.”
              </blockquote>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Guiding students to be constructive citizens and devout leaders in their communities.
            </p>
          </div>

          {/* Mission Card */}
          <div className="p-8 rounded-xl bg-[#FAF8F5] border border-stone-200 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#D97706] text-white flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
                Our Core Mission
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 mt-1 mb-3">
                Holistic English-Medium Foundation
              </h3>
              <blockquote className="text-base text-slate-700 italic border-l-2 border-[#064E3B] pl-4 py-1 leading-relaxed">
                “To provide quality English-medium education in a supportive learning environment that encourages curiosity, critical thinking, responsible behaviour, and lifelong learning, while integrating Islamic values into everyday school life.”
              </blockquote>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Empowering students from early childhood through secondary school with equal emphasis on intellect and morality.
            </p>
          </div>
        </div>

        {/* School Philosophy & Authentic Photography Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-md">
              <img
                src={classroomImage}
                alt="Active classroom learning at Ideal Global Islamic English Medium School"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
              <div className="p-4 bg-white border-t border-stone-200">
                <p className="text-xs text-slate-600 italic">
                  Classroom in session: Dedicated teaching staff delivering conceptual instruction with disciplined student participation.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
                Educational Philosophy
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                A Harmonious Synthesis of Modern Academics and Islamic Character
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At Ideal Global Islamic English Medium School, we reject the notion that modern scientific education and religious morality are in opposition. Knowledge (Ilm) is a sacred pursuit that ennobles character, sharpens intellect, and instills social responsibility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {principles.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-4 bg-[#FAF8F5] rounded-lg border border-stone-200/80">
                    <div className="flex items-center gap-2 mb-2 text-[#064E3B]">
                      <Icon className="w-4 h-4 shrink-0" />
                      <h4 className="font-semibold text-xs sm:text-sm text-slate-900">{p.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Principal / Head of Institution Message & School History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 rounded-xl bg-[#064E3B] text-white">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider font-semibold">
              <Award className="w-4 h-4" />
              <span>Head of Institution's Message</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Welcome from the School Leadership
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed italic">
              "{settings.principalMessage}"
            </p>
            <div className="pt-2">
              <div className="font-semibold text-sm text-amber-300">{settings.principalTitle}</div>
              <div className="text-xs text-emerald-200">Ideal Global Islamic English Medium School, Kamalapuram</div>
            </div>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-emerald-800/80 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                School History & Foundation
              </span>
              <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
                {settings.schoolHistory}
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={onApplyClick}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-xs sm:text-sm rounded transition-colors text-center cursor-pointer shadow-sm"
              >
                Inquire for Admission 2026–2027
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
