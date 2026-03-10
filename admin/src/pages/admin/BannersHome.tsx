import { useState, useRef } from 'react'
import { Plus, Pencil, Trash2, Image, ToggleLeft, ToggleRight, GripVertical, AlertTriangle } from 'lucide-react'

interface Banner {
  id: number
  title: string
  imageUrl: string
  link: string
  active: boolean
  order: number
}

const mockBanners: Banner[] = [
  {
    id: 1,
    title: 'Promoção de Verão',
    imageUrl: '',
    link: '/promocoes',
    active: true,
    order: 1,
  },
  {
    id: 2,
    title: 'Novidades da Semana',
    imageUrl: '',
    link: '/novidades',
    active: true,
    order: 2,
  },
  {
    id: 3,
    title: 'Ofertas Especiais',
    imageUrl: '',
    link: '/ofertas',
    active: false,
    order: 3,
  },
]

interface BannerModalProps {
  banner?: Banner | null
  onClose: () => void
  onSave: (data: Omit<Banner, 'id'>) => void
}

function BannerModal({ banner, onClose, onSave }: BannerModalProps) {
  const [title, setTitle] = useState(banner?.title ?? '')
  const [link, setLink] = useState(banner?.link ?? '')
  const [active, setActive] = useState(banner?.active ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ title, imageUrl: banner?.imageUrl ?? '', link, active, order: banner?.order ?? 0 })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {banner ? 'Editar Banner' : 'Novo Banner'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-500 dark:text-gray-400"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload de imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Imagem do Banner
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1a8a9f] transition-colors">
              <Image size={32} className="text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Clique para enviar ou arraste a imagem</span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP até 5MB</span>
              <input type="file" accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-black dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f] focus:border-transparent"
              placeholder="Ex: Promoção de Verão"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Link (URL de destino)
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-black dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f] focus:border-transparent"
              placeholder="Ex: /promocoes"
            />
          </div>

          {/* Ativo */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Banner ativo</span>
            <button
              type="button"
              onClick={() => setActive((v) => !v)}
              className="cursor-pointer"
            >
              {active
                ? <ToggleRight size={32} className="text-[#1a8a9f]" />
                : <ToggleLeft size={32} className="text-gray-400" />
              }
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-[#1a8a9f] text-white text-sm font-medium hover:bg-[#156e7f] transition-colors cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface DeleteModalProps {
  bannerTitle: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ bannerTitle, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Excluir banner</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tem certeza que deseja excluir <span className="font-medium text-gray-700 dark:text-gray-200">"{bannerTitle}"</span>? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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

export default function BannersHome() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const dragId = useRef<number | null>(null)
  const lastOverId = useRef<number | null>(null)
  const originalBanners = useRef<Banner[]>([])
  const didDrop = useRef(false)
  const touchActive = useRef(false)

  const openNew = () => {
    setEditingBanner(null)
    setIsModalOpen(true)
  }

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setIsModalOpen(true)
  }

  const handleSave = (data: Omit<Banner, 'id'>) => {
    if (editingBanner) {
      setBanners((prev) => prev.map((b) => b.id === editingBanner.id ? { ...b, ...data } : b))
    } else {
      const newId = Math.max(0, ...banners.map((b) => b.id)) + 1
      setBanners((prev) => [...prev, { id: newId, ...data }])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setDeletingId(id)
  }

  const confirmDelete = () => {
    if (deletingId !== null) {
      setBanners((prev) => prev.filter((b) => b.id !== deletingId))
      setDeletingId(null)
    }
  }

  const toggleActive = (id: number) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, active: !b.active } : b))
  }

  const reorder = (list: Banner[], fromId: number, toId: number): Banner[] => {
    const sorted = [...list].sort((a, b) => a.order - b.order)
    const fromIdx = sorted.findIndex((b) => b.id === fromId)
    const toIdx = sorted.findIndex((b) => b.id === toId)
    if (fromIdx === -1 || toIdx === -1) return list
    const result = [...sorted]
    const [moved] = result.splice(fromIdx, 1)
    result.splice(toIdx, 0, moved)
    return result.map((b, i) => ({ ...b, order: i + 1 }))
  }

  const getBannerIdFromElement = (el: Element | null): number | null => {
    let node = el
    while (node) {
      const raw = (node as HTMLElement).dataset?.bannerId
      if (raw !== undefined) return Number(raw)
      node = node.parentElement
    }
    return null
  }

  // ── Mouse drag ──────────────────────────────────────────────
  const handleDragStart = (id: number) => {
    if (touchActive.current) return
    dragId.current = id
    lastOverId.current = id
    didDrop.current = false
    originalBanners.current = [...banners].sort((a, b) => a.order - b.order)
    setDraggingId(id)
  }

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    if (dragId.current === null || lastOverId.current === id) return
    lastOverId.current = id
    setBanners((prev) => reorder(prev, dragId.current!, id))
  }

  const handleDrop = () => {
    didDrop.current = true
  }

  const handleDragEnd = () => {
    if (!didDrop.current) {
      setBanners(originalBanners.current)
    }
    dragId.current = null
    lastOverId.current = null
    didDrop.current = false
    setDraggingId(null)
  }

  // ── Touch drag ──────────────────────────────────────────────
  const handleTouchStart = (_e: React.TouchEvent, id: number) => {
    touchActive.current = true
    dragId.current = id
    lastOverId.current = id
    originalBanners.current = [...banners].sort((a, b) => a.order - b.order)
    setDraggingId(id)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragId.current === null) return
    e.preventDefault()
    const touch = e.touches[0]
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    const overId = getBannerIdFromElement(el)
    if (overId === null || overId === lastOverId.current) return
    lastOverId.current = overId
    setBanners((prev) => reorder(prev, dragId.current!, overId))
  }

  const handleTouchEnd = () => {
    dragId.current = null
    lastOverId.current = null
    touchActive.current = false
    setDraggingId(null)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Banners Home</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerencie os banners exibidos na página inicial
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Adicionar Banner
        </button>
      </div>

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
          <Image size={48} className="mb-3 opacity-40" />
          <p className="text-base font-medium">Nenhum banner cadastrado</p>
          <p className="text-sm mt-1">Clique em "Adicionar Banner" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners
            .sort((a, b) => a.order - b.order)
            .map((banner) => (
              <div
                key={banner.id}
                data-banner-id={banner.id}
                draggable
                onDragStart={() => handleDragStart(banner.id)}
                onDragOver={(e) => handleDragOver(e, banner.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`bg-white dark:bg-gray-800 rounded-xl border-2 overflow-hidden shadow-sm transition-all duration-200 ${
                  draggingId === banner.id
                    ? 'opacity-40 border-[#1a8a9f] scale-95'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Drag handle + Preview */}
                <div className="relative h-36 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <div
                    className="absolute top-2 left-2 p-1 rounded-md bg-black/20 text-white cursor-grab active:cursor-grabbing"
                    style={{ touchAction: 'none' }}
                    onTouchStart={(e) => handleTouchStart(e, banner.id)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <GripVertical size={16} />
                  </div>
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                      <Image size={32} />
                      <span className="text-xs">Sem imagem</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{banner.title}</p>
                      {banner.link && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{banner.link}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">#{banner.order}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Toggle ativo */}
                    <button
                      onClick={() => toggleActive(banner.id)}
                      className="flex items-center gap-1.5 text-xs cursor-pointer"
                    >
                      {banner.active
                        ? <><ToggleRight size={20} className="text-[#1a8a9f]" /><span className="text-[#1a8a9f] font-medium">Ativo</span></>
                        : <><ToggleLeft size={20} className="text-gray-400" /><span className="text-gray-400">Inativo</span></>
                      }
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(banner)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <BannerModal
          banner={editingBanner}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Modal */}
      {deletingId !== null && (
        <DeleteModal
          bannerTitle={banners.find((b) => b.id === deletingId)?.title ?? ''}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
