import { useState } from 'react'
import { Pencil, Save, MessageSquare, MessageCircle, Mail, Lightbulb } from 'lucide-react'

interface ContatoSecao {
  id: string
  titulo: string
  tipo: 'telefone' | 'email'
  telefone1?: string
  telefone2?: string
  email?: string
  icone: 'message' | 'alert' | 'mail' | 'lightbulb'
  cor: string
}

const mockDados: ContatoSecao[] = [
  {
    id: '1',
    titulo: 'Atendimento ao cliente',
    tipo: 'telefone',
    telefone1: '(18) 3529-1133',
    telefone2: '(18) 3528-1403',
    icone: 'message',
    cor: '#f97316',
  },
  {
    id: '2',
    titulo: 'Reclamações',
    tipo: 'telefone',
    telefone1: '(18) 3529-1133',
    telefone2: '(18) 3528-1403',
    icone: 'alert',
    cor: '#f97316',
  },
  {
    id: '3',
    titulo: 'Contato pelo e-mail',
    tipo: 'email',
    email: 'contato@supermercadobandeiras.com.br',
    icone: 'mail',
    cor: '#f97316',
  },
  {
    id: '4',
    titulo: 'Sugestões de produtos',
    tipo: 'email',
    email: 'contato@supermercadobandeiras.com.br',
    icone: 'lightbulb',
    cor: '#f97316',
  },
]

// ── Card de Seção ─────────────────────────────────────────────────────────────

interface SecaoCardProps {
  secao: ContatoSecao
  onEdit: (secao: ContatoSecao) => void
}

function SecaoCard({ secao, onEdit }: SecaoCardProps) {
  const getIcone = () => {
    const iconProps = { size: 48, style: { color: secao.cor }, strokeWidth: 1.5 }
    switch (secao.icone) {
      case 'message':
        return <MessageSquare {...iconProps} />
      case 'alert':
        return <MessageCircle {...iconProps} />
      case 'mail':
        return <Mail {...iconProps} />
      case 'lightbulb':
        return <Lightbulb {...iconProps} />
      default:
        return <MessageSquare {...iconProps} />
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500">Seção de Contato</span>
        <button
          onClick={() => onEdit(secao)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a8a9f] transition-colors cursor-pointer"
          title="Editar"
        >
          <Pencil size={15} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div>{getIcone()}</div>
          <h3 className="text-xl font-bold" style={{ color: secao.cor }}>
            {secao.titulo}
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {secao.tipo === 'telefone' ? (
              <>
                {secao.telefone1 && <p>{secao.telefone1}</p>}
                {secao.telefone2 && <p>{secao.telefone2}</p>}
              </>
            ) : (
              <p>{secao.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Formulário de Edição ──────────────────────────────────────────────────────

interface FormularioProps {
  secao: ContatoSecao
  onSave: (secao: ContatoSecao) => void
  onCancel: () => void
}

function FormularioEdicao({ secao, onSave, onCancel }: FormularioProps) {
  const [titulo, setTitulo] = useState(secao.titulo)
  const [tipo, setTipo] = useState(secao.tipo)
  const [telefone1, setTelefone1] = useState(secao.telefone1 ?? '')
  const [telefone2, setTelefone2] = useState(secao.telefone2 ?? '')
  const [email, setEmail] = useState(secao.email ?? '')
  const [icone, setIcone] = useState(secao.icone)
  const [cor, setCor] = useState(secao.cor)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...secao,
      titulo,
      tipo,
      telefone1: tipo === 'telefone' ? telefone1 : undefined,
      telefone2: tipo === 'telefone' ? telefone2 : undefined,
      email: tipo === 'email' ? email : undefined,
      icone,
      cor,
    })
  }

  const getIconePreview = () => {
    const iconProps = { size: 48, style: { color: cor }, strokeWidth: 1.5 }
    switch (icone) {
      case 'message':
        return <MessageSquare {...iconProps} />
      case 'alert':
        return <MessageCircle {...iconProps} />
      case 'mail':
        return <Mail {...iconProps} />
      case 'lightbulb':
        return <Lightbulb {...iconProps} />
      default:
        return <MessageSquare {...iconProps} />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
          <h2 className="text-xl font-bold text-gray-800">Editar Seção</h2>
          <p className="text-sm text-gray-500 mt-0.5">Fale Conosco</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Título da Seção <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                placeholder="Ex: Atendimento ao cliente"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo de Contato
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'telefone' | 'email')}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors"
              >
                <option value="telefone">Telefone</option>
                <option value="email">E-mail</option>
              </select>
            </div>
          </div>

          {/* Campos de Contato */}
          <div className="space-y-4">
            {tipo === 'telefone' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Telefone 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={telefone1}
                    onChange={(e) => setTelefone1(e.target.value)}
                    required={tipo === 'telefone'}
                    placeholder="Ex: (18) 3529-1133"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Telefone 2
                  </label>
                  <input
                    type="text"
                    value={telefone2}
                    onChange={(e) => setTelefone2(e.target.value)}
                    placeholder="Ex: (18) 3528-1403"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={tipo === 'email'}
                  placeholder="Ex: contato@supermercadobandeiras.com.br"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors"
                />
              </div>
            )}
          </div>

          {/* Aparência */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ícone</label>
              <select
                value={icone}
                onChange={(e) => setIcone(e.target.value as ContatoSecao['icone'])}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors"
              >
                <option value="message">Mensagem Quadrada (SAC)</option>
                <option value="alert">Mensagem Redonda (Reclamações)</option>
                <option value="mail">Envelope (E-mail)</option>
                <option value="lightbulb">Lâmpada (Sugestões)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cor do Ícone e Título
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="h-10 w-20 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  placeholder="#f97316"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Pré-visualização */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Pré-visualização
            </p>
            <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center gap-4">
              <div>{getIconePreview()}</div>
              <h3 className="text-xl font-bold" style={{ color: cor }}>
                {titulo || 'Título da seção'}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                {tipo === 'telefone' ? (
                  <>
                    {telefone1 && <p>{telefone1}</p>}
                    {telefone2 && <p>{telefone2}</p>}
                  </>
                ) : (
                  email && <p>{email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Página Principal ──────────────────────────────────────────────────────────

export default function FaleConosco() {
  const [secoes, setSecoes] = useState<ContatoSecao[]>(mockDados)
  const [editingSecao, setEditingSecao] = useState<ContatoSecao | null>(null)

  const handleEdit = (secao: ContatoSecao) => {
    setEditingSecao(secao)
  }

  const handleSave = (secaoAtualizada: ContatoSecao) => {
    setSecoes((prev) =>
      prev.map((s) => (s.id === secaoAtualizada.id ? secaoAtualizada : s))
    )
    setEditingSecao(null)
  }

  const handleCancel = () => {
    setEditingSecao(null)
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fale Conosco</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Gerencie as informações de contato exibidas no site
        </p>
      </div>

      {/* Grade de Seções */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secoes.map((secao) => (
          <SecaoCard key={secao.id} secao={secao} onEdit={handleEdit} />
        ))}
      </div>

      {/* Modal de Edição */}
      {editingSecao && (
        <FormularioEdicao
          secao={editingSecao}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
