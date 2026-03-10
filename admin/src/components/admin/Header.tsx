import { useEffect, useRef, useState } from 'react'
import { Menu, Moon, Sun, Maximize, Settings, User, LogOut, Pencil } from 'lucide-react'
import type { SidebarSize } from '../../pages/Dashboard'

interface HeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onToggleSettings: () => void
  sidebarSize: SidebarSize
  isMobile: boolean
}

export default function Header({ onToggleSidebar, isSidebarOpen, isDarkMode, onToggleDarkMode, onToggleSettings, sidebarSize, isMobile }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isUserMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isUserMenuOpen])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <header className={`bg-white dark:bg-gray-800 shadow-sm h-16 fixed top-0 right-0 left-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 ${
      !isMobile && sidebarSize === 'default' && isSidebarOpen ? 'lg:pl-72' :
      !isMobile && sidebarSize !== 'hidden' ? 'lg:pl-20' :
      ''
    } transition-all duration-300`}>
      {/* Left Section */}
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" 
          title="Toggle theme"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon size={20} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>
        <button 
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" 
          title="Fullscreen"
        >
          <Maximize size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button 
          onClick={onToggleSettings}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" 
          title="Settings"
        >
          <Settings size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            className="ml-2 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <User size={18} className="text-gray-600 dark:text-gray-300" />
          </button>

          {isUserMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden z-50"
              style={{
                borderColor:
                  'color-mix(in oklab, oklch(0.37 0.03 259.73 / 0.38) 40%, transparent)',
              }}
            >
              <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                Bem vindo Diretoria!
              </div>
              <button
                role="menuitem"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Pencil size={16} className="text-gray-500 dark:text-gray-400" />
                Editar Usuário
              </button>
              <button
                role="menuitem"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <LogOut size={16} className="text-red-500" />
                Deslogar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
