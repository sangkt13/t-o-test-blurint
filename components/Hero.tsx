import React from 'react';
import { FileText, BrainCircuit, BarChart3, ChevronRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50/50 via-white to-white"></div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          
          {/* Badge */}
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                Phiên bản mới 2025
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                <span>Cập nhật chuẩn năng lực</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </span>
            </a>
          </div>

          {/* Headline */}
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl leading-tight">
            Xây dựng <span className="text-blue-600">Ma trận Đề thi</span> Y khoa Chuẩn xác với AI
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Công cụ chuyên nghiệp hỗ trợ giảng viên y khoa thiết kế blueprint nhanh chóng, đảm bảo tính giá trị nội dung (content validity) và cân đối theo thang đo Bloom.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center gap-x-6">
            <button
              onClick={onStart}
              className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:-translate-y-0.5"
            >
              Bắt đầu thiết kế ngay
            </button>
            <a href="#" className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors">
              Xem tài liệu hướng dẫn <span aria-hidden="true">→</span>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-10 border-t border-slate-100 pt-8 flex gap-8">
             <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Chuẩn Bloom</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Competency-based</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Xuất Excel</span>
             </div>
          </div>

        </div>

        {/* Hero Image / Visuals */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                {/* Card 1 */}
                <div className="relative rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5 hover:ring-blue-500/20 transition-all duration-300">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                         <BrainCircuit className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="font-semibold text-slate-900">Trí tuệ nhân tạo</h3>
                         <p className="text-sm text-slate-500">Gợi ý nội dung tự động</p>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-3/4"></div>
                   </div>
                </div>

                {/* Card 2 */}
                <div className="relative rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5 hover:ring-emerald-500/20 transition-all duration-300 sm:mt-12">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                         <FileText className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="font-semibold text-slate-900">Chuẩn năng lực</h3>
                         <p className="text-sm text-slate-500">ACGME / CanMEDS frame</p>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                      <div className="h-2 w-2/3 bg-slate-100 rounded-full"></div>
                   </div>
                </div>

                 {/* Card 3 */}
                 <div className="relative rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5 hover:ring-purple-500/20 transition-all duration-300">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                         <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="font-semibold text-slate-900">Phân tích trực quan</h3>
                         <p className="text-sm text-slate-500">Biểu đồ phân bố độ khó</p>
                      </div>
                   </div>
                   <div className="flex items-end gap-1 h-8">
                      <div className="w-1/4 bg-purple-200 h-full rounded-t"></div>
                      <div className="w-1/4 bg-purple-300 h-2/3 rounded-t"></div>
                      <div className="w-1/4 bg-purple-500 h-3/4 rounded-t"></div>
                      <div className="w-1/4 bg-purple-600 h-1/2 rounded-t"></div>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;