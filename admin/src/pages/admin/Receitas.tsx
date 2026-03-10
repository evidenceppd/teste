import { useState, useRef } from 'react'
import { Plus, Pencil, Trash2, Clock, Users, ChefHat, AlertTriangle, ArrowLeft, BookOpen, ImageIcon, Upload, X } from 'lucide-react'

interface Receita {
  id: number
  title: string
  description: string
  ingredients: string
  preparation: string
  prepTime: string
  servings: number
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
  tips: string
  imageUrl: string
}

const mockReceitas: Receita[] = [
  {
    id: 1,
    title: 'Frango Grelhado ao Limão',
    description: 'Uma receita leve e saborosa de frango grelhado com tempero de limão siciliano e ervas finas.',
    ingredients: '500g de peito de frango\n2 limões sicilianos\n3 dentes de alho\nSal e pimenta a gosto\nAzeite de oliva\nErvas finas (tomilho, alecrim)',
    preparation: '1. Tempere o frango com sal, pimenta, alho amassado e suco de limão.\n2. Deixe marinar por 30 minutos.\n3. Aqueça uma grelha em fogo médio-alto.\n4. Grelhe o frango por 6 a 8 minutos de cada lado.\n5. Sirva com rodelas de limão e ervas frescas.',
    prepTime: '45 min',
    servings: 4,
    difficulty: 'Fácil',
    tips: 'Para um frango ainda mais suculento, cubra com papel alumínio durante 5 minutos após grelhar.',
    imageUrl: '',
  },
  {
    id: 2,
    title: 'Salada Caesar Clássica',
    description: 'A tradicional salada Caesar com molho cremoso, croutons crocantes e parmesão.',
    ingredients: '1 pé de alface romana\n100g de queijo parmesão\nCroutons\nMolho Caesar (maionese, mostarda, limão, anchova)',
    preparation: '1. Rasgue as folhas de alface em pedaços.\n2. Prepare o molho misturando todos os ingredientes.\n3. Misture a alface com o molho.\n4. Adicione os croutons e o parmesão ralado.',
    prepTime: '20 min',
    servings: 2,
    difficulty: 'Fácil',
    tips: 'Use alface bem gelada para uma textura mais crocante.',
    imageUrl: '',
  },
]

const difficultyColors: Record<Receita['difficulty'], string> = {
  'Fácil': 'bg-green-100 text-green-700',
  'Médio': 'bg-yellow-100 text-yellow-700',
  'Difícil': 'bg-red-100 text-red-700',
}

// ── Formulário (página interna) ──────────────────────────────────────────────

interface ReceitaFormProps {
  receita: Receita | null
  onBack: () => void
  onSave: (data: Omit<Receita, 'id'>) => void
}

