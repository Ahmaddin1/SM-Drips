'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PAYMENT_COLORS = {
  'jazzcash': '#defc3e',
  'cod': '#ffffff',
  'bank_deposit': '#6b6b6b'
};

export default function PaymentMethodChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="method"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[entry.method] || '#3a3a3a'} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#282828', 
            border: '1px solid #3a3a3a',
            color: '#ffffff'
          }}
        />
        <Legend wrapperStyle={{ color: '#ffffff' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
