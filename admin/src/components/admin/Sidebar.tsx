import { useState } from 'react'
import { 
  LayoutDashboard, 
  FileStack, 
  Mail,
  Briefcase,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react'

interface SubMenuItem {
  id: string
  label: string
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  isActive?: boolean
  hasSubmenu?: boolean
  submenu?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  { 
    id: 'dashboard', 
    label: 'Painel de Controle', 
    icon: <LayoutDashboard size={20} />, 
    isActive: true 
  },
  { 
    id: 'newsletter', 
    label: 'Newsletter', 
    icon: <Mail size={20} />
  },
  { 
    id: 'trabalhe-conosco', 
    label: 'Trabalhe Conosco', 
    icon: <Briefcase size={20} />
  },
  { 
    id: 'content', 
    label: 'Conteúdos', 
    icon: <FileStack size={20} />,
    hasSubmenu: true,
    submenu: [
      { id: 'content-banners-home', label: 'Banners Home' },
      { id: 'content-receitas', label: 'Receitas' },
      { id: 'content-noticias', label: 'Notícias' },
      { id: 'content-nossa-historia', label: 'Nossa História' },
      { id: 'content-parceiros', label: 'Parceiros' },
      { id: 'content-nossas-lojas', label: 'Nossas Lojas' },
      { id: 'content-fale-conosco', label: 'Fale Conosco' },
      { id: 'content-redes-sociais', label: 'Redes Sociais' },
    ]
  },
]

interface SidebarProps {
  isOpen: boolean
  hoverMode?: boolean
  isMobile?: boolean
  isMobileOpen?: boolean
  onClose?: () => void
  onNavigate?: (pageId: string) => void
  activePage?: string
}

export default function Sidebar({ isOpen, hoverMode = false, isMobile = false, isMobileOpen = false, onClose, onNavigate, activePage }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const effectiveIsOpen = isMobile ? true : (hoverMode ? isHovered : isOpen)
  const isSidebarVisible = isMobile ? isMobileOpen : true

  const toggleMenu = (menuId: string) => {
    if (!effectiveIsOpen) {
      // Quando condensado, usa hover em vez de click
      return
    }
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? []
        : [menuId]
    )
  }

  const handleMouseEnter = (menuId: string, hasSubmenu: boolean) => {
    if (!isOpen && hasSubmenu) {
      setHoveredMenu(menuId)
    }
  }

  const handleMouseLeave = () => {
    if (!isOpen) {
      setHoveredMenu(null)
    }
  }

  return (
    <aside 
      className={`bg-linear-to-b from-[#1a8a9f] to-[#156e7f] text-white h-screen fixed left-0 top-0 transition-all duration-300 z-20 ${
        effectiveIsOpen ? 'w-64 overflow-y-auto' : 'w-16 overflow-visible'
      } ${isMobile ? `w-64 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}` : 'translate-x-0'}`}
      onMouseEnter={() => hoverMode && setIsHovered(true)}
      onMouseLeave={() => hoverMode && setIsHovered(false)}
    >
      {/* Mobile Close */}
      {isMobile && (
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>
      )}
      {/* Logo */}
      <div className={`p-6 border-b border-white/10 ${!effectiveIsOpen && 'px-3'} ${isMobile ? 'pt-4' : ''}`}>
        {effectiveIsOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="text-[#1a8a9f] font-bold text-xs text-center leading-tight">
                <div>CRECHE</div>
                <div>PEQUENO</div>
                <div>CIDADÃO</div>
              </div>
            </div>
            <div className="text-sm">
              <div className="font-bold">CRECHE</div>
              <div className="font-bold">PEQUENO CIDADÃO</div>
              <div className="text-xs opacity-75">Formando cidadãos do futuro</div>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto">
            <div className="text-[#1a8a9f] font-bold text-[8px] text-center leading-tight">
              <div>CPC</div>
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="py-4">
        {effectiveIsOpen && (
          <div className="px-4 mb-2">
            <span className="text-xs uppercase tracking-wider opacity-60">MENU</span>
          </div>
        )}
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.id, item.hasSubmenu || false)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  toggleMenu(item.id)
                } else {
                  onNavigate?.(item.id)
                }
              }}
              className={`
                w-full flex items-center ${effectiveIsOpen ? 'justify-between px-6' : 'justify-center px-0'} py-3 transition-colors cursor-pointer
                ${activePage === item.id || (!activePage && item.isActive)
                  ? 'bg-white/20 border-l-4 border-white text-white' 
                  : 'hover:bg-white/10 border-l-4 border-transparent text-white/80 hover:text-white'
                }
              `}
              title={!effectiveIsOpen ? item.label : undefined}
            >
              <div className={`flex items-center ${effectiveIsOpen ? 'gap-3' : ''}`}>
                {item.icon}
                {effectiveIsOpen && <span className="text-sm font-medium">{item.label}</span>}
              </div>
              {effectiveIsOpen && item.hasSubmenu && (
                openMenus.includes(item.id) 
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />
              )}
            </button>
            
            {/* Submenu quando expandido */}
            {effectiveIsOpen && item.hasSubmenu && (
              <div className={`submenu-wrapper ${openMenus.includes(item.id) ? 'open' : ''}`}>
                <div className="submenu-content">
                  <div className="bg-white/5">
                    {item.submenu?.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => onNavigate?.(subItem.id)}
                        className={`w-full text-left px-6 pl-14 py-2 text-sm transition-colors cursor-pointer ${
                          activePage === subItem.id
                            ? 'text-white bg-white/10 font-medium'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submenu flutuante quando condensado */}
            {!effectiveIsOpen && item.hasSubmenu && hoveredMenu === item.id && (
              <div 
                className="absolute left-full top-0 bg-white rounded-lg shadow-lg py-2 min-w-50 z-50"
                onMouseEnter={() => setHoveredMenu(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                </div>
                {item.submenu?.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onNavigate?.(subItem.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
