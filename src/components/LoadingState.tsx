import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
  <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
    <p className="text-lg text-gray-600 font-noto-sans-arabic">جاري تحليل تقريرك...</p>
  </div>
);