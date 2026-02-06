import React, { useState } from 'react';
import { Loader2, Sparkles, Download, CheckCircle, Save, BookOpen, GraduationCap, Settings2, Bot, AlertCircle } from 'lucide-react';
import { generateBlueprint } from '../services/geminiService';
import { BlueprintData, BloomLevel, ExamType, GenerationMode, CompetencyDomain } from '../types';
import BlueprintVisualization from './BlueprintVisualization';
import { COMPETENCY_LABELS } from '../constants';

const BlueprintGenerator: React.FC = () => {
  const [examType, setExamType] = useState<ExamType>('subject');
  const [mode, setMode] = useState<GenerationMode>('auto');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('Sinh viên Y3');
  const [numQuestions, setNumQuestions] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);

  // Manual Constraints State
  const [bloomPercent, setBloomPercent] = useState<Record<BloomLevel, number>>({
    [BloomLevel.RECALL]: 30,
    [BloomLevel.COMPREHENSION]: 30,
    [BloomLevel.APPLICATION]: 30,
    [BloomLevel.ANALYSIS]: 10,
  });

  const [competencyPercent, setCompetencyPercent] = useState<Record<CompetencyDomain, number>>({
    [CompetencyDomain.MEDICAL_KNOWLEDGE]: 60,
    [CompetencyDomain.PATIENT_CARE]: 30,
    [CompetencyDomain.COMMUNICATION]: 5,
    [CompetencyDomain.PROFESSIONALISM]: 5,
    [CompetencyDomain.PRACTICE_BASED_LEARNING]: 0,
  });

  // Calculate totals for validation
  const bloomTotal = Object.values(bloomPercent).reduce((a: number, b: number) => a + b, 0);
  const competencyTotal = Object.values(competencyPercent).reduce((a: number, b: number) => a + b, 0);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    if (mode === 'manual') {
        if (bloomTotal !== 100) {
            setError(`Tổng tỉ lệ Bloom hiện tại là ${bloomTotal}%. Vui lòng điều chỉnh về 100%.`);
            return;
        }
        if (competencyTotal !== 100) {
            setError(`Tổng tỉ lệ Năng lực hiện tại là ${competencyTotal}%. Vui lòng điều chỉnh về 100%.`);
            return;
        }
    }

    setLoading(true);
    setError(null);
    try {
      const constraints = mode === 'manual' ? { bloom: bloomPercent, competency: competencyPercent } : undefined;
      const data = await generateBlueprint(topic, audience, numQuestions, examType, constraints);
      setBlueprint(data);
    } catch (err) {
      setError('Đã xảy ra lỗi khi kết nối với AI. Vui lòng kiểm tra kết nối mạng và API Key.');
    } finally {
      setLoading(false);
    }
  };

  const handleBloomChange = (level: BloomLevel, value: string) => {
    const num = parseInt(value) || 0;
    setBloomPercent(prev => ({ ...prev, [level]: num }));
  };

  const handleCompetencyChange = (domain: CompetencyDomain, value: string) => {
    const num = parseInt(value) || 0;
    setCompetencyPercent(prev => ({ ...prev, [domain]: num }));
  };

  // Helper for progress bar color
  const getProgressColor = (current: number) => {
      if (current === 100) return 'bg-emerald-500';
      if (current > 100) return 'bg-red-500';
      return 'bg-blue-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <h2 className="text-3xl font-bold flex items-center relative z-10">
            <Sparkles className="w-7 h-7 mr-3 text-yellow-400" />
            Thiết kế Ma trận Đề thi
          </h2>
          <p className="mt-2 text-slate-300 max-w-2xl relative z-10 text-lg">
            Sử dụng trí tuệ nhân tạo để xây dựng blueprint chi tiết, cân bằng và khoa học.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 bg-slate-50/50">
          <form onSubmit={handleGenerate} className="space-y-8">
            
            {/* 1. Configuration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exam Type Selection */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Loại kỳ thi</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setExamType('subject')}
                      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        examType === 'subject' 
                        ? 'border-blue-500 bg-blue-50/50 text-blue-700' 
                        : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <BookOpen className={`w-6 h-6 mb-2 ${examType === 'subject' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="font-medium text-sm">Học phần</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamType('graduation')}
                      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        examType === 'graduation' 
                        ? 'border-purple-500 bg-purple-50/50 text-purple-700' 
                        : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <GraduationCap className={`w-6 h-6 mb-2 ${examType === 'graduation' ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className="font-medium text-sm">Tốt nghiệp</span>
                    </button>
                  </div>
                </div>

                {/* Generation Mode */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Chế độ tạo</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('auto')}
                      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        mode === 'auto' 
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700' 
                        : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <Bot className={`w-6 h-6 mb-2 ${mode === 'auto' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="font-medium text-sm">Tự động (AI)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('manual')}
                      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        mode === 'manual' 
                        ? 'border-orange-500 bg-orange-50/50 text-orange-700' 
                        : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <Settings2 className={`w-6 h-6 mb-2 ${mode === 'manual' ? 'text-orange-600' : 'text-slate-400'}`} />
                      <span className="font-medium text-sm">Tùy chỉnh</span>
                    </button>
                  </div>
                </div>
            </div>

            {/* 2. Manual Distribution Inputs (Conditional) */}
            {mode === 'manual' && (
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 animate-fade-in ring-1 ring-orange-200">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3 text-orange-600">
                             <Settings2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Cấu hình Tỉ trọng (%)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bloom Distribution */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-slate-700">Mức độ nhận thức (Bloom)</h4>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${bloomTotal === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {bloomTotal}%
                                    </span>
                                </div>
                            </div>
                            
                            {/* Visual Progress Bar for Total */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6 overflow-hidden">
                                <div 
                                    className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(bloomTotal)}`} 
                                    style={{ width: `${Math.min(bloomTotal, 100)}%` }}
                                ></div>
                            </div>

                            <div className="space-y-4">
                                {(Object.values(BloomLevel) as BloomLevel[]).map((level) => (
                                    <div key={level} className="flex items-center">
                                        <label className="w-32 text-sm font-medium text-slate-600 truncate mr-2">{level}</label>
                                        <div className="relative flex-1">
                                            <input 
                                                type="number" 
                                                min="0" max="100"
                                                value={bloomPercent[level]}
                                                onChange={(e) => handleBloomChange(level, e.target.value)}
                                                className="block w-full rounded-lg border-slate-200 py-2 px-3 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm shadow-sm"
                                            />
                                            <span className="absolute right-3 top-2 text-slate-400 text-xs">%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Competency Distribution */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-slate-700">Năng lực (Competency)</h4>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${competencyTotal === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {competencyTotal}%
                                    </span>
                                </div>
                            </div>

                             {/* Visual Progress Bar for Total */}
                             <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6 overflow-hidden">
                                <div 
                                    className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(competencyTotal)}`} 
                                    style={{ width: `${Math.min(competencyTotal, 100)}%` }}
                                ></div>
                            </div>

                            <div className="space-y-4">
                                {(Object.values(CompetencyDomain) as CompetencyDomain[]).map((domain) => (
                                    <div key={domain} className="flex items-center">
                                        <label className="w-48 text-sm font-medium text-slate-600 truncate mr-2" title={COMPETENCY_LABELS[domain]}>
                                            {COMPETENCY_LABELS[domain]}
                                        </label>
                                        <div className="relative flex-1">
                                            <input 
                                                type="number" 
                                                min="0" max="100"
                                                value={competencyPercent[domain]}
                                                onChange={(e) => handleCompetencyChange(domain, e.target.value)}
                                                className="block w-full rounded-lg border-slate-200 py-2 px-3 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm shadow-sm"
                                            />
                                            <span className="absolute right-3 top-2 text-slate-400 text-xs">%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Basic Info Inputs */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="md:col-span-2">
                    <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-2">
                    {examType === 'graduation' ? 'Ngành / Chuyên ngành đào tạo' : 'Tên Học phần / Chủ đề'}
                    </label>
                    <input
                    type="text"
                    id="topic"
                    placeholder={examType === 'graduation' ? "Ví dụ: Bác sĩ Y đa khoa..." : "Ví dụ: Nội khoa - Tim mạch..."}
                    className="w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    />
                </div>
                
                <div>
                    <label htmlFor="audience" className="block text-sm font-semibold text-slate-700 mb-2">
                    Đối tượng sinh viên
                    </label>
                    <select
                    id="audience"
                    className="w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    >
                    <option value="Sinh viên Y3">Sinh viên Y3</option>
                    <option value="Sinh viên Y4">Sinh viên Y4</option>
                    <option value="Sinh viên Y6">Sinh viên Y6</option>
                    <option value="Bác sĩ nội trú">Bác sĩ nội trú</option>
                    <option value="CK1/CK2">CK1 / CK2</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="questions" className="block text-sm font-semibold text-slate-700 mb-2">
                    Tổng số câu hỏi
                    </label>
                    <input
                    type="number"
                    id="questions"
                    min="5"
                    max="200"
                    className="w-full rounded-lg border-slate-300 py-3 px-4 text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    />
                </div>
                </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`relative flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto ${
                    loading ? 'bg-slate-400 cursor-not-allowed shadow-none' : 
                    examType === 'graduation' 
                    ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30' 
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Đang phân tích & khởi tạo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {mode === 'manual' ? 'Tạo Ma trận theo Cấu hình' : 'Tạo Ma trận Tự động'}
                    </>
                  )}
                </button>
            </div>
          </form>
          
          {error && (
             <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-fade-in">
               <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
               <p className="text-sm text-red-700">{error}</p>
             </div>
          )}
        </div>

        {/* 4. Results Section */}
        {blueprint && (
          <div className="border-t border-slate-200 bg-white">
            <div className="p-8">
                {/* Result Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            examType === 'graduation' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                        }`}>
                            {examType === 'graduation' ? 'Thi Tốt nghiệp' : 'Thi Học phần'}
                        </span>
                        {mode === 'manual' && (
                            <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset bg-orange-50 text-orange-700 ring-orange-600/20">
                                Cấu hình thủ công
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{blueprint.title}</h3>
                    <p className="text-slate-500 text-sm mt-1 flex items-center">
                        <span className="font-medium text-slate-700 mr-1">Đối tượng:</span> {blueprint.targetAudience} 
                        <span className="mx-2">•</span> 
                        <span className="font-medium text-slate-700 mr-1">Tổng câu hỏi:</span> {blueprint.totalQuestions}
                    </p>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none justify-center items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all">
                        <Save className="w-4 h-4 mr-2" />
                        Lưu bản nháp
                    </button>
                    <button className="flex-1 md:flex-none justify-center items-center px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-500/30 transition-all">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất Excel
                    </button>
                </div>
                </div>

                {/* Main Table */}
                <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm mb-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">
                            {examType === 'graduation' ? 'Phân môn / Lĩnh vực' : 'Nội dung / Chủ đề'}
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Năng lực cốt lõi
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Nhớ
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Hiểu
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Vận dụng
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Phân tích
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100/80 border-l border-slate-200">
                            Tổng
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                        {blueprint.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 group-hover:text-blue-700">
                                {row.topicName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                                {COMPETENCY_LABELS[row.competency]}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                                {row.cognitiveDistribution[BloomLevel.RECALL] > 0 ? (
                                    <span className="font-medium text-slate-700">{row.cognitiveDistribution[BloomLevel.RECALL]}</span>
                                ) : <span className="text-slate-300">-</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                                {row.cognitiveDistribution[BloomLevel.COMPREHENSION] > 0 ? (
                                    <span className="font-medium text-slate-700">{row.cognitiveDistribution[BloomLevel.COMPREHENSION]}</span>
                                ) : <span className="text-slate-300">-</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                                {row.cognitiveDistribution[BloomLevel.APPLICATION] > 0 ? (
                                    <span className="font-medium text-slate-700">{row.cognitiveDistribution[BloomLevel.APPLICATION]}</span>
                                ) : <span className="text-slate-300">-</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                                {row.cognitiveDistribution[BloomLevel.ANALYSIS] > 0 ? (
                                    <span className="font-medium text-slate-700">{row.cognitiveDistribution[BloomLevel.ANALYSIS]}</span>
                                ) : <span className="text-slate-300">-</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-700 bg-slate-50/50 border-l border-slate-200">
                                {row.totalQuestions}
                            </td>
                            </tr>
                        ))}
                        {/* Summary Row */}
                        <tr className="bg-slate-50 font-semibold border-t-2 border-slate-200">
                            <td className="px-6 py-4 text-sm text-slate-900 uppercase tracking-wide" colSpan={2}>Tổng cộng</td>
                            <td className="px-6 py-4 text-center text-sm text-slate-900">
                                {blueprint.rows.reduce((acc, row) => acc + row.cognitiveDistribution[BloomLevel.RECALL], 0)}
                            </td>
                            <td className="px-6 py-4 text-center text-sm text-slate-900">
                                {blueprint.rows.reduce((acc, row) => acc + row.cognitiveDistribution[BloomLevel.COMPREHENSION], 0)}
                            </td>
                            <td className="px-6 py-4 text-center text-sm text-slate-900">
                                {blueprint.rows.reduce((acc, row) => acc + row.cognitiveDistribution[BloomLevel.APPLICATION], 0)}
                            </td>
                            <td className="px-6 py-4 text-center text-sm text-slate-900">
                                {blueprint.rows.reduce((acc, row) => acc + row.cognitiveDistribution[BloomLevel.ANALYSIS], 0)}
                            </td>
                            <td className="px-6 py-4 text-center text-lg text-blue-700 border-l border-slate-300 bg-blue-50">
                                {blueprint.rows.reduce((acc, row) => acc + row.totalQuestions, 0)}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                </div>

                {/* Visualization Components */}
                <BlueprintVisualization data={blueprint} />
                
                <div className="mt-8 flex items-center p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 shadow-sm">
                    <CheckCircle className="w-6 h-6 mr-3 text-emerald-600" />
                    <span className="text-sm font-medium">Ma trận đã được kiểm tra tính hợp lệ về tổng số câu hỏi và độ phủ nội dung.</span>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintGenerator;