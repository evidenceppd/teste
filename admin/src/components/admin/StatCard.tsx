import type { ElementType } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ElementType
  iconBgColor?: string
  subtitle?: string
  details?: string[]
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor = 'bg-[#5299ad]',
  subtitle,
  details 
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`${iconBgColor} rounded-xl p-4 flex items-center justify-center shrink-0`}>
          <Icon size={32} className="text-white" />
        </div>
        <div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{subtitle}</p>
          )}
          {details && details.length > 0 && (
            <div className="space-y-1">
              {details.map((detail, index) => (
                <p key={index} className="text-sm text-gray-700 dark:text-gray-300">{detail}</p>
              ))}
            </div>
          )}
        </div>
      </div>
      {!details && value && (
        <p className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      )}
    </div>
  )
}
