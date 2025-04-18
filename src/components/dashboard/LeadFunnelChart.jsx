import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Define the color palette
const colorPalette = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, percentage } = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-2 shadow rounded">
        <p className="mb-1 fw-bold">{name}</p>
        <p className="mb-0">Count: {value}</p>
        <p className="mb-0">Percentage: {percentage.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export default function LeadFunnelChart({ funnelData }) {
  const chartData = funnelData.map((item, index) => ({
    name: item.title,
    value: item.count,
    percentage: parseFloat(item.percentage) || 0,
    color: colorPalette[index % colorPalette.length],
  }));

  return (
    <div className="card bg-light p-4 shadow">
      <div className="d-flex justify-content-between mb-4">
        {funnelData.map((item, index) => (
          <div key={index} className="text-center px-3">
            <div className="h3 fw-bold mb-0">{item.count}</div>
            <div className="text-secondary">{item.title}</div>
            <div className="fs-5">{(parseFloat(item.percentage) || 0).toFixed(1)}%</div> {/* Ensure percentage is a number */}
          </div>
        ))}
      </div>

      <div style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              {chartData.map((item, index) => (
                <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={item.color} stopOpacity={0.2} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="name" />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            {chartData.map((entry, index) => (
              <Area key={index} type="monotone" dataKey="value" stroke={entry.color} fill={`url(#color${index})`} fillOpacity={1} name={entry.name} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
