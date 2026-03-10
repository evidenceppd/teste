import { useState, useRef } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle, ArrowLeft, ImageIcon, GripVertical, X } from 'lucide-react'

interface HistoriaBloco {
  id: number
  titulo: string
  texto: string
  imageUrl: string
  ordem: number
  cor: string
}

const mockBlocos: HistoriaBloco[] = [
  {
    id: 1,
    titulo: 'Como Tudo Começou',
    texto:
      'O Supermercado Bandeiras nasceu de um sonho: oferecer produtos de qualidade com preços justos para a comunidade. Iniciamos nossa trajetória com uma pequena loja no centro da cidade, mas com grandes ambições.\n\nDesde o primeiro dia, nosso compromisso foi claro: atender cada cliente como se fosse parte da nossa família. Essa filosofia nos acompanha até hoje e é o que nos diferencia no mercado.\n\nCom o passar dos anos, crescemos e expandimos, mas nunca perdemos nossa essência: ser o supermercado de confiança da comunidade.',
    imageUrl: '',
    ordem: 1,
    cor: '#ef4444',
  },
]

// ── Formulário (página interna) ──────────────────────────────────────────────

interface BlocoFormProps {
  bloco: HistoriaBloco | null
  onBack: () => void
  onSave: (data: Omit<HistoriaBloco, 'id'>) => void
  ordemAtual: number
}

