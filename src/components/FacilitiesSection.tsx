import React from 'react';
import { Facility } from '../types/index.ts';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

interface FacilitiesSectionProps {
  facilities: Facility[];
  onApplyClick: () => void;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
  onApplyClick
}) => {
  return (
    <section id="facilities" className="py-16 md:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold text-[#065F46] tracking-wider uppercase">
            Campus Infrastructure & Learning Spaces
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Designed for Focus, Safety, and Comprehensive Learning
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Our campus facilities in Kamalapuram are purpose-built to give students an organized, supportive, and spiritually uplifting setting for both scholastic and character growth.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col group"
            >
              {/* Facility Image with Fallback */}
              <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                <img
                  src={fac.image}
                  alt={fac.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded">
                    {fac.category}
                  </span>
                </div>
              </div>

              {/* Facility Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-[#064E3B] transition-colors mb-2">
                    {fac.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {fac.description}
                  </p>
                </div>

                {fac.highlight && (
                  <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-[#065F46] font-medium">
                    <Check className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                    <span>{fac.highlight}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Safety & Environment Assurance */}
        <div className="mt-14 p-6 sm:p-8 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-slate-900">
                Safety, Hygiene & Supervision Commitment
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                Clean purified drinking water, sanitized washrooms, disciplined staff oversight during arrival and dismissal, and an environment of utmost mutual respect.
              </p>
            </div>
          </div>

          <button
            onClick={onApplyClick}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#064E3B] hover:bg-[#065F46] rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Visit Our Campus
          </button>
        </div>
      </div>
    </section>
  );
};
