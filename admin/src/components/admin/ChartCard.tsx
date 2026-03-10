import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartDataPoint {
  name: string
  value: number
}

interface ChartCardProps {
  title: string
  data: ChartDataPoint[]
}

export default function ChartCard({ title, data }: ChartCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-gray-700 dark:text-gray-300 text-base font-medium mb-6">{title}</h3>
      
      <div className="w-full h-64 sm:h-72 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              labelStyle={{ color: '#374151', fontWeight: 500 }}
              cursor={{ fill: 'rgba(82, 153, 173, 0.1)' }}
            />
            <Bar 
              dataKey="value" 
              fill="#5299ad" 
              radius={[4, 4, 0, 0]}
              name="Acessos por dia"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
