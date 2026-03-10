import { X } from 'lucide-react'
import type { SidebarSize } from '../../pages/Dashboard'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  sidebarSize: SidebarSize
  onSidebarSizeChange: (size: SidebarSize) => void
}

export default function SettingsPanel({ isOpen, onClose, isDarkMode, onToggleDarkMode, sidebarSize, onSidebarSizeChange }: SettingsPanelProps) {
  const handleReset = () => {
    onToggleDarkMode()
    localStorage.clear()
    window.location.reload()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 rounded-l-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-[#1a8a9f] px-6 py-4 flex items-center justify-between rounded-tl-2xl">
          <h2 className="text-white font-semibold text-lg">Theme Settings</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-lg p-1 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Color Scheme */}
          <div className="mb-8">
            <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-4">Color Scheme</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  checked={!isDarkMode}
                  onChange={() => !isDarkMode || onToggleDarkMode()}
                  className="w-4 h-4 text-[#1a8a9f] cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300">Light</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  checked={isDarkMode}
                  onChange={() => isDarkMode || onToggleDarkMode()}
                  className="w-4 h-4 text-[#1a8a9f] cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300">Dark</span>
              </label>
            </div>
          </div>

          {/* Sidebar Size */}
          <div className="mb-8">
            <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-4">Sidebar Size</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar"
                  checked={sidebarSize === 'default'}
                  onChange={() => onSidebarSizeChange('default')}
                  className="w-4 h-4 text-[#1a8a9f] cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300">Default</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar"
                  checked={sidebarSize === 'condensed'}
                  onChange={() => onSidebarSizeChange('condensed')}
                  className="w-4 h-4 text-[#1a8a9f] cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300">Condensed</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar"
                  checked={sidebarSize === 'hidden'}
                  onChange={() => onSidebarSizeChange('hidden')}
                  className="w-4 h-4 text-[#1a8a9f] cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300">Hidden</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar"
                  checked={sidebarSize === 'small-hover'}
                  onChange={() => onSidebarSizeChange('small-hover')}
                  className="w-4 h-4 text-[#1a8a9f] cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300">Small Hover</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReset}
            className="w-full bg-[#ef5350] hover:bg-[#e53935] text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  )
}
