import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { UserForm } from '@/components/UserForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ShareOptions } from '@/components/ShareOptions';
import { useToast } from '@/hooks/use-toast';
import { analyzeReport } from '@/utils/api';
import { generatePDF } from '@/utils/pdf';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { motion } from 'framer-motion';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    toast({
      title: "تم رفع الملف بنجاح",
      description: "يمكنك الآن المتابعة مع التحليل.",
    });
  };

  const handleFormSubmit = async (formData: any) => {
    if (!file) {
      toast({
        title: "لم يتم اختيار ملف",
        description: "يرجى رفع تقرير طبي أولاً.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Add retry logic
      let retryCount = 0;
      const maxRetries = 3;
      let response;

      while (retryCount < maxRetries) {
        try {
          response = await analyzeReport({
            image: file,
            age: parseInt(formData.age),
            sex: formData.sex,
            language: formData.language,
          });
          break; // If successful, break the retry loop
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Exponential backoff
        }
      }

      setResults(response);
      toast({
        title: "اكتمل التحليل",
        description: "نتائجك جاهزة للعرض.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "فشل التحليل",
        description: "حدث خطأ أثناء تحليل التقرير. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF('results-container');
      toast({
        title: "تم تحميل PDF",
        description: "تم حفظ تقريرك بصيغة PDF.",
      });
    } catch (error) {
      toast({
        title: "فشل التحميل",
        description: "يرجى المحاولة مرة أخرى لاحقاً.",
        variant: "destructive",
      });
    }
  };

  const handleShareLink = () => {
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط المشاركة إلى الحافظة.",
    });
  };

  const handleShareEmail = () => {
    toast({
      title: "المشاركة عبر البريد الإلكتروني",
      description: "جاري فتح تطبيق البريد الإلكتروني...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            تحليل التقرير الطبي الذكي
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            احصل على تحليل شامل لتقريرك الطبي مع توصيات مخصصة وفقاً لمعايير منظمة الصحة العالمية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:sticky lg:top-8 space-y-8 order-2 lg:order-1"
          >
            {isLoading ? (
              <LoadingState />
            ) : results ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                id="results-container" 
                className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg border border-white/20"
              >
                <ResultsDisplay results={results} />
                <ShareOptions
                  onDownloadPDF={handleDownloadPDF}
                  onShareLink={handleShareLink}
                  onShareEmail={handleShareEmail}
                />
              </motion.div>
            ) : (
              <EmptyState />
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <FileUpload onFileSelect={handleFileSelect} />
            <div className="glass-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <UserForm onSubmit={handleFormSubmit} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;