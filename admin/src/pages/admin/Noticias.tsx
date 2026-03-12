import { useState, useRef } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle, ArrowLeft, ImageIcon, Upload, X, Newspaper, Tag, Calendar } from 'lucide-react'

interface Noticia {
  id: number
  categoria: string
  title: string
  description: string
  content: string
  imageUrl: string
  createdAt: string
}

const categorias = [
  'Promoções',
  'Novidades',
  'Dicas',
  'Institucional',
  'Saúde e Bem-estar',
  'Sustentabilidade',
]

const categoriaColors: Record<string, string> = {
  'Promoções': 'bg-orange-100 text-orange-700',
  'Novidades': 'bg-blue-100 text-blue-700',
  'Dicas': 'bg-green-100 text-green-700',
  'Institucional': 'bg-purple-100 text-purple-700',
  'Saúde e Bem-estar': 'bg-teal-100 text-teal-700',
  'Sustentabilidade': 'bg-emerald-100 text-emerald-700',
}

const mockNoticias: Noticia[] = [
  { 
    id: 1,
    categoria: 'Promoções',
    title: 'Semana do Frango: descontos de até 30%',
    description: 'Durante toda essa semana, aproveite descontos especiais em todos os cortes de frango da seção de carnes.',
    content: 'A semana do frango chegou! De segunda a domingo, todos os produtos da linha de frango estarão com descontos exclusivos de até 30%. Visite nossas filiais e aproveite as melhores ofertas.\n\nEntre os destaques estão o peito de frango, a coxa e sobrecoxa, e os nuggets artesanais. Não perca!',
    imageUrl: '',
    createdAt: '2026-03-05',
  },
  {
    id: 2,
    categoria: 'Novidades',
    title: 'Nova seção de produtos orgânicos',
    description: 'Inauguramos nossa nova área dedicada exclusivamente a produtos orgânicos e naturais.',
    content: 'Pensando no bem-estar dos nossos clientes, inauguramos a nova seção de produtos orgânicos no Supermercado Bandeiras. Você encontrará frutas, verduras, laticínios e muito mais, todos certificados.\n\nA qualidade e a saúde da sua família são nossa prioridade.',
    imageUrl: '',
    createdAt: '2026-03-01',
  },
]

// ── Formulário (página interna) ──────────────────────────────────────────────

interface NoticiaFormProps {
  noticia: Noticia | null
  onBack: () => void
  onSave: (data: Omit<Noticia, 'id'>) => void
}

