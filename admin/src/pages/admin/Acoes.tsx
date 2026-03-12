import { useState, useRef } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  ImageIcon,
  Zap,
} from 'lucide-react'

interface Acao {
  id: number
  categoria: string
  titulo: string
  descricao: string
  imageUrl: string
  cor: string
  ordem: number
}

const categorias = [
  'Meio ambiente',
  'Animais',
  'Social',
  'Saúde',
  'Educação',
  'Institucional',
]

const mockAcoes: Acao[] = [
  {
    id: 1,
    categoria: 'Meio ambiente',
    titulo: 'Ponto de recolhimento de pilhas e baterias usadas',
    descricao:
      'O Supermercado Bandeiras disponibiliza pontos de coleta de pilhas e baterias usadas em suas unidades. Esses materiais contêm substâncias tóxicas como mercúrio, cádmio e chumbo que podem contaminar o solo e a água.',
    imageUrl: '',
    cor: '#1d4ed8',
    ordem: 1,
  },
  {
    id: 2,
    categoria: 'Social',
    titulo: 'Rotary — Empresa Cidadã',
    descricao:
      'O Supermercado Bandeiras recebeu o selo Empresa Cidadã do Rotary Brasil, reconhecimento concedido a organizações que demonstram excelência em presença cívica e compromisso genuíno com o bem-estar da comunidade.',
    imageUrl: '',
    cor: '#1d4ed8',
    ordem: 2,
  },
]

// ── Formulário ───────────────────────────────────────────────────────────────

interface AcaoFormProps {
  acao: Acao | null
  onBack: () => void
  onSave: (data: Omit<Acao, 'id'>) => void
  nextOrdem: number
}

