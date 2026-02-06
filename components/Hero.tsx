import React from 'react';
import { FileText, BrainCircuit, BarChart3 } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20">
              Cập nhật mới nhất về chuẩn năng lực y khoa 2025.
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Xây dựng Ma trận Đề thi Y khoa Chuẩn xác
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Công cụ hỗ trợ giảng viên y khoa xây dựng blueprint (ma trận đề thi) nhanh chóng, đảm bảo tính giá trị nội dung và phân bố phù hợp theo thang đo Bloom và chuẩn năng lực.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={onStart}
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Bắt đầu ngay
              </button>
              <a href="#" className="text-sm font-semibold leading-6 text-slate-900">
                Tìm hiểu thêm <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Feature Grid */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-blue-100 rounded-full text-blue-600">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Hỗ trợ bởi AI</h3>
              <p className="text-slate-600">Tự động gợi ý phân bố câu hỏi và chủ đề con dựa trên chuyên khoa và đối tượng học viên.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-emerald-100 rounded-full text-emerald-600">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Chuẩn năng lực</h3>
              <p className="text-slate-600">Tích hợp sẵn các khung năng lực y khoa cốt lõi để đảm bảo đề thi đánh giá đúng mục tiêu.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-purple-100 rounded-full text-purple-600">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Trực quan hóa</h3>
              <p className="text-slate-600">Biểu đồ phân bố Bloom và nội dung giúp giảng viên dễ dàng điều chỉnh độ khó.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
