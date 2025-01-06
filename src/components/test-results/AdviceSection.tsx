import React from 'react';
import {
  Utensils,
  XCircle,
  Activity,
  Pill,
  Timer,
  Heart,
  Leaf,
  Apple,
  Coffee,
  Dumbbell,
  Moon,
  Brain,
  Sandwich,
  Beef,
  Fish,
  Carrot,
  Salad,
} from 'lucide-react';

interface AdviceSectionProps {
  advice: string;
}

export const AdviceSection = ({ advice }: AdviceSectionProps) => {
  const formatAdviceSection = (section: string, icon: React.ReactNode, bgColor: string) => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    // Remove markdown-style formatting and asterisks
    const cleanTitle = lines[0].replace(/[*#]/g, '').trim();

    return (
      <div className={`mt-4 p-6 rounded-xl ${bgColor} shadow-lg transition-all duration-300 hover:shadow-xl`}>
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-xl font-bold text-gray-900 font-noto-sans-arabic">
            {cleanTitle.replace(':', '')}
          </h3>
        </div>
        <ul className="space-y-4">
          {lines.slice(1).map((line, idx) => {
            // Remove asterisks and other markdown formatting
            const cleanLine = line.trim().replace(/\*\*/g, '').replace(/\*/g, '');
            return (
              <li key={idx} className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed font-noto-sans-arabic">
                  {cleanLine}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Split advice into sections and format each section with appropriate icons
  const sections = advice.split('\n\n');
  const formattedSections = sections.map(section => {
    if (section.toLowerCase().includes('الأطعمة الموصى')) {
      return formatAdviceSection(section, <Utensils className="w-6 h-6 text-green-600" />, 'bg-green-50');
    }
    if (section.toLowerCase().includes('الأطعمة التي يجب تجنبها')) {
      return formatAdviceSection(section, <XCircle className="w-6 h-6 text-red-600" />, 'bg-red-50');
    }
    if (section.toLowerCase().includes('توصيات نمط الحياة')) {
      return formatAdviceSection(section, <Activity className="w-6 h-6 text-blue-600" />, 'bg-blue-50');
    }
    if (section.toLowerCase().includes('المكملات الغذائية')) {
      return formatAdviceSection(section, <Pill className="w-6 h-6 text-purple-600" />, 'bg-purple-50');
    }
    return formatAdviceSection(section, <Heart className="w-6 h-6 text-gray-600" />, 'bg-gray-50');
  });

  return <div className="space-y-6">{formattedSections}</div>;
};