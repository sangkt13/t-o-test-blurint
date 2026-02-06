import { GoogleGenAI, Type } from "@google/genai";
import { BlueprintData, BlueprintRow, BloomLevel, CompetencyDomain, ExamType, DistributionConstraints } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlueprint = async (
  topic: string, 
  audience: string, 
  numQuestions: number,
  examType: ExamType,
  constraints?: DistributionConstraints
): Promise<BlueprintData> => {
  
  const systemInstruction = `
    Bạn là một chuyên gia giáo dục y khoa (Medical Education Expert). 
    Nhiệm vụ của bạn là tạo ra một "Test Blueprint" (Ma trận đề thi) chi tiết cho một bài kiểm tra y khoa.
    Hãy chia chủ đề lớn thành các chủ đề nhỏ (sub-topics).
    Phân bổ số lượng câu hỏi dựa trên mức độ nhận thức của Bloom (Nhớ, Hiểu, Vận dụng, Phân tích) và các Lĩnh vực năng lực (Competency Domains).
    Tổng số câu hỏi của các hàng phải bằng đúng tổng số câu hỏi được yêu cầu.
  `;

  let userPrompt = `
    Loại kỳ thi: ${examType === 'graduation' ? 'Thi Tốt nghiệp / Tổng hợp (Graduation Exam)' : 'Thi Kết thúc học phần (Module/Subject Exam)'}
    Chủ đề / Chuyên ngành: ${topic}
    Đối tượng sinh viên: ${audience}
    Tổng số câu hỏi: ${numQuestions}
  `;

  if (constraints) {
    userPrompt += `
    \n--- YÊU CẦU CẤU TRÚC ĐẶC BIỆT (TUÂN THỦ NGHIÊM NGẶT) ---
    Bạn PHẢI phân bổ số lượng câu hỏi sao cho tỉ lệ phần trăm xấp xỉ như sau:
    
    1. Phân bố Bloom (Tổng 100%):
       - Nhớ: ${constraints.bloom[BloomLevel.RECALL]}%
       - Hiểu: ${constraints.bloom[BloomLevel.COMPREHENSION]}%
       - Vận dụng: ${constraints.bloom[BloomLevel.APPLICATION]}%
       - Phân tích: ${constraints.bloom[BloomLevel.ANALYSIS]}%
       
    2. Phân bố Năng lực (Competency) (Tổng 100%):
       - Chăm sóc người bệnh: ${constraints.competency[CompetencyDomain.PATIENT_CARE]}%
       - Kiến thức y khoa: ${constraints.competency[CompetencyDomain.MEDICAL_KNOWLEDGE]}%
       - Học tập dựa trên thực hành: ${constraints.competency[CompetencyDomain.PRACTICE_BASED_LEARNING]}%
       - Kỹ năng giao tiếp: ${constraints.competency[CompetencyDomain.COMMUNICATION]}%
       - Chuyên nghiệp: ${constraints.competency[CompetencyDomain.PROFESSIONALISM]}%

    Hãy tính toán số lượng câu hỏi cụ thể cho từng mục dựa trên tổng số câu là ${numQuestions} trước khi tạo các hàng. 
    Ví dụ: Nếu tổng 50 câu và Nhớ là 20%, thì tổng số câu ở cột Nhớ phải là 10 câu.
    `;
  }

  if (examType === 'graduation') {
    userPrompt += `
    LƯU Ý QUAN TRỌNG: Đây là kỳ thi tốt nghiệp tổng hợp. Hãy chia nhỏ nội dung thành các phân môn hoặc lĩnh vực chính của chuyên ngành này.
    `;
  } else {
    userPrompt += `
    Hãy chia chủ đề "${topic}" thành các bài học hoặc chủ đề con cụ thể.
    `;
  }

  userPrompt += `
    Hãy tạo một bảng ma trận. Với mỗi hàng, xác định số lượng câu hỏi cho từng mức độ Bloom và năng lực chính cần đánh giá.
    Đảm bảo tổng số câu hỏi cộng lại chính xác bằng ${numQuestions}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Tiêu đề của ma trận" },
            targetAudience: { type: Type.STRING },
            totalQuestions: { type: Type.INTEGER },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topicName: { type: Type.STRING, description: "Tên chủ đề con hoặc phân môn" },
                  competency: { 
                    type: Type.STRING, 
                    enum: [
                      CompetencyDomain.PATIENT_CARE,
                      CompetencyDomain.MEDICAL_KNOWLEDGE,
                      CompetencyDomain.PRACTICE_BASED_LEARNING,
                      CompetencyDomain.COMMUNICATION,
                      CompetencyDomain.PROFESSIONALISM
                    ]
                  },
                  cognitiveDistribution: {
                    type: Type.OBJECT,
                    properties: {
                      [BloomLevel.RECALL]: { type: Type.INTEGER },
                      [BloomLevel.COMPREHENSION]: { type: Type.INTEGER },
                      [BloomLevel.APPLICATION]: { type: Type.INTEGER },
                      [BloomLevel.ANALYSIS]: { type: Type.INTEGER }
                    },
                    required: [BloomLevel.RECALL, BloomLevel.COMPREHENSION, BloomLevel.APPLICATION, BloomLevel.ANALYSIS]
                  },
                  totalQuestions: { type: Type.INTEGER, description: "Tổng số câu trong hàng này" }
                },
                required: ["topicName", "competency", "cognitiveDistribution", "totalQuestions"]
              }
            }
          },
          required: ["title", "targetAudience", "totalQuestions", "rows"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BlueprintData;
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error generating blueprint:", error);
    throw error;
  }
};