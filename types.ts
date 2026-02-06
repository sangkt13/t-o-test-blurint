export enum BloomLevel {
  RECALL = 'Nhớ',
  COMPREHENSION = 'Hiểu',
  APPLICATION = 'Vận dụng',
  ANALYSIS = 'Phân tích'
}

export enum CompetencyDomain {
  PATIENT_CARE = 'Chăm sóc người bệnh',
  MEDICAL_KNOWLEDGE = 'Kiến thức y khoa',
  PRACTICE_BASED_LEARNING = 'Học tập dựa trên thực hành',
  COMMUNICATION = 'Kỹ năng giao tiếp',
  PROFESSIONALISM = 'Chuyên nghiệp'
}

export type ExamType = 'subject' | 'graduation';
export type GenerationMode = 'auto' | 'manual';

export interface DistributionConstraints {
  bloom: {
    [key in BloomLevel]: number; // Percentage 0-100
  };
  competency: {
    [key in CompetencyDomain]: number; // Percentage 0-100
  };
}

export interface BlueprintRow {
  topicName: string;
  competency: CompetencyDomain;
  cognitiveDistribution: {
    [key in BloomLevel]: number; // Number of questions
  };
  totalQuestions: number;
}

export interface BlueprintData {
  title: string;
  targetAudience: string; // e.g., Y3, Y6, Resident
  totalQuestions: number;
  rows: BlueprintRow[];
}