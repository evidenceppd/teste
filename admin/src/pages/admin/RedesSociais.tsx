import { useState } from 'react'
import { Save, Facebook, Instagram, MessageCircle } from 'lucide-react'

interface RedeSocial {
  id: string
  nome: string
  tipo: 'whatsapp' | 'facebook' | 'instagram'
  link: string
  ativo: boolean
}

const mockDados: RedeSocial[] = [
  {
    id: '1',
    nome: 'WhatsApp',
    tipo: 'whatsapp',
    link: 'https://wa.me/5518999999999',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Instagram',
    tipo: 'instagram',
    link: 'https://instagram.com/supermercadobandeiras',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Facebook',
    tipo: 'facebook',
    link: 'https://facebook.com/supermercadobandeiras',
    ativo: true,
  },
]

export default function RedesSociais() {
  const [redes, setRedes] = useState<RedeSocial[]>(mockDados)
  const [hasChanges, setHasChanges] = useState(false)

  const handleLinkChange = (id: string, value: string) => {
    setRedes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, link: value } : r))
    )
    setHasChanges(true)
  }

  const handleAtivoChange = (id: string, value: boolean) => {
    setRedes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ativo: value } : r))
    )
    setHasChanges(true)
  }

  const handleSave = () => {
    // Aqui você salvaria os dados na API
    console.log('Salvando redes sociais:', redes)
    setHasChanges(false)
  }

  const getIcone = (tipo: RedeSocial['tipo']) => {
    const iconProps = { size: 32, className: 'text-white' }
    switch (tipo) {
      case 'whatsapp':
        return <MessageCircle {...iconProps} />
      case 'instagram':
        return <Instagram {...iconProps} />
      case 'facebook':
        return <Facebook {...iconProps} />
      default:
        return null
    }
  }

  const getCorFundo = (tipo: RedeSocial['tipo']) => {
    switch (tipo) {
      case 'whatsapp':
        return 'bg-[#25D366]'
      case 'instagram':
        return 'bg-gradient-to-br from-[#405DE6] via-[#E1306C] to-[#FD1D1D]'
      case 'facebook':
        return 'bg-[#1877F2]'
      default:
        return 'bg-gray-500'
    }
  }

  const getPlaceholder = (tipo: RedeSocial['tipo']) => {
    switch (tipo) {
      case 'whatsapp':
        return 'Ex: https://wa.me/5518999999999'
      case 'instagram':
        return 'Ex: https://instagram.com/supermercadobandeiras'
      case 'facebook':
        return 'Ex: https://facebook.com/supermercadobandeiras'
      default:
        return ''
    }
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Redes Sociais</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie os links das redes sociais exibidos no site
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        )}
      </div>

      {/* Lista de Redes Sociais */}
      <div className="space-y-4">
        {redes.map((rede) => (
          <div
            key={rede.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Ícone */}
                <div className={`w-16 h-16 rounded-2xl ${getCorFundo(rede.tipo)} flex items-center justify-center shrink-0`}>
                  {getIcone(rede.tipo)}
                </div>

                {/* Formulário */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">{rede.nome}</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">Ativo</span>
                      <input
                        type="checkbox"
                        checked={rede.ativo}
                        onChange={(e) => handleAtivoChange(rede.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#1a8a9f] focus:ring-[#1a8a9f] cursor-pointer"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Link / URL
                    </label>
                    <input
                      type="url"
                      value={rede.link}
                      onChange={(e) => handleLinkChange(rede.id, e.target.value)}
                      placeholder={getPlaceholder(rede.tipo)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
