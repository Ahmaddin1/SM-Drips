'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#1a1a1a" vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#6b6b6b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: '#6b6b6b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `Rs. ${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#282828', 
            border: '1px solid #3a3a3a',
            color: '#ffffff'
          }}
        />
        <Line 
          type="monotone"
          dataKey="revenue" 
          stroke="#defc3e" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
