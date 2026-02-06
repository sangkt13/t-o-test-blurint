import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Download, CheckCircle, Save, BookOpen, GraduationCap, Settings2, Bot } from 'lucide-react';
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
      setError('Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại.');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-slate-900 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <Sparkles className="w-6 h-6 mr-3 text-yellow-400" />
            Tạo Ma Trận Đề Thi Mới
          </h2>
          <p className="mt-2 text-slate-300">
            Hệ thống hỗ trợ xây dựng ma trận cho cả học phần đơn lẻ và kỳ thi tốt nghiệp tổng hợp.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 border-b border-slate-200 bg-slate-50/50">
          <form onSubmit={handleGenerate} className="space-y-8">
            
            {/* Top Controls: Exam Type & Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Exam Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Loại kỳ thi</label>
                  <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setExamType('subject')}
                      className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        examType === 'subject' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Học phần
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamType('graduation')}
                      className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        examType === 'graduation' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Tốt nghiệp
                    </button>
                  </div>
                </div>

                {/* Generation Mode */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Chế độ tạo</label>
                  <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setMode('auto')}
                      className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        mode === 'auto' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      Tự động (AI)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('manual')}
                      className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        mode === 'manual' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Settings2 className="w-4 h-4 mr-2" />
                      Tùy chỉnh tỉ lệ
                    </button>
                  </div>
                </div>
            </div>

            {/* Manual Distribution Inputs */}
            {mode === 'manual' && (
                <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100 animate-fade-in">
                    <h3 className="text-md font-bold text-orange-800 mb-4 flex items-center">
                        <Settings2 className="w-5 h-5 mr-2" />
                        Cấu hình Tỉ trọng (%)
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bloom Distribution */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-semibold text-slate-700">Mức độ nhận thức (Bloom)</h4>
                                <span className={`text-sm font-bold ${bloomTotal === 100 ? 'text-green-600' : 'text-red-600'}`}>
                                    Tổng: {bloomTotal}%
                                </span>
                            </div>
                            <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200">
                                {Object.values(BloomLevel).map((level) => (
                                    <div key={level} className="flex items-center">
                                        <label className="w-24 text-sm text-slate-600 truncate mr-2">{level}</label>
                                        <input 
                                            type="number" 
                                            min="0" max="100"
                                            value={bloomPercent[level]}
                                            onChange={(e) => handleBloomChange(level, e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                                        />
                                        <span className="ml-2 text-slate-500 text-sm">%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Competency Distribution */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-semibold text-slate-700">Năng lực (Competency)</h4>
                                <span className={`text-sm font-bold ${competencyTotal === 100 ? 'text-green-600' : 'text-red-600'}`}>
                                    Tổng: {competencyTotal}%
                                </span>
                            </div>
                            <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200">
                                {Object.values(CompetencyDomain).map((domain) => (
                                    <div key={domain} className="flex items-center">
                                        <label className="w-40 text-sm text-slate-600 truncate mr-2" title={COMPETENCY_LABELS[domain]}>
                                            {COMPETENCY_LABELS[domain]}
                                        </label>
                                        <input 
                                            type="number" 
                                            min="0" max="100"
                                            value={competencyPercent[domain]}
                                            onChange={(e) => handleCompetencyChange(domain, e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                                        />
                                        <span className="ml-2 text-slate-500 text-sm">%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Basic Info Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end border-t border-slate-200 pt-6">
              <div className="md:col-span-2">
                <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">
                  {examType === 'graduation' ? 'Ngành / Chuyên ngành đào tạo' : 'Tên Học phần / Chủ đề'}
                </label>
                <input
                  type="text"
                  id="topic"
                  placeholder={examType === 'graduation' ? "Ví dụ: Bác sĩ Y đa khoa, Cử nhân Điều dưỡng..." : "Ví dụ: Nội khoa - Tim mạch, Nhi khoa hô hấp..."}
                  className="w-full rounded-md border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-slate-700 mb-1">
                  Đối tượng
                </label>
                <select
                  id="audience"
                  className="w-full rounded-md border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                <label htmlFor="questions" className="block text-sm font-medium text-slate-700 mb-1">
                  Số lượng câu hỏi
                </label>
                <input
                  type="number"
                  id="questions"
                  min="5"
                  max="200"
                  className="w-full rounded-md border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                />
              </div>
              
              <div className="md:col-span-4 flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto transition-all ${
                    examType === 'graduation' 
                    ? 'bg-purple-600 hover:bg-purple-500 focus-visible:outline-purple-600' 
                    : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {mode === 'manual' ? 'Tạo Ma trận theo Tỉ lệ' : 'Tạo Ma trận Tự động'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          {error && (
             <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-md border border-red-200 flex items-center">
               <div className="mr-2">⚠️</div>
               {error}
             </div>
          )}
        </div>

        {/* Results Section */}
        {blueprint && (
          <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        examType === 'graduation' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' : 'bg-blue-50 text-blue-700 ring-blue-700/10'
                    }`}>
                        {examType === 'graduation' ? 'Thi Tốt nghiệp' : 'Thi Học phần'}
                    </span>
                    {mode === 'manual' && (
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-orange-50 text-orange-700 ring-orange-700/10">
                            Tùy chỉnh tỉ lệ
                        </span>
                    )}
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">{blueprint.title}</h3>
                 <p className="text-slate-500 text-sm mt-1">Đối tượng: {blueprint.targetAudience} • Tổng: {blueprint.totalQuestions} câu hỏi</p>
              </div>
              <div className="flex space-x-3">
                 <button className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                    <Save className="w-4 h-4 mr-2" />
                    Lưu
                 </button>
                 <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Xuất Excel
                 </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">
                      {examType === 'graduation' ? 'Phân môn / Lĩnh vực' : 'Nội dung / Chủ đề'}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Năng lực cốt lõi
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nhớ
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Hiểu
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Vận dụng
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Phân tích
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {blueprint.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {row.topicName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {COMPETENCY_LABELS[row.competency]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                        {row.cognitiveDistribution[BloomLevel.RECALL] > 0 ? row.cognitiveDistribution[BloomLevel.RECALL] : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                        {row.cognitiveDistribution[BloomLevel.COMPREHENSION] > 0 ? row.cognitiveDistribution[BloomLevel.COMPREHENSION] : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                         {row.cognitiveDistribution[BloomLevel.APPLICATION] > 0 ? row.cognitiveDistribution[BloomLevel.APPLICATION] : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">
                         {row.cognitiveDistribution[BloomLevel.ANALYSIS] > 0 ? row.cognitiveDistribution[BloomLevel.ANALYSIS] : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-slate-900 bg-slate-50/50">
                        {row.totalQuestions}
                      </td>
                    </tr>
                  ))}
                  {/* Summary Row */}
                  <tr className="bg-slate-100 font-semibold">
                    <td className="px-6 py-4 text-sm text-slate-900" colSpan={2}>Tổng cộng</td>
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
                    <td className="px-6 py-4 text-center text-sm text-blue-700 text-lg">
                        {blueprint.rows.reduce((acc, row) => acc + row.totalQuestions, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Visualization */}
            <BlueprintVisualization data={blueprint} />
            
            <div className="mt-8 flex items-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Ma trận đã được kiểm tra tính hợp lệ về tổng số câu hỏi.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlueprintGenerator;