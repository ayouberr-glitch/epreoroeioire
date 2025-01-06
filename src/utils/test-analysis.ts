interface Range {
  min?: number;
  max?: number;
}

export function parseRange(rangeStr: string): Range {
  // Handle ranges like "0.7-1.3", "<200", ">40"
  if (rangeStr.includes('-')) {
    const [min, max] = rangeStr.split('-').map(Number);
    return { min, max };
  } else if (rangeStr.startsWith('<')) {
    return { max: Number(rangeStr.slice(1)) };
  } else if (rangeStr.startsWith('>')) {
    return { min: Number(rangeStr.slice(1)) };
  }
  return {};
}

export function parseValue(valueStr: string): number {
  // Extract numeric value from string with units
  return Number(valueStr.replace(/[^\d.-]/g, ''));
}

export function analyzeStatus(value: number, range: Range): string {
  const { min, max } = range;
  
  // Calculate thresholds for "slightly" outside range
  const slightlyBelowThreshold = min ? min * 0.9 : null;
  const slightlyAboveThreshold = max ? max * 1.1 : null;

  if (min && max) {
    if (value >= min && value <= max) {
      return 'ضمن المعدل الطبيعي';
    } else if (value >= slightlyBelowThreshold && value <= slightlyAboveThreshold) {
      return 'خارج المعدل الطبيعي - بشكل طفيف';
    } else {
      return 'خارج المعدل الطبيعي - بشكل كبير';
    }
  } else if (min) {
    if (value >= min) {
      return 'ضمن المعدل الطبيعي';
    } else if (value >= slightlyBelowThreshold) {
      return 'خارج المعدل الطبيعي - بشكل طفيف';
    } else {
      return 'خارج المعدل الطبيعي - بشكل كبير';
    }
  } else if (max) {
    if (value <= max) {
      return 'ضمن المعدل الطبيعي';
    } else if (value <= slightlyAboveThreshold) {
      return 'خارج المعدل الطبيعي - بشكل طفيف';
    } else {
      return 'خارج المعدل الطبيعي - بشكل كبير';
    }
  }
  
  return 'غير محدد';
}