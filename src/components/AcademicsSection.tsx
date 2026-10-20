import React, { useState } from 'react';
import { AcademicStage } from '../types/index.ts';
import { BookOpen, GraduationCap, CheckCircle2, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';

interface AcademicsSectionProps {
  academics: AcademicStage[];
  onApplyClick: () => void;
}

export const AcademicsSection: React.FC<AcademicsSectionProps> = ({
  academics,
  onApplyClick
}) => {
  const [activeStageId, setActiveStageId] = useState<string>(academics[0]?.id || 'early-childhood');

  const selectedStage = academics.find((s) => s.id === activeStageId) || academics[0];

  return (
    <section id="academics" className="py-16 md:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
              Curriculum & Academic Structure
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              From Early Childhood to Secondary Mastery
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Comprehensive academic pathways structured across four developmental tiers, blending Andhra Pradesh educational competencies with English fluency, digital literacy, and moral character.
            </p>
          </div>

          <button
            onClick={onApplyClick}
            className="self-start md:self-end px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#065F46] rounded-md transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Admission Enquiry</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stage Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-stone-200/80 rounded-xl mb-10">
          {academics.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all text-left flex flex-col cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#064E3B] shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  {stage.classes.length} Classes
                </span>
                <span className="truncate">{stage.stage}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Showcase */}
        {selectedStage && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 lg:p-10 shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Stage Info & Classes */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706] uppercase tracking-wider mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Age Range: {selectedStage.ageGroup}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {selectedStage.stage}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {selectedStage.summary}
                  </p>
                </div>

                {/* Classes Included Chips */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">
                    Classes in this Stage
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStage.classes.map((cls, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-emerald-50 text-[#064E3B] border border-emerald-200 rounded-md text-xs font-semibold"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pedagogical Focus Area */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">
                    Key Pedagogical Focus
                  </h4>
                  <ul className="space-y-2">
                    {selectedStage.focus.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#065F46] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Subjects & Curriculum Matrix */}
              <div className="lg:col-span-7 bg-[#FAF8F5] p-6 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#064E3B]" />
                    <h4 className="font-display font-semibold text-base text-slate-900">
                      Prescribed Subjects & Activities
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500">
                    {selectedStage.subjects.length} Core Areas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedStage.subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-lg border border-stone-200/90 flex items-center justify-between"
                    >
                      <span className="text-xs sm:text-sm font-medium text-slate-800">
                        {sub}
                      </span>
                      <span className="text-[11px] text-[#065F46] font-semibold">
                        Prescribed
                      </span>
                    </div>
                  ))}
                </div>

                {/* Islamic & Language Integration Note */}
                <div className="mt-6 p-4 bg-emerald-50/70 rounded-lg border border-emerald-200/60">
                  <h5 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider mb-1">
                    Value & Language Integration
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Alongside standard languages (English, Telugu, and Hindi), every class receives structured daily Deeniyat (Islamic studies), Noorani Qaida phonetics, moral etiquettes (Adaab), and English handwriting practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Classes Overview Cards Grid */}
        <div className="mt-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
              Classes Overview
            </span>
            <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
              Complete Educational Spectrum (Nursery to Class X)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { cls: 'Nursery', stage: 'Early Childhood' },
              { cls: 'LKG', stage: 'Early Childhood' },
              { cls: 'UKG', stage: 'Early Childhood' },
              { cls: 'Class I', stage: 'Primary' },
              { cls: 'Class II', stage: 'Primary' },
              { cls: 'Class III', stage: 'Primary' },
              { cls: 'Class IV', stage: 'Primary' },
              { cls: 'Class V', stage: 'Primary' },
              { cls: 'Class VI', stage: 'Middle' },
              { cls: 'Class VII', stage: 'Middle' },
              { cls: 'Class VIII', stage: 'Middle' },
              { cls: 'Class IX', stage: 'Secondary' },
              { cls: 'Class X', stage: 'Secondary' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-lg border border-stone-200 text-center hover:border-[#064E3B] hover:shadow-2xs transition-all"
              >
                <span className="font-display font-bold text-base text-slate-900 block">
                  {item.cls}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {item.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
