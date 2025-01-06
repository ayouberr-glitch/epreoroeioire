// WHO reference ranges for common blood tests
export const WHO_RANGES = {
  'Hemoglobin': {
    male: '13.0-17.0 g/dL',
    female: '12.0-15.0 g/dL',
    description: 'Protein in red blood cells that carries oxygen'
  },
  'White Blood Cells': {
    range: '4.0-11.0 × 10⁹/L',
    description: 'Cells that help fight infection'
  },
  'Platelets': {
    range: '150-450 × 10⁹/L',
    description: 'Blood cells that help with clotting'
  },
  'Glucose': {
    range: '70-100 mg/dL',
    description: 'Blood sugar level'
  },
  'Cholesterol': {
    range: '<200 mg/dL',
    description: 'Total blood cholesterol'
  },
  'HDL': {
    male: '>40 mg/dL',
    female: '>50 mg/dL',
    description: 'Good cholesterol'
  },
  'LDL': {
    range: '<100 mg/dL',
    description: 'Bad cholesterol'
  },
  'Triglycerides': {
    range: '<150 mg/dL',
    description: 'Type of fat in blood'
  },
  'Creatinine': {
    male: '0.7-1.3 mg/dL',
    female: '0.6-1.1 mg/dL',
    description: 'Kidney function marker'
  }
} as const;