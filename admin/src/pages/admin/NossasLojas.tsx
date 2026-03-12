import { useState, useRef } from 'react'
import {
  Pencil,
  Trash2,
  ArrowLeft,
  ImageIcon,
  MapPin,
  Clock,
  Phone,
  Navigation,
  X,
  Store,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface Departamento {
  id: number
  nome: string
  fotos: string[]
}

const DEPARTAMENTOS_PADRAO = [
  'Alimentos',
  'HortiFruti',
  'Padaria',
  'Açougue',
  'Pet',
  'Papelaria',
]

interface Loja {
  id: number
  nome: string
  imageUrl: string
  rua: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  horarioSemana: string
  horarioDomingo: string
  telefone: string
  whatsapp: string
  linkMaps: string
  ordem: number
  cor: string
  departamentos: Departamento[]
}

const mockLojas: Loja[] = [
  {
    id: 1,
    nome: 'Loja Centro',
    imageUrl: '',
    rua: 'Rua das Flores, 1234',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    horarioSemana: 'Segunda a Sábado: 7h às 22h',
    horarioDomingo: 'Domingo: 8h às 20h',
    telefone: '(11) 3456-7890',
    whatsapp: '(11) 98765-4321',
    linkMaps: '',
    ordem: 1,
    cor: '#f97316',
    departamentos: DEPARTAMENTOS_PADRAO.map((nome, i) => ({ id: i + 1, nome, fotos: [] })),
  },
  {
    id: 2,
    nome: 'Loja 2',
    imageUrl: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    horarioSemana: '',
    horarioDomingo: '',
    telefone: '',
    whatsapp: '',
    linkMaps: '',
    ordem: 2,
    cor: '#f97316',
    departamentos: DEPARTAMENTOS_PADRAO.map((nome, i) => ({ id: i + 1, nome, fotos: [] })),
  },
]

// ── Formulário (página interna) ────────────────────────────────────────────

interface LojaFormProps {
  loja: Loja | null
  onBack: () => void
  onSave: (data: Omit<Loja, 'id'>) => void
}

function LojaForm({ loja, onBack, onSave }: LojaFormProps) {
  const [nome, setNome] = useState(loja?.nome ?? '')
  const [imageUrl, setImageUrl] = useState(loja?.imageUrl ?? '')
  const [rua, setRua] = useState(loja?.rua ?? '')
  const [bairro, setBairro] = useState(loja?.bairro ?? '')
  const [cidade, setCidade] = useState(loja?.cidade ?? '')
  const [estado, setEstado] = useState(loja?.estado ?? '')
  const [cep, setCep] = useState(loja?.cep ?? '')
  const [horarioSemana, setHorarioSemana] = useState(loja?.horarioSemana ?? '')
  const [horarioDomingo, setHorarioDomingo] = useState(loja?.horarioDomingo ?? '')
  const [telefone, setTelefone] = useState(loja?.telefone ?? '')
  const [whatsapp, setWhatsapp] = useState(loja?.whatsapp ?? '')
  const [linkMaps, setLinkMaps] = useState(loja?.linkMaps ?? '')
  const [cor, setCor] = useState(loja?.cor ?? '#f97316')
  const [departamentos, setDepartamentos] = useState<Departamento[]>(
    loja?.departamentos ?? DEPARTAMENTOS_PADRAO.map((n, i) => ({ id: i + 1, nome: n, fotos: [] }))
  )
  const [expandedDept, setExpandedDept] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const deptFileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const handleRemoveDept = (id: number) => {
    setDepartamentos((prev) => prev.filter((d) => d.id !== id))
  }

  const handleDeptFotos = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.readAsDataURL(file)
        })
    )
    Promise.all(readers).then((urls) => {
      setDepartamentos((prev) =>
        prev.map((d) => (d.id === id ? { ...d, fotos: [...d.fotos, ...urls] } : d))
      )
    })
    // reset input so same file can be re-added
    if (deptFileRefs.current[id]) deptFileRefs.current[id]!.value = ''
  }

  const handleRemoveFoto = (deptId: number, fotoIdx: number) => {
    setDepartamentos((prev) =>
      prev.map((d) =>
        d.id === deptId ? { ...d, fotos: d.fotos.filter((_, i) => i !== fotoIdx) } : d
      )
    )
  }

  const isEdit = loja !== null

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
      nome,
      imageUrl,
      rua,
      bairro,
      cidade,
      estado,
      cep,
      horarioSemana,
      horarioDomingo,
      telefone,
      whatsapp,
      linkMaps,
      cor,
      ordem: loja?.ordem ?? 0,
      departamentos,
    })
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/40 focus:border-[#1a8a9f] transition-colors'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
  const sectionClass = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5'

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
            {isEdit ? 'Editar Loja' : 'Nova Loja'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Nossas Lojas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
            Informações Gerais
          </h2>

          <div>
            <label className={labelClass}>
              Nome da Loja <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Loja Centro"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
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
                placeholder="#f97316"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a8a9f]/30 focus:border-[#1a8a9f] transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Foto da Loja</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[#1a8a9f] transition-colors"
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-56 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400">
                  <ImageIcon size={32} />
                  <span className="text-sm">Clique para enviar uma foto</span>
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
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <MapPin size={16} className="text-[#1a8a9f]" />
            Endereço
          </h2>

          <div>
            <label className={labelClass}>
              Rua / Logradouro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              placeholder="Ex: Rua das Flores, 1234"
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bairro</label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>CEP</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Ex: 01234-567"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cidade</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: São Paulo"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Estado (UF)</label>
              <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Ex: SP"
                maxLength={2}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <Navigation size={14} className="text-[#1a8a9f]" />
                Link Google Maps ("Como Chegar")
              </span>
            </label>
            <input
              type="url"
              value={linkMaps}
              onChange={(e) => setLinkMaps(e.target.value)}
              placeholder="https://maps.google.com/..."
              className={inputClass}
            />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Clock size={16} className="text-[#1a8a9f]" />
            Horário de Funcionamento
          </h2>

          <div>
            <label className={labelClass}>Segunda a Sábado</label>
            <input
              type="text"
              value={horarioSemana}
              onChange={(e) => setHorarioSemana(e.target.value)}
              placeholder="Ex: Segunda a Sábado: 7h às 22h"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Domingo</label>
            <input
              type="text"
              value={horarioDomingo}
              onChange={(e) => setHorarioDomingo(e.target.value)}
              placeholder="Ex: Domingo: 8h às 20h"
              className={inputClass}
            />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Phone size={16} className="text-[#1a8a9f]" />
            Contato
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: (11) 3456-7890"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Fotos dos Departamentos */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Store size={16} className="text-[#1a8a9f]" />
            Fotos dos Departamentos
          </h2>

          <div className="space-y-3">
            {departamentos.map((dept) => {
              const isExpanded = expandedDept === dept.id
              return (
                <div key={dept.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Header do departamento */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer select-none"
                    onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{dept.nome}</span>
                      {dept.fotos.length > 0 && (
                        <span className="text-xs bg-[#1a8a9f]/10 text-[#1a8a9f] font-semibold px-2 py-0.5 rounded-full">
                          {dept.fotos.length} foto{dept.fotos.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveDept(dept.id) }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remover departamento"
                      >
                        <Trash2 size={14} />
                      </button>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Conteúdo expandido */}
                  {isExpanded && (
                    <div className="p-4 space-y-4">
                      {/* Grade de fotos */}
                      {dept.fotos.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {dept.fotos.map((foto, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                              <img src={foto} alt={`${dept.nome} ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveFoto(dept.id, idx)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
                              >
                                <X size={12} />
                              </button>
                              <div className="absolute bottom-1.5 left-1.5 text-[10px] font-medium bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                                {idx + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Botão de upload */}
                      <button
                        type="button"
                        onClick={() => deptFileRefs.current[dept.id]?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-[#1a8a9f] hover:text-[#1a8a9f] hover:bg-[#1a8a9f]/5 transition-colors cursor-pointer"
                      >
                        <ImageIcon size={20} />
                        <span className="text-sm font-medium">Clique para adicionar fotos</span>
                        <span className="text-xs">Você pode selecionar várias fotos de uma vez</span>
                      </button>
                      <input
                        ref={(el) => { deptFileRefs.current[dept.id] = el }}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleDeptFotos(dept.id, e)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Pré-visualização */}
        {(nome || imageUrl) && (
          <div className={sectionClass}>
            <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
              Pré-visualização
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Imagem */}
              <div className="lg:order-2">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={nome}
                    className="w-full h-auto object-cover rounded-3xl border-4 shadow-lg"
                    style={{ borderColor: cor }}
                  />
                ) : (
                  <div className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300">
                    <ImageIcon size={32} />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                )}
              </div>
              {/* Conteúdo */}
              <div className="lg:order-1">
                {nome && (
                  <h3 className="text-4xl font-bold mb-6" style={{ color: cor }}>{nome}</h3>
                )}
                <div className="space-y-4">
                  {(rua || bairro || cidade) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="mt-0.5 shrink-0" style={{ color: cor }} />
                        <div className="space-y-1">
                          {rua && <p className="font-semibold text-gray-900 text-base">{rua}</p>}
                          {bairro && <p className="text-gray-600">{bairro}</p>}
                          {cidade && (
                            <p className="text-gray-600">{cidade}{estado ? ` - ${estado}` : ''}</p>
                          )}
                          {cep && <p className="text-gray-600">CEP: {cep}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {(horarioSemana || horarioDomingo) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <Clock size={20} className="mt-0.5 shrink-0" style={{ color: cor }} />
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900 text-base">Horário de Funcionamento</p>
                          {horarioSemana && <p className="text-gray-600">{horarioSemana}</p>}
                          {horarioDomingo && <p className="text-gray-600">{horarioDomingo}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {(telefone || whatsapp) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <Phone size={20} className="mt-0.5 shrink-0" style={{ color: cor }} />
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900 text-base">Contato</p>
                          {telefone && <p className="text-gray-600">Telefone: {telefone}</p>}
                          {whatsapp && <p className="text-gray-600">WhatsApp: {whatsapp}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {linkMaps && (
                    <a
                      href={linkMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: cor }}
                    >
                      <Navigation size={18} />
                      Como Chegar
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Departamentos preview */}
            {departamentos.some((d) => d.fotos.length > 0) && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Nossos Departamentos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {departamentos.filter((d) => d.fotos.length > 0).map((dept) => (
                    <div key={dept.id} className="relative overflow-hidden shadow-lg" style={{ width: '370px', height: '280px', borderRadius: '16px' }}>
                      <img
                        src={dept.fotos[0]}
                        alt={dept.nome}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 py-4 px-3 flex items-center justify-center"
                        style={{ backgroundColor: '#ff1b2d' }}
                      >
                        <span className="text-white font-bold text-center leading-tight tracking-wide" style={{ fontSize: '24px' }}>{dept.nome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            {isEdit ? 'Salvar Alterações' : 'Adicionar Loja'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Card da Loja ──────────────────────────────────────────────────────────────

interface LojaCardProps {
  loja: Loja
  onEdit: (loja: Loja) => void
}

function LojaCard({ loja, onEdit }: LojaCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500">Loja #{loja.ordem}</span>
        <button
          onClick={() => onEdit(loja)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a8a9f] transition-colors cursor-pointer"
          title="Editar"
        >
          <Pencil size={15} />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Imagem */}
        <div className="lg:order-2">
          {loja.imageUrl ? (
            <img
              src={loja.imageUrl}
              alt={loja.nome}
              className="w-full h-auto object-cover rounded-3xl border-4 shadow-lg"
              style={{ borderColor: loja.cor }}
            />
          ) : (
            <div className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300">
              <ImageIcon size={32} />
              <span className="text-xs">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="lg:order-1">
          <h3 className="text-4xl font-bold mb-6" style={{ color: loja.cor }}>{loja.nome}</h3>
          <div className="space-y-4">
            {(loja.rua || loja.bairro || loja.cidade) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0" style={{ color: loja.cor }} />
                  <div className="space-y-1">
                    {loja.rua && <p className="font-semibold text-gray-900 text-base">{loja.rua}</p>}
                    {loja.bairro && <p className="text-gray-600">{loja.bairro}</p>}
                    {loja.cidade && (
                      <p className="text-gray-600">{loja.cidade}{loja.estado ? ` - ${loja.estado}` : ''}</p>
                    )}
                    {loja.cep && <p className="text-gray-600">CEP: {loja.cep}</p>}
                  </div>
                </div>
              </div>
            )}

            {(loja.horarioSemana || loja.horarioDomingo) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="mt-0.5 shrink-0" style={{ color: loja.cor }} />
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-base">Horário de Funcionamento</p>
                    {loja.horarioSemana && <p className="text-gray-600">{loja.horarioSemana}</p>}
                    {loja.horarioDomingo && <p className="text-gray-600">{loja.horarioDomingo}</p>}
                  </div>
                </div>
              </div>
            )}

            {(loja.telefone || loja.whatsapp) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <Phone size={20} className="mt-0.5 shrink-0" style={{ color: loja.cor }} />
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-base">Contato</p>
                    {loja.telefone && <p className="text-gray-600">Telefone: {loja.telefone}</p>}
                    {loja.whatsapp && <p className="text-gray-600">WhatsApp: {loja.whatsapp}</p>}
                  </div>
                </div>
              </div>
            )}

            {loja.linkMaps && (
              <a
                href={loja.linkMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: loja.cor }}
              >
                <Navigation size={18} />
                Como Chegar
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Departamentos */}
      {loja.departamentos?.some((d) => d.fotos.length > 0) && (
        <div className="px-5 pb-5 pt-1">
          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-base font-bold text-gray-800 mb-4">Nossos Departamentos</h4>
            <div className="flex flex-wrap gap-4">
              {loja.departamentos.filter((d) => d.fotos.length > 0).map((dept) => (
                <div
                  key={dept.id}
                  className="relative overflow-hidden shadow-lg shrink-0"
                  style={{ width: '370px', height: '280px', borderRadius: '16px' }}
                >
                  <img
                    src={dept.fotos[0]}
                    alt={dept.nome}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 py-4 px-3 flex items-center justify-center"
                    style={{ backgroundColor: '#ff1b2d' }}
                  >
                    <span
                      className="text-white font-bold text-center leading-tight tracking-wide"
                      style={{ fontSize: '24px' }}
                    >
                      {dept.nome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Página Principal ──────────────────────────────────────────────────────────

export default function NossasLojas() {
  const [lojas, setLojas] = useState<Loja[]>(mockLojas)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingLoja, setEditingLoja] = useState<Loja | null>(null)

  const handleEdit = (loja: Loja) => {
    setEditingLoja(loja)
    setView('form')
  }

  const handleBack = () => {
    setView('list')
    setEditingLoja(null)
  }

  const handleSave = (data: Omit<Loja, 'id'>) => {
    if (editingLoja) {
      setLojas((prev) =>
        prev.map((l) => (l.id === editingLoja.id ? { ...l, ...data } : l))
      )
    }
    handleBack()
  }

  if (view === 'form') {
    return (
      <LojaForm
        loja={editingLoja}
        onBack={handleBack}
        onSave={handleSave}
      />
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nossas Lojas</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Gerencie as informações das lojas exibidas no site
        </p>
      </div>

      <div className="space-y-4">
        {lojas.map((loja) => (
          <LojaCard
            key={loja.id}
            loja={loja}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  )
}