function BlocoForm({ bloco, onBack, onSave, ordemAtual }: BlocoFormProps) {
  const [titulo, setTitulo] = useState(bloco?.titulo ?? '')
  const [texto, setTexto] = useState(bloco?.texto ?? '')
  const [imageUrl, setImageUrl] = useState(bloco?.imageUrl ?? '')
  const [cor, setCor] = useState(bloco?.cor ?? '#ef4444')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = bloco !== null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ titulo, texto, imageUrl, cor, ordem: bloco?.ordem ?? 0 })
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Editar Bloco' : 'Novo Bloco'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Nossa História</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Título do Bloco <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              placeholder="Ex: Como Tudo Começou"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors"
            />
          </div>

          {/* Cor do Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cor do Título e Borda da Imagem
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
                placeholder="#ef4444"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Texto <span className="text-red-500">*</span>
            </label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              required
              rows={8}
              placeholder="Escreva o conteúdo deste bloco... Use linhas em branco para separar parágrafos."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Imagem */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Imagem do Bloco
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {imageUrl ? (
            <div className="relative group">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 px-3 py-1.5 bg-white rounded-lg shadow text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Trocar imagem
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center gap-2 cursor-pointer hover:border-[#1a8a9f] hover:bg-[#1a8a9f]/5 transition-colors"
            >
              <ImageIcon size={36} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500">
                Clique para enviar ou arraste a imagem
              </span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP até 5MB</span>
            </button>
          )}
        </div>

        {/* Preview */}
        {(titulo || texto || imageUrl) && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Pré-visualização
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Conteúdo de texto */}
              <div className={ordemAtual % 2 === 0 ? 'md:order-2' : ''}>
                {titulo && (
                  <h2 className="text-3xl font-bold mb-5" style={{ color: cor }}>{titulo}</h2>
                )}
                {texto && (
                  <div className="space-y-4">
                    {texto.split('\n\n').filter(Boolean).map((p, i) => (
                      <p key={i} className="text-base text-gray-700 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {/* Imagem */}
              <div className={ordemAtual % 2 === 0 ? 'md:order-1' : ''}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={titulo}
                    className="w-full h-auto rounded-2xl object-cover border-4 shadow-lg"
                    style={{ borderColor: cor }}
                  />
                ) : (
                  <div className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                    <ImageIcon size={40} className="text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            {isEdit ? 'Salvar alterações' : 'Adicionar bloco'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Modal de Exclusão ────────────────────────────────────────────────────────

interface DeleteModalProps {
  blocoTitulo: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ blocoTitulo, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir bloco</h3>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-gray-700">"{blocoTitulo}"</span>?
            Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Card de Bloco ────────────────────────────────────────────────────────────

interface BlocoCardProps {
  bloco: HistoriaBloco
  onEdit: (bloco: HistoriaBloco) => void
  onDelete: (bloco: HistoriaBloco) => void
}

function BlocoCard({ bloco, onEdit, onDelete }: BlocoCardProps) {
  const paragrafos = bloco.texto.split('\n\n').filter(Boolean)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-400">
          <GripVertical size={16} />
          <span className="text-xs font-medium text-gray-500">Bloco #{bloco.ordem}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(bloco)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a8a9f] transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(bloco)}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Preview layout 2 colunas */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Conteúdo de texto */}
        <div className={bloco.ordem % 2 === 0 ? 'lg:order-2' : ''}>
          <h3 className="text-3xl font-bold mb-5" style={{ color: bloco.cor }}>{bloco.titulo}</h3>
          <div className="space-y-4">
            {paragrafos.map((p, i) => (
              <p key={i} className="text-base text-gray-700 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
        {/* Imagem */}
        <div className={bloco.ordem % 2 === 0 ? 'lg:order-1' : ''}>
          {bloco.imageUrl ? (
            <img
              src={bloco.imageUrl}
              alt={bloco.titulo}
              className="w-full h-auto object-cover rounded-2xl border-4 shadow-lg"
              style={{ borderColor: bloco.cor }}
            />
          ) : (
            <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300">
              <ImageIcon size={32} />
              <span className="text-xs">Sem imagem</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Página Principal ─────────────────────────────────────────────────────────

export default function NossaHistoria() {
  const [blocos, setBlocos] = useState<HistoriaBloco[]>(mockBlocos)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingBloco, setEditingBloco] = useState<HistoriaBloco | null>(null)
  const [deletingBloco, setDeletingBloco] = useState<HistoriaBloco | null>(null)
  const nextId = useRef(mockBlocos.length + 1)

  const handleNew = () => {
    setEditingBloco(null)
    setView('form')
  }

  const handleEdit = (bloco: HistoriaBloco) => {
    setEditingBloco(bloco)
    setView('form')
  }

  const handleBack = () => {
    setView('list')
    setEditingBloco(null)
  }

  const handleSave = (data: Omit<HistoriaBloco, 'id'>) => {
    if (editingBloco) {
      setBlocos((prev) =>
        prev.map((b) => (b.id === editingBloco.id ? { ...b, ...data } : b))
      )
    } else {
      const newBloco: HistoriaBloco = {
        id: nextId.current++,
        ...data,
        ordem: blocos.length + 1,
      }
      setBlocos((prev) => [...prev, newBloco])
    }
    handleBack()
  }

  const handleDeleteConfirm = () => {
    if (!deletingBloco) return
    setBlocos((prev) =>
      prev
        .filter((b) => b.id !== deletingBloco.id)
        .map((b, i) => ({ ...b, ordem: i + 1 }))
    )
    setDeletingBloco(null)
  }

  if (view === 'form') {
    return (
      <BlocoForm
        bloco={editingBloco}
        onBack={handleBack}
        onSave={handleSave}
        ordemAtual={editingBloco?.ordem ?? blocos.length + 1}
      />
    )
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nossa História</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie os blocos de conteúdo exibidos na página "Nossa História"
          </p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Novo Bloco
        </button>
      </div>

      {/* Lista */}
      {blocos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ImageIcon size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">Nenhum bloco cadastrado</p>
          <p className="text-sm text-gray-400">
            Clique em "Novo Bloco" para começar a construir a história do supermercado.
          </p>
          <button
            onClick={handleNew}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Novo Bloco
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {blocos.map((bloco) => (
            <BlocoCard
              key={bloco.id}
              bloco={bloco}
              onEdit={handleEdit}
              onDelete={setDeletingBloco}
            />
          ))}

          {/* Botão adicionar no final da lista */}
          <button
            onClick={handleNew}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-[#1a8a9f] hover:border-[#1a8a9f] hover:bg-[#1a8a9f]/5 transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Adicionar novo bloco
          </button>
        </div>
      )}

      {/* Modal de exclusão */}
      {deletingBloco && (
        <DeleteModal
          blocoTitulo={deletingBloco.titulo}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingBloco(null)}
        />
      )}
    </div>
  )
}