function AcaoForm({ acao, onBack, onSave, nextOrdem }: AcaoFormProps) {
  const [categoria, setCategoria] = useState(acao?.categoria ?? categorias[0])
  const [titulo, setTitulo] = useState(acao?.titulo ?? '')
  const [descricao, setDescricao] = useState(acao?.descricao ?? '')
  const [imageUrl, setImageUrl] = useState(acao?.imageUrl ?? '')
  const [cor, setCor] = useState(acao?.cor ?? '#1d4ed8')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = acao !== null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      categoria,
      titulo,
      descricao,
      imageUrl,
      cor,
      ordem: acao?.ordem ?? nextOrdem,
    })
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/40 focus:border-[#1a8a9f] transition-colors'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
  const sectionClass =
    'bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5'

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Editar Ação' : 'Nova Ação'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Ações</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
            Informações da Ação
          </h2>

          <div>
            <label className={labelClass}>
              Categoria <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                    categoria === cat
                      ? 'bg-[#1a8a9f] text-white border-[#1a8a9f]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#1a8a9f] hover:text-[#1a8a9f]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Cor (título, borda da imagem e tag)</label>
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
                placeholder="#1d4ed8"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Ponto de recolhimento de pilhas e baterias usadas"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a ação social do supermercado..."
              required
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Imagem */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#1a8a9f]" />
            Imagem
          </h2>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[#1a8a9f] transition-colors"
          >
            {imageUrl ? (
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Clique para alterar
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-gray-400">
                <ImageIcon size={32} />
                <span className="text-sm">Clique para enviar uma imagem</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Preview */}
        {(titulo || imageUrl) && (
          <div className={sectionClass}>
            <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
              Pré-visualização
            </h2>
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                (acao?.ordem ?? nextOrdem) % 2 === 0 ? '' : ''
              }`}
            >
              {/* Imagem */}
              <div className={(acao?.ordem ?? nextOrdem) % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={titulo}
                    className="w-full h-64 object-cover rounded-2xl shadow-md border-4"
                    style={{ borderColor: cor }}
                  />
                ) : (
                  <div className="w-full h-64 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center gap-1 text-gray-300" style={{ borderColor: cor }}>
                    <ImageIcon size={32} />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                )}
              </div>
              {/* Texto */}
              <div className={(acao?.ordem ?? nextOrdem) % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
                {categoria && (
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{ backgroundColor: cor + '22', color: cor }}
                  >
                    {categoria}
                  </span>
                )}
                {titulo && (
                  <h3 className="text-2xl font-bold mb-3 leading-tight" style={{ color: cor }}>
                    {titulo}
                  </h3>
                )}
                {descricao && (
                  <p className="text-gray-600 text-sm leading-relaxed">{descricao}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            {isEdit ? 'Salvar Alterações' : 'Adicionar Ação'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Modal de exclusão ────────────────────────────────────────────────────────

interface DeleteModalProps {
  titulo: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ titulo, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir ação</h3>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-gray-700">"{titulo}"</span>? Esta
            ação não pode ser desfeita.
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

// ── Card da Ação ──────────────────────────────────────────────────────────────

interface AcaoCardProps {
  acao: Acao
  onEdit: (acao: Acao) => void
  onDelete: (acao: Acao) => void
}

function AcaoCard({ acao, onEdit, onDelete }: AcaoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">#{acao.ordem}</span>
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: acao.cor + '22', color: acao.cor }}
          >
            {acao.categoria}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(acao)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a8a9f] transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(acao)}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Imagem */}
        <div className={acao.ordem % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
          {acao.imageUrl ? (
            <img
              src={acao.imageUrl}
              alt={acao.titulo}
              className="w-full h-52 object-cover rounded-2xl shadow-md border-4"
              style={{ borderColor: acao.cor }}
            />
          ) : (
            <div className="w-full h-52 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center gap-1 text-gray-300" style={{ borderColor: acao.cor }}>
              <ImageIcon size={28} />
              <span className="text-xs">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className={acao.ordem % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
          <h3 className="text-lg font-bold mb-2 leading-snug" style={{ color: acao.cor }}>
            {acao.titulo}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">
            {acao.descricao}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Página Principal ──────────────────────────────────────────────────────────

export default function Acoes() {
  const [acoes, setAcoes] = useState<Acao[]>(mockAcoes)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingAcao, setEditingAcao] = useState<Acao | null>(null)
  const [deletingAcao, setDeletingAcao] = useState<Acao | null>(null)
  const nextId = useRef(mockAcoes.length + 1)

  const handleNew = () => {
    setEditingAcao(null)
    setView('form')
  }

  const handleEdit = (acao: Acao) => {
    setEditingAcao(acao)
    setView('form')
  }

  const handleBack = () => {
    setView('list')
    setEditingAcao(null)
  }

  const handleSave = (data: Omit<Acao, 'id'>) => {
    if (editingAcao) {
      setAcoes((prev) =>
        prev.map((a) => (a.id === editingAcao.id ? { ...a, ...data } : a))
      )
    } else {
      setAcoes((prev) => [
        ...prev,
        { id: nextId.current++, ...data, ordem: prev.length + 1 },
      ])
    }
    handleBack()
  }

  const handleDeleteConfirm = () => {
    if (!deletingAcao) return
    setAcoes((prev) =>
      prev
        .filter((a) => a.id !== deletingAcao.id)
        .map((a, i) => ({ ...a, ordem: i + 1 }))
    )
    setDeletingAcao(null)
  }

  if (view === 'form') {
    return (
      <AcaoForm
        acao={editingAcao}
        onBack={handleBack}
        onSave={handleSave}
        nextOrdem={acoes.length + 1}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ações</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie as ações sociais exibidas no site
          </p>
        </div>
        <button
          onClick={handleNew}
          className="self-end sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Nova Ação
        </button>
      </div>

      {acoes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Zap size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">Nenhuma ação cadastrada</p>
          <p className="text-sm text-gray-400">
            Clique em "Nova Ação" para adicionar ações sociais do supermercado.
          </p>
          <button
            onClick={handleNew}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Nova Ação
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {acoes.map((acao) => (
            <AcaoCard
              key={acao.id}
              acao={acao}
              onEdit={handleEdit}
              onDelete={setDeletingAcao}
            />
          ))}

          <button
            onClick={handleNew}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-[#1a8a9f] hover:border-[#1a8a9f] hover:bg-[#1a8a9f]/5 transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Adicionar nova ação
          </button>
        </div>
      )}

      {deletingAcao && (
        <DeleteModal
          titulo={deletingAcao.titulo}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingAcao(null)}
        />
      )}
    </div>
  )
}