function ReceitaForm({ receita, onBack, onSave }: ReceitaFormProps) {
  const [title, setTitle] = useState(receita?.title ?? '')
  const [description, setDescription] = useState(receita?.description ?? '')
  const [ingredients, setIngredients] = useState(receita?.ingredients ?? '')
  const [preparation, setPreparation] = useState(receita?.preparation ?? '')
  const [prepTime, setPrepTime] = useState(receita?.prepTime ?? '')
  const [servings, setServings] = useState(receita?.servings ?? 2)
  const [difficulty, setDifficulty] = useState<Receita['difficulty']>(receita?.difficulty ?? 'Fácil')
  const [tips, setTips] = useState(receita?.tips ?? '')
  const [imageUrl, setImageUrl] = useState(receita?.imageUrl ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = receita !== null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ title, description, ingredients, preparation, prepTime, servings, difficulty, tips, imageUrl })
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#1a8a9f] focus:border-transparent resize-none'
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
            {isEdit ? 'Editar Receita' : 'Nova Receita'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Atualize as informações da receita' : 'Preencha as informações da nova receita'}
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Título */}
          <div>
            <label className={labelCls}>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Frango Grelhado ao Limão"
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
              placeholder="Uma breve descrição da receita..."
              className={inputCls}
            />
          </div>

          {/* Tempo / Porções / Dificuldade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Tempo de preparo</label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                required
                placeholder="Ex: 45 min"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Nº de porções</label>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Dificuldade</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Receita['difficulty'])}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="Fácil">Fácil</option>
                <option value="Médio">Médio</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <label className={labelCls}>Ingredientes</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              rows={6}
              placeholder={"500g de frango\n2 dentes de alho\nSal e pimenta a gosto"}
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Um ingrediente por linha</p>
          </div>

          {/* Modo de Preparo */}
          <div>
            <label className={labelCls}>Modo de preparo</label>
            <textarea
              value={preparation}
              onChange={(e) => setPreparation(e.target.value)}
              required
              rows={7}
              placeholder={"1. Preaqueça o forno a 200°C.\n2. Tempere o frango com sal e pimenta.\n3. Asse por 40 minutos."}
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Numere cada passo para facilitar a leitura</p>
          </div>

          {/* Dicas */}
          <div>
            <label className={labelCls}>Dicas</label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              rows={3}
              placeholder="Dicas extras para deixar a receita ainda melhor..."
              className={inputCls}
            />
          </div>

          {/* Imagem */}
          <div>
            <label className={labelCls}>Imagem da receita</label>
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
              {isEdit ? 'Salvar alterações' : 'Adicionar receita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal de Exclusão ────────────────────────────────────────────────────────

interface DeleteModalProps {
  receitaTitle: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ receitaTitle, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir receita</h3>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-gray-700">"{receitaTitle}"</span>?
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

// ── Card de Receita ──────────────────────────────────────────────────────────

interface ReceitaCardProps {
  receita: Receita
  onEdit: () => void
  onDelete: () => void
}

function ReceitaCard({ receita, onEdit, onDelete }: ReceitaCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image area */}
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        {receita.imageUrl ? (
          <img src={receita.imageUrl} alt={receita.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <BookOpen size={36} />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{receita.title}</h3>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[receita.difficulty]}`}>
            {receita.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">{receita.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-1">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {receita.prepTime}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} />
            {receita.servings} {receita.servings === 1 ? 'porção' : 'porções'}
          </span>
          <span className="flex items-center gap-1">
            <ChefHat size={13} />
            {receita.difficulty}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
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

// ── Página Principal ─────────────────────────────────────────────────────────

type View = 'list' | 'form'

export default function Receitas() {
  const [receitas, setReceitas] = useState<Receita[]>(mockReceitas)
  const [view, setView] = useState<View>('list')
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const goToNew = () => {
    setEditingReceita(null)
    setView('form')
  }

  const goToEdit = (receita: Receita) => {
    setEditingReceita(receita)
    setView('form')
  }

  const goToList = () => {
    setView('list')
    setEditingReceita(null)
  }

  const handleSave = (data: Omit<Receita, 'id'>) => {
    if (editingReceita) {
      setReceitas((prev) => prev.map((r) => r.id === editingReceita.id ? { ...r, ...data } : r))
    } else {
      const newId = Math.max(0, ...receitas.map((r) => r.id)) + 1
      setReceitas((prev) => [...prev, { id: newId, ...data }])
    }
    goToList()
  }

  const confirmDelete = () => {
    if (deletingId !== null) {
      setReceitas((prev) => prev.filter((r) => r.id !== deletingId))
      setDeletingId(null)
    }
  }

  // ── Formulário (página) ──
  if (view === 'form') {
    return <ReceitaForm receita={editingReceita} onBack={goToList} onSave={handleSave} />
  }

  // ── Lista ──
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receitas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie as receitas exibidas no site</p>
        </div>
        <button
          onClick={goToNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          Adicionar Receita
        </button>
      </div>

      {receitas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <BookOpen size={48} strokeWidth={1} />
          <p className="text-sm">Nenhuma receita cadastrada ainda.</p>
          <button
            onClick={goToNew}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={15} />
            Adicionar primeira receita
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {receitas.map((receita) => (
            <ReceitaCard
              key={receita.id}
              receita={receita}
              onEdit={() => goToEdit(receita)}
              onDelete={() => setDeletingId(receita.id)}
            />
          ))}
        </div>
      )}

      {deletingId !== null && (
        <DeleteModal
          receitaTitle={receitas.find((r) => r.id === deletingId)?.title ?? ''}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
