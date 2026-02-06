import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BlueprintData, BloomLevel } from '../types';
import { BLOOM_COLORS } from '../constants';

interface Props {
  data: BlueprintData;
}

const BlueprintVisualization: React.FC<Props> = ({ data }) => {
  // Process data for Bloom Distribution (Pie Chart)
  const bloomData = [
    { name: BloomLevel.RECALL, value: data.rows.reduce((acc, row) => acc + row.cognitiveDistribution[BloomLevel.RECALL], 0) },
    { name: BloomLevel.COMPREHENSION, value: data.rows.reduce((acc, row) => acc + row.cognitiveDistribution[BloomLevel.COMPREHENSION], 0) },
    { name: BloomLevel.APPLICATION, value: data.rows.reduce((acc, row) => acc + row.cognitiveDistribution[BloomLevel.APPLICATION], 0) },
    { name: BloomLevel.ANALYSIS, value: data.rows.reduce((acc, row) => acc + row.cognitiveDistribution[BloomLevel.ANALYSIS], 0) },
  ];

  // Process data for Topic Distribution (Bar Chart)
  const topicData = data.rows.map(row => ({
    name: row.topicName.length > 15 ? row.topicName.substring(0, 15) + '...' : row.topicName,
    fullTopic: row.topicName,
    ...row.cognitiveDistribution,
    total: row.totalQuestions
  }));

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Bloom's Taxonomy Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Phân bố mức độ nhận thức (Bloom)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bloomData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {bloomData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BLOOM_COLORS[entry.name as BloomLevel]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} câu`, 'Số lượng']} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Area Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Phân bố nội dung chi tiết</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topicData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} style={{ fontSize: '12px' }} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
                        <p className="font-bold mb-2">{dataPoint.fullTopic}</p>
                        <p>Tổng: {dataPoint.total} câu</p>
                        <div className="mt-1 space-y-1">
                            {Object.values(BloomLevel).map((level) => (
                                <p key={level} style={{color: BLOOM_COLORS[level]}}>
                                    {level}: {dataPoint[level]}
                                </p>
                            ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey={BloomLevel.RECALL} stackId="a" fill={BLOOM_COLORS[BloomLevel.RECALL]} name="Nhớ" />
              <Bar dataKey={BloomLevel.COMPREHENSION} stackId="a" fill={BLOOM_COLORS[BloomLevel.COMPREHENSION]} name="Hiểu" />
              <Bar dataKey={BloomLevel.APPLICATION} stackId="a" fill={BLOOM_COLORS[BloomLevel.APPLICATION]} name="Vận dụng" />
              <Bar dataKey={BloomLevel.ANALYSIS} stackId="a" fill={BLOOM_COLORS[BloomLevel.ANALYSIS]} name="Phân tích" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BlueprintVisualization;
