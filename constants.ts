import { BloomLevel, CompetencyDomain } from './types';

export const BLOOM_COLORS = {
  [BloomLevel.RECALL]: '#94a3b8', // Slate 400
  [BloomLevel.COMPREHENSION]: '#60a5fa', // Blue 400
  [BloomLevel.APPLICATION]: '#34d399', // Emerald 400
  [BloomLevel.ANALYSIS]: '#f472b6', // Pink 400
};

export const COMPETENCY_LABELS = {
  [CompetencyDomain.PATIENT_CARE]: 'Chăm sóc người bệnh',
  [CompetencyDomain.MEDICAL_KNOWLEDGE]: 'Kiến thức y khoa',
  [CompetencyDomain.PRACTICE_BASED_LEARNING]: 'Học tập & Cải tiến',
  [CompetencyDomain.COMMUNICATION]: 'Giao tiếp & Ứng xử',
  [CompetencyDomain.PROFESSIONALISM]: 'Tính chuyên nghiệp',
};
