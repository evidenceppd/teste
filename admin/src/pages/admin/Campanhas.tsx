import { useState, useRef } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  ImageIcon,
  X,
  Megaphone,
  Trophy,
  ScrollText,
  ListChecks,
} from 'lucide-react'

// ── Tipos ────────────────────────────────────────────────────────────────────

interface Passo {
  id: number
  titulo: string
  descricao: string
}

interface Premio {
  id: number
  posicao: string   // "1º", "2º", "3º"
  cor: string       // cor do badge
  nome: string
  subtitulo: string
  valor: string
}

interface Campanha {
  id: number
  titulo: string
  data: string
  imageUrl: string
  introParas: string[]      // parágrafos de introdução
  comoParticiparDesc: string
  passos: Passo[]
  premiosDesc: string
  premios: Premio[]
  regulamentoDesc: string
  regras: string[]
  ativa: boolean
}

const mockCampanhas: Campanha[] = [
  {
    id: 1,
    titulo: '19 Anos Supermercado Bandeiras — Compre e Concorra a Prêmios Incríveis!',
    data: 'Fevereiro de 2026',
    imageUrl: '',
    introParas: [
      'Para celebrar nosso aniversário de 19 anos, o Supermercado Bandeiras preparou uma campanha especial: compre, ganhe cupons e concorra a vales-compras que vão abastecer sua casa por até um ano inteiro.',
      'Desde a nossa fundação, trabalhamos todos os dias para oferecer qualidade, variedade e os melhores preços para você e sua família. São 19 anos de história construída junto com nossa comunidade — e nada melhor do que celebrar essa data com uma campanha que devolve ainda mais valor para quem confia no Supermercado Bandeiras.',
      'A promoção é válida durante todo o mês de fevereiro de 2026, em todas as unidades participantes. Quanto mais você comprar, mais cupons acumula e maiores são suas chances de ganhar.',
    ],
    comoParticiparDesc:
      'A mecânica é simples: a cada R$ 50,00 em compras você recebe automaticamente 1 cupom de participação, emitido no caixa no ato da compra. Guarde todos os seus cupons — eles serão necessários para retirada do prêmio.',
    passos: [
      { id: 1, titulo: 'Faça suas compras', descricao: 'Compre em qualquer unidade do Supermercado Bandeiras durante fevereiro de 2026.' },
      { id: 2, titulo: 'Ganhe cupons', descricao: 'A cada R$ 50,00 em compras você recebe 1 cupom físico no caixa.' },
      { id: 3, titulo: 'Concorra aos prêmios', descricao: 'Guarde seus cupons e aguarde o sorteio ao vivo no evento de aniversário.' },
    ],
    premiosDesc:
      'Serão sorteados 3 vencedores, cada um com um prêmio diferente. Todos os prêmios são em formato de vales-compras mensais no próprio Supermercado Bandeiras:',
    premios: [
      { id: 1, posicao: '1º', cor: '#ef4444', nome: 'Carrinho Cheio o Ano Inteiro', subtitulo: '12 vales-compras de R$ 500,00', valor: 'R$ 6.000,00' },
      { id: 2, posicao: '2º', cor: '#3b82f6', nome: 'Carrinho Cheio por 6 Meses', subtitulo: '6 vales-compras de R$ 500,00', valor: 'R$ 3.000,00' },
      { id: 3, posicao: '3º', cor: '#f97316', nome: 'Carrinho Cheio por 3 Meses', subtitulo: '3 vales-compras de R$ 500,00', valor: 'R$ 1.500,00' },
    ],
    regulamentoDesc:
      'Confira abaixo as principais regras da campanha. O regulamento completo está disponível nas unidades participantes.',
    regras: [
      'A cada R$ 50,00 em compras você recebe 1 cupom de participação.',
      'Múltiplos de R$ 50,00 na mesma compra geram múltiplos cupons.',
      'Cupons são emitidos no caixa no ato da compra.',
      'Não acumulável com outras promoções.',
      'Válido apenas nas unidades participantes do Supermercado Bandeiras.',
      'O sorteio será realizado ao vivo em data e local a ser divulgado nas redes sociais.',
      'Vencedores serão contactados pelo telefone cadastrado no ato da compra.',
      'É obrigatória a apresentação do cupom físico para retirada do prêmio.',
      'Promoção válida para o mês de fevereiro de 2026.',
    ],
    ativa: true,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

let nextPremioId = 4
let nextPassoId = 4

// ── Form ─────────────────────────────────────────────────────────────────────

interface CampanhaFormProps {
  campanha: Campanha | null
  onBack: () => void
  onSave: (data: Omit<Campanha, 'id'>) => void
}

function CampanhaForm({ campanha, onBack, onSave }: CampanhaFormProps) {
  const isEdit = campanha !== null

  const [titulo, setTitulo] = useState(campanha?.titulo ?? '')
  const [data, setData] = useState(campanha?.data ?? '')
  const [imageUrl, setImageUrl] = useState(campanha?.imageUrl ?? '')
  const [ativa, setAtiva] = useState(campanha?.ativa ?? true)

  // Introdução
  const [introParas, setIntroParas] = useState<string[]>(
    campanha?.introParas ?? ['']
  )

  // Como Participar
  const [comoParticiparDesc, setComoParticiparDesc] = useState(
    campanha?.comoParticiparDesc ?? ''
  )
  const [passos, setPassos] = useState<Passo[]>(campanha?.passos ?? [])

  // Prêmios
  const [premiosDesc, setPremiosDesc] = useState(campanha?.premiosDesc ?? '')
  const [premios, setPremios] = useState<Premio[]>(
    campanha?.premios ?? [
      { id: 1, posicao: '1º', cor: '#ef4444', nome: '', subtitulo: '', valor: '' },
      { id: 2, posicao: '2º', cor: '#3b82f6', nome: '', subtitulo: '', valor: '' },
      { id: 3, posicao: '3º', cor: '#f97316', nome: '', subtitulo: '', valor: '' },
    ]
  )

  // Regulamento
  const [regulamentoDesc, setRegulamentoDesc] = useState(
    campanha?.regulamentoDesc ?? ''
  )
  const [regras, setRegras] = useState<string[]>(campanha?.regras ?? [''])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Introdução helpers
  const updatePara = (i: number, val: string) =>
    setIntroParas((p) => p.map((v, idx) => (idx === i ? val : v)))
  const addPara = () => setIntroParas((p) => [...p, ''])
  const removePara = (i: number) =>
    setIntroParas((p) => p.filter((_, idx) => idx !== i))

  // Passos helpers
  const addPasso = () => {
    setPassos((p) => [...p, { id: nextPassoId++, titulo: '', descricao: '' }])
  }
  const updatePasso = (id: number, field: keyof Passo, val: string) =>
    setPassos((p) =>
      p.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    )
  const removePasso = (id: number) =>
    setPassos((p) => p.filter((s) => s.id !== id))

  // Prêmios helpers
  const addPremio = () => {
    setPremios((p) => [
      ...p,
      { id: nextPremioId++, posicao: `${p.length + 1}º`, cor: '#6b7280', nome: '', subtitulo: '', valor: '' },
    ])
  }
  const updatePremio = (id: number, field: keyof Premio, val: string) =>
    setPremios((p) =>
      p.map((pr) => (pr.id === id ? { ...pr, [field]: val } : pr))
    )
  const removePremio = (id: number) =>
    setPremios((p) => p.filter((pr) => pr.id !== id))

  // Regras helpers
  const updateRegra = (i: number, val: string) =>
    setRegras((r) => r.map((v, idx) => (idx === i ? val : v)))
  const addRegra = () => setRegras((r) => [...r, ''])
  const removeRegra = (i: number) =>
    setRegras((r) => r.filter((_, idx) => idx !== i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      titulo,
      data,
      imageUrl,
      ativa,
      introParas: introParas.filter((p) => p.trim()),
      comoParticiparDesc,
      passos,
      premiosDesc,
      premios,
      regulamentoDesc,
      regras: regras.filter((r) => r.trim()),
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
            {isEdit ? 'Editar Campanha' : 'Nova Campanha'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Campanhas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Informações Gerais ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
            Informações Gerais
          </h2>

          <div>
            <label className={labelClass}>
              Título da Campanha <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: 19 Anos — Compre e Concorra!"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Período / Data</label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Ex: Fevereiro de 2026"
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAtiva((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                ativa ? 'bg-[#1a8a9f]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  ativa ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">
              Campanha {ativa ? 'ativa' : 'inativa'}
            </span>
          </div>
        </div>

        {/* ── Banner ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#1a8a9f]" />
            Imagem Banner (Hero)
          </h2>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[#1a8a9f] transition-colors"
          >
            {imageUrl ? (
              <div className="relative group">
                <img src={imageUrl} alt="Banner" className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Clique para alterar</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-gray-400">
                <ImageIcon size={32} />
                <span className="text-sm">Clique para enviar o banner</span>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {/* ── Introdução ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
            Texto de Introdução
          </h2>
          <div className="space-y-3">
            {introParas.map((para, i) => (
              <div key={i} className="flex gap-2 items-start">
                <textarea
                  value={para}
                  onChange={(e) => updatePara(i, e.target.value)}
                  placeholder={`Parágrafo ${i + 1}...`}
                  rows={3}
                  className={`${inputClass} resize-none flex-1`}
                />
                {introParas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePara(i)}
                    className="mt-1 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addPara}
            className="inline-flex items-center gap-1.5 text-sm text-[#1a8a9f] hover:underline cursor-pointer"
          >
            <Plus size={15} /> Adicionar parágrafo
          </button>
        </div>

        {/* ── Como Participar ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <ListChecks size={16} className="text-[#1a8a9f]" />
            Como Participar
          </h2>

          <div>
            <label className={labelClass}>Descrição da seção</label>
            <textarea
              value={comoParticiparDesc}
              onChange={(e) => setComoParticiparDesc(e.target.value)}
              placeholder="Explique a mecânica da campanha..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Passos</label>
            <div className="space-y-3">
              {passos.map((passo, i) => (
                <div key={passo.id} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
                  <div className="w-7 h-7 rounded-full bg-[#1a8a9f]/10 text-[#1a8a9f] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={passo.titulo}
                      onChange={(e) => updatePasso(passo.id, 'titulo', e.target.value)}
                      placeholder="Título do passo"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={passo.descricao}
                      onChange={(e) => updatePasso(passo.id, 'descricao', e.target.value)}
                      placeholder="Descrição do passo"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePasso(passo.id)}
                    className="mt-1 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addPasso}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#1a8a9f] hover:underline cursor-pointer"
            >
              <Plus size={15} /> Adicionar passo
            </button>
          </div>
        </div>

        {/* ── Prêmios ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Trophy size={16} className="text-[#1a8a9f]" />
            Os Prêmios
          </h2>

          <div>
            <label className={labelClass}>Descrição da seção</label>
            <textarea
              value={premiosDesc}
              onChange={(e) => setPremiosDesc(e.target.value)}
              placeholder="Descreva os prêmios..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Lista de Prêmios</label>
            <div className="space-y-3">
              {premios.map((premio) => (
                <div key={premio.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Posição</label>
                      <input
                        type="text"
                        value={premio.posicao}
                        onChange={(e) => updatePremio(premio.id, 'posicao', e.target.value)}
                        placeholder="1º"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Cor do badge</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={premio.cor}
                          onChange={(e) => updatePremio(premio.id, 'cor', e.target.value)}
                          className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={premio.cor}
                          onChange={(e) => updatePremio(premio.id, 'cor', e.target.value)}
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Valor</label>
                      <input
                        type="text"
                        value={premio.valor}
                        onChange={(e) => updatePremio(premio.id, 'valor', e.target.value)}
                        placeholder="R$ 6.000,00"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removePremio(premio.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Nome do prêmio</label>
                      <input
                        type="text"
                        value={premio.nome}
                        onChange={(e) => updatePremio(premio.id, 'nome', e.target.value)}
                        placeholder="Carrinho Cheio o Ano Inteiro"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Subtítulo</label>
                      <input
                        type="text"
                        value={premio.subtitulo}
                        onChange={(e) => updatePremio(premio.id, 'subtitulo', e.target.value)}
                        placeholder="12 vales-compras de R$ 500,00"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addPremio}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#1a8a9f] hover:underline cursor-pointer"
            >
              <Plus size={15} /> Adicionar prêmio
            </button>
          </div>
        </div>

        {/* ── Regulamento ── */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <ScrollText size={16} className="text-[#1a8a9f]" />
            Regulamento
          </h2>

          <div>
            <label className={labelClass}>Descrição da seção</label>
            <textarea
              value={regulamentoDesc}
              onChange={(e) => setRegulamentoDesc(e.target.value)}
              placeholder="Introdução ao regulamento..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Regras</label>
            <div className="space-y-2">
              {regras.map((regra, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    value={regra}
                    onChange={(e) => updateRegra(i, e.target.value)}
                    placeholder={`Regra ${i + 1}...`}
                    className={`${inputClass} flex-1`}
                  />
                  {regras.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRegra(i)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRegra}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#1a8a9f] hover:underline cursor-pointer"
            >
              <Plus size={15} /> Adicionar regra
            </button>
          </div>
        </div>

        {/* ── Preview ── */}
        {titulo && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 mb-5">
              Pré-visualização
            </h2>

            {/* Banner */}
            {imageUrl && (
              <img src={imageUrl} alt="Banner" className="w-full h-64 object-cover rounded-2xl mb-6" />
            )}

            {/* Data + Título */}
            {data && <p className="text-sm text-gray-400 mb-2">{data}</p>}
            <h3 className="text-3xl font-bold text-red-500 mb-4 leading-tight">{titulo}</h3>

            {/* Intro */}
            {introParas.filter(Boolean).length > 0 && (
              <div className="space-y-3 mb-6">
                {introParas.filter(Boolean).map((p, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed">{p}</p>
                ))}
              </div>
            )}

            {/* Como Participar */}
            {(comoParticiparDesc || passos.length > 0) && (
              <div className="mb-6 pt-4 border-t border-gray-100">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Como participar</h4>
                {comoParticiparDesc && <p className="text-sm text-gray-600 mb-4">{comoParticiparDesc}</p>}
                <div className="space-y-2">
                  {passos.map((passo, i) => (
                    <div key={passo.id} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: ['#ef4444', '#3b82f6', '#f97316'][i % 3] ?? '#6b7280' }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{passo.titulo}</p>
                        {passo.descricao && <p className="text-xs text-gray-500 mt-0.5">{passo.descricao}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prêmios */}
            {(premiosDesc || premios.length > 0) && (
              <div className="mb-6 pt-4 border-t border-gray-100">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Os prêmios</h4>
                {premiosDesc && <p className="text-sm text-gray-600 mb-4">{premiosDesc}</p>}
                <div className="space-y-2">
                  {premios.map((pr) => (
                    <div key={pr.id} className="flex items-center gap-4 rounded-xl p-4 border border-gray-100" style={{ backgroundColor: pr.cor + '11' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: pr.cor }}>
                        {pr.posicao}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{pr.nome || '—'}</p>
                        {pr.subtitulo && <p className="text-xs text-gray-500">{pr.subtitulo}</p>}
                      </div>
                      {pr.valor && (
                        <div className="text-right">
                          <p className="font-bold text-base" style={{ color: pr.cor }}>{pr.valor}</p>
                          <p className="text-xs text-gray-400">em prêmios</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regulamento */}
            {(regulamentoDesc || regras.filter(Boolean).length > 0) && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Regulamento</h4>
                {regulamentoDesc && <p className="text-sm text-gray-600 mb-4">{regulamentoDesc}</p>}
                <ul className="space-y-2">
                  {regras.filter(Boolean).map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      {r}
                    </li>
                  ))}
                </ul>
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
            {isEdit ? 'Salvar Alterações' : 'Criar Campanha'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Modal de exclusão ────────────────────────────────────────────────────────

function DeleteModal({
  titulo,
  onConfirm,
  onCancel,
}: {
  titulo: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir campanha</h3>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-gray-700">"{titulo}"</span>? Esta ação não pode ser desfeita.
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

// ── Card da Campanha ──────────────────────────────────────────────────────────

function CampanhaCard({
  campanha,
  onEdit,
  onDelete,
}: {
  campanha: Campanha
  onEdit: (c: Campanha) => void
  onDelete: (c: Campanha) => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              campanha.ativa
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {campanha.ativa ? 'Ativa' : 'Inativa'}
          </span>
          {campanha.data && (
            <span className="text-xs text-gray-400">{campanha.data}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(campanha)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1a8a9f] transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(campanha)}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex gap-5 p-5 items-start">
        {/* Banner thumb */}
        <div className="shrink-0 w-32 h-20 rounded-xl overflow-hidden border border-gray-100">
          {campanha.imageUrl ? (
            <img src={campanha.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
              <ImageIcon size={20} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 mb-2">
            {campanha.titulo}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <ListChecks size={13} />
              {campanha.passos.length} passo{campanha.passos.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Trophy size={13} />
              {campanha.premios.length} prêmio{campanha.premios.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <ScrollText size={13} />
              {campanha.regras.length} regra{campanha.regras.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Página Principal ──────────────────────────────────────────────────────────

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>(mockCampanhas)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingCampanha, setEditingCampanha] = useState<Campanha | null>(null)
  const [deletingCampanha, setDeletingCampanha] = useState<Campanha | null>(null)
  const nextId = useRef(mockCampanhas.length + 1)

  const handleNew = () => { setEditingCampanha(null); setView('form') }
  const handleEdit = (c: Campanha) => { setEditingCampanha(c); setView('form') }
  const handleBack = () => { setView('list'); setEditingCampanha(null) }

  const handleSave = (data: Omit<Campanha, 'id'>) => {
    if (editingCampanha) {
      setCampanhas((prev) => prev.map((c) => (c.id === editingCampanha.id ? { ...c, ...data } : c)))
    } else {
      setCampanhas((prev) => [...prev, { id: nextId.current++, ...data }])
    }
    handleBack()
  }

  const handleDeleteConfirm = () => {
    if (!deletingCampanha) return
    setCampanhas((prev) => prev.filter((c) => c.id !== deletingCampanha.id))
    setDeletingCampanha(null)
  }

  if (view === 'form') {
    return (
      <CampanhaForm
        campanha={editingCampanha}
        onBack={handleBack}
        onSave={handleSave}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Campanhas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie as campanhas e promoções exibidas no site
          </p>
        </div>
        <button
          onClick={handleNew}
          className="self-end sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Nova Campanha
        </button>
      </div>

      {campanhas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Megaphone size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">Nenhuma campanha cadastrada</p>
          <p className="text-sm text-gray-400">
            Clique em "Nova Campanha" para criar uma campanha ou promoção.
          </p>
          <button
            onClick={handleNew}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a8a9f] hover:bg-[#156e7f] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Nova Campanha
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {campanhas.map((c) => (
            <CampanhaCard
              key={c.id}
              campanha={c}
              onEdit={handleEdit}
              onDelete={setDeletingCampanha}
            />
          ))}
          <button
            onClick={handleNew}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-[#1a8a9f] hover:border-[#1a8a9f] hover:bg-[#1a8a9f]/5 transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Adicionar nova campanha
          </button>
        </div>
      )}

      {deletingCampanha && (
        <DeleteModal
          titulo={deletingCampanha.titulo}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCampanha(null)}
        />
      )}
    </div>
  )
}
