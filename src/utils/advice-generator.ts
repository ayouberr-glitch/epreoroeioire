interface AdviceTemplate {
  foods: string[];
  avoidFoods: string[];
  lifestyle: string[];
  supplements?: string[];
}

const DEFAULT_ADVICE_TEMPLATES: Record<string, AdviceTemplate> = {
  default: {
    foods: [
      "الخضروات الورقية الخضراء: السبانخ، الكرنب (غني بالفيتامينات والمعادن)",
      "الفواكه الطازجة: التفاح، البرتقال (مصادر جيدة للألياف والفيتامينات)",
      "البروتينات الخفيفة: السمك، الدجاج (غنية بالبروتين قليل الدهون)",
      "المكسرات: اللوز، الجوز (غنية بالدهون الصحية والمعادن)"
    ],
    avoidFoods: [
      "الأطعمة المقلية والدهنية",
      "المشروبات الغازية والسكرية",
      "الأطعمة المصنعة عالية الصوديوم",
      "الوجبات السريعة"
    ],
    lifestyle: [
      "ممارسة الرياضة المعتدلة لمدة 30 دقيقة يومياً",
      "الحصول على 7-8 ساعات من النوم ليلاً",
      "شرب 8 أكواب من الماء يومياً",
      "تجنب التوتر والإجهاد الزائد"
    ]
  },
  // Add more specific templates for different test types
};

export function generateAdvice(testName: string, status: string): string {
  const template = DEFAULT_ADVICE_TEMPLATES[testName] || DEFAULT_ADVICE_TEMPLATES.default;
  
  let advice = '';
  
  // Add foods section
  advice += "الأطعمة الموصى بها:\n";
  template.foods.forEach(food => {
    advice += `• ${food}\n`;
  });
  
  // Add foods to avoid
  advice += "\nالأطعمة التي يجب تجنبها:\n";
  template.avoidFoods.forEach(food => {
    advice += `• ${food}\n`;
  });
  
  // Add lifestyle recommendations
  advice += "\nتوصيات نمط الحياة:\n";
  template.lifestyle.forEach(tip => {
    advice += `• ${tip}\n`;
  });
  
  // Add supplements if available
  if (template.supplements) {
    advice += "\nالمكملات الغذائية:\n";
    template.supplements.forEach(supplement => {
      advice += `• ${supplement}\n`;
    });
  }
  
  return advice;
}