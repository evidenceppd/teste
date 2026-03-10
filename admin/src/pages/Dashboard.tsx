import { useState, useEffect } from 'react'
import Sidebar from '../components/admin/Sidebar'
import Header from '../components/admin/Header'
import SettingsPanel from '../components/admin/SettingsPanel'
import StatCard from '../components/admin/StatCard'
import ChartCard from '../components/admin/ChartCard'
import BannersHome from './admin/BannersHome'
import Receitas from './admin/Receitas'
import Noticias from './admin/Noticias'
import NossaHistoria from './admin/NossaHistoria'
import Parceiros from './admin/Parceiros'
import NossasLojas from './admin/NossasLojas'
import FaleConosco from './admin/FaleConosco'
import RedesSociais from './admin/RedesSociais'
import Newsletter from './admin/Newsletter'
import TrabalheConosco from './admin/TrabalheConosco'
import { Users, Smartphone, Shield } from 'lucide-react'

export type SidebarSize = 'default' | 'condensed' | 'hidden' | 'small-hover-active' | 'small-hover'

// Mock data for the chart
const chartData = [
  { name: 'Thu (29/01)', value: 15 },
  { name: 'Fri (30/01)', value: 54 },
  { name: 'Sat (31/01)', value: 15 },
  { name: 'Sun (01/02)', value: 8 },
  { name: 'Mon (02/02)', value: 3 },
  { name: 'Tue (03/02)', value: 7 },
  { name: 'Wed (04/02)', value: 4 },
]

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [sidebarSize, setSidebarSize] = useState<SidebarSize>('default')
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')

  useEffect(() => {
    localStorage.removeItem('theme')

    const htmlElement = document.querySelector('html')
    if (htmlElement) {
      htmlElement.classList.remove('dark')
      htmlElement.className = ''
    }

    setIsDarkMode(false)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 1024
      setIsMobile(mobileView)
      if (!mobileView) {
        setIsMobileSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    const htmlElement = document.querySelector('html')

    setIsDarkMode(newDarkMode)

    if (htmlElement) {
      if (newDarkMode) {
        htmlElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        htmlElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen((prev) => !prev)
      return
    }
    setIsSidebarOpen(!isSidebarOpen)
  }

  const isDesktopVisible = !isMobile && isSidebarOpen && sidebarSize !== 'hidden'
  const mainOffsetClass = isMobile || !isDesktopVisible
    ? 'ml-0'
    : sidebarSize === 'default'
      ? 'lg:ml-64'
      : 'ml-0'
  const mainPaddingLeftClass = !isMobile && sidebarSize !== 'hidden'
    ? (sidebarSize === 'default' && isSidebarOpen ? '' : 'lg:pl-20')
    : ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Sidebar */}
      {(sidebarSize !== 'hidden' || isMobile) && (
        <Sidebar
          isOpen={isDesktopVisible && sidebarSize === 'default'}
          hoverMode={!isMobile && sidebarSize === 'small-hover'}
          isMobile={isMobile}
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onNavigate={(pageId) => { setActivePage(pageId); if (isMobile) setIsMobileSidebarOpen(false) }}
          activePage={activePage}
        />
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`${mainOffsetClass} ${mainPaddingLeftClass} min-h-screen flex flex-col transition-all duration-300`}>
        {/* Header */}
        <Header
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
          sidebarSize={sidebarSize}
          isMobile={isMobile}
        />

        {/* Content */}
        <main className="flex-1 pt-24 lg:pt-20 p-4 sm:p-6 lg:p-8">
          {activePage === 'content-banners-home' ? (
            <BannersHome />
          ) : activePage === 'content-receitas' ? (
            <Receitas />
          ) : activePage === 'content-noticias' ? (
            <Noticias />
          ) : activePage === 'content-nossa-historia' ? (
            <NossaHistoria />
          ) : activePage === 'content-parceiros' ? (
            <Parceiros />
          ) : activePage === 'content-nossas-lojas' ? (
            <NossasLojas />
          ) : activePage === 'content-fale-conosco' ? (
            <FaleConosco />
          ) : activePage === 'content-redes-sociais' ? (
            <RedesSociais />
          ) : activePage === 'newsletter' ? (
            <Newsletter />
          ) : activePage === 'trabalhe-conosco' ? (
            <TrabalheConosco />
          ) : (
          <>{/* Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
            {/* Statistics Cards */}
            <StatCard
              title="Total de Acessos:"
              value="112"
              icon={Users}
              iconBgColor="bg-[#5299ad]"
            />

            <StatCard
              title="Acessos por Dispositivo"
              value=""
              icon={Smartphone}
              iconBgColor="bg-[#5299ad]"
              details={['• Desktop: 112 acessos']}
            />

            <StatCard
              title="Portal da Transparência"
              value="10"
              icon={Shield}
              iconBgColor="bg-[#5299ad]"
              subtitle="Acessos totais"
            />

            {/* Chart Card - ocupando 2 colunas */}
            <div className="lg:col-span-2">
              <ChartCard
                title="Acessos nos últimos 7 dias"
                data={chartData}
              />
            </div>
          </div>
          </>)}
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          2026 © Criado por <span className="text-red-500">❤️</span>{' '}
          <span className="text-green-600 dark:text-green-500 font-semibold">Agência Evidence</span>
        </footer>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        sidebarSize={sidebarSize}
        onSidebarSizeChange={setSidebarSize}
      />
    </div>
  )
}