function NoticiaForm({ noticia, onBack, onSave }: NoticiaFormProps) {
  const [categoria, setCategoria] = useState(noticia?.categoria ?? categorias[0])
  const [title, setTitle] = useState(noticia?.title ?? '')
  const [description, setDescription] = useState(noticia?.description ?? '')
  const [content, setContent] = useState(noticia?.content ?? '')
  const [imageUrl, setImageUrl] = useState(noticia?.imageUrl ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = noticia !== null

  const today = new Date().toISOString().split('T')[0]

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
      title,
      description,
      content,
      imageUrl,
      createdAt: noticia?.createdAt ?? today,
    })
  }

  const inputCls =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#1a8a9f] focus:border-transparent resize-none'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
          title="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Notícia' : 'Nova Notícia'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Atualize as informações da notícia' : 'Preencha as informações da nova notícia'}
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Categoria */}
          <div>
            <label className={labelCls}>Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={inputCls + ' cursor-pointer'}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div>
            <label className={labelCls}>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Semana do Frango: descontos de até 30%"
              className={inputCls}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className={labelCls}>Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Um breve resumo para aparecer nos cards e listagens..."
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Máximo recomendado: 160 caracteres</p>
          </div>

          {/* Matéria */}
          <div>
            <label className={labelCls}>Matéria</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              placeholder="Escreva o conteúdo completo da notícia aqui..."
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Conteúdo completo que será exibido na página da notícia</p>
          </div>

          {/* Imagem */}
          <div>
            <label className={labelCls}>Imagem de capa</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageUrl ? (
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ height: '220px' }}>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-xs font-medium text-gray-700 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Upload size={13} />
                    Trocar imagem
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { setImageUrl(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer transition-colors"
                  title="Remover imagem"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1a8a9f] bg-gray-50 hover:bg-[#1a8a9f]/5 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-[#1a8a9f]/10 transition-colors">
                  <ImageIcon size={22} className="text-gray-400 group-hover:text-[#1a8a9f] transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-[#1a8a9f] transition-colors">Clique para enviar uma imagem</p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG ou WEBP</p>
                </div>
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
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
              {isEdit ? 'Salvar alterações' : 'Publicar notícia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal de Exclusão ────────────────────────────────────────────────────────

interface DeleteModalProps {
  noticiaTitle: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ noticiaTitle, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-red-50">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Excluir notícia</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Tem certeza que deseja excluir <span className="font-medium text-gray-700">"{noticiaTitle}"</span>? Essa ação não poderá ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────

interface NoticiaCardProps {
  noticia: Noticia
  onEdit: () => void
  onDelete: () => void
}

function NoticiaCard({ noticia, onEdit, onDelete }: NoticiaCardProps) {
  const badgeColor = categoriaColors[noticia.categoria] ?? 'bg-gray-100 text-gray-600'

  const formatDate = (iso: string) => {
    const [year, month, day] = iso.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        {noticia.imageUrl ? (
          <img src={noticia.imageUrl} alt={noticia.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <Newspaper size={36} />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Categoria + data */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeColor} flex items-center gap-1`}>
            <Tag size={10} />
            {noticia.categoria}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(noticia.createdAt)}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2">{noticia.title}</h3>

        <p className="text-sm text-gray-500 line-clamp-3">{noticia.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-auto">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a8a9f] hover:bg-[#1a8a9f]/10 transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

type View = 'list' | 'form'

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>(mockNoticias)
  const [view, setView] = useState<View>('list')
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const goToNew = () => { setEditingNoticia(null); setView('form') }
  const goToEdit = (n: Noticia) => { setEditingNoticia(n); setView('form') }
  const goToList = () => { setEditingNoticia(null); setView('list') }

  const handleSave = (data: Omit<Noticia, 'id'>) => {
    if (editingNoticia) {
      setNoticias((prev) => prev.map((n) => (n.id === editingNoticia.id ? { ...data, id: editingNoticia.id } : n)))
    } else {
      const newId = Math.max(0, ...noticias.map((n) => n.id)) + 1
      setNoticias((prev) => [{ ...data, id: newId }, ...prev])
    }
    goToList()
  }

  const confirmDelete = () => {
    if (deletingId !== null) {
      setNoticias((prev) => prev.filter((n) => n.id !== deletingId))
      setDeletingId(null)
    }
  }

  if (view === 'form') {
    return (
      <NoticiaForm
        noticia={editingNoticia}
        onBack={goToList}
        onSave={handleSave}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notícias</h1>
          <p className="text-sm text-gray-500 mt-0.5">{noticias.length} {noticias.length === 1 ? 'notícia publicada' : 'notícias publicadas'}</p>
        </div>
        <button
          onClick={goToNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Nova Notícia
        </button>
      </div>

      {/* Grid */}
      {noticias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Newspaper size={48} className="mb-3 opacity-30" />
          <p className="text-base font-medium">Nenhuma notícia publicada</p>
          <p className="text-sm mt-1">Clique em "Nova Notícia" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {noticias.map((noticia) => (
            <NoticiaCard
              key={noticia.id}
              noticia={noticia}
              onEdit={() => goToEdit(noticia)}
              onDelete={() => setDeletingId(noticia.id)}
            />
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deletingId !== null && (
        <DeleteModal
          noticiaTitle={noticias.find((n) => n.id === deletingId)?.title ?? ''}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
