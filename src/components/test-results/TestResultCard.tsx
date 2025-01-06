import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AdviceSection } from './AdviceSection';
import { WHO_RANGES } from '@/utils/reference-ranges';
import { parseRange, parseValue, analyzeStatus } from '@/utils/test-analysis';

interface TestResultCardProps {
  name: string;
  value: string;
  range?: string;
  status?: string;
  advice?: string;
  sex?: 'male' | 'female';
}

export const TestResultCard = ({ 
  name, 
  value, 
  range, 
  status: initialStatus, 
  advice: providedAdvice,
  sex 
}: TestResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get WHO range if no range provided
  const whoRange = WHO_RANGES[name];
  const referenceRange = range || (whoRange && (
    sex ? (whoRange[sex] || whoRange.range) : whoRange.range
  ));

  // Parse and analyze status
  const numericValue = parseValue(value);
  const parsedRange = parseRange(referenceRange);
  const status = initialStatus || analyzeStatus(numericValue, parsedRange);

  const getStatusColor = (status: string) => {
    if (status.includes('ضمن المعدل الطبيعي')) return 'text-green-600';
    if (status.includes('بشكل طفيف')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-noto-sans-arabic">{name}</h3>
        </div>
        <span className={cn(
          "text-sm font-medium px-3 py-1 rounded-full text-center md:text-left",
          getStatusColor(status)
        )}>
          {status}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-500">القيمة:</span>
          <div className="text-xl md:text-2xl font-bold text-blue-600">{value}</div>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-500">النطاق المرجعي:</span>
          <div className="text-base md:text-lg text-gray-900 font-medium">
            {referenceRange || 'غير متوفر'}
            {!range && whoRange && (
              <span className="text-xs px-2 py-1 ml-2 rounded-full bg-blue-50 text-blue-600">
                WHO Reference
              </span>
            )}
          </div>
        </div>
      </div>

      {providedAdvice && <AdviceSection advice={providedAdvice} />}
    </Card>
  );
};