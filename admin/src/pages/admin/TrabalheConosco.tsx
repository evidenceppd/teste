import { useState } from 'react'
import { Briefcase, Download, Trash2, Search, Calendar, Mail, Phone, FileText, Eye } from 'lucide-react'

interface Curriculo {
  id: number
  nome: string
  email: string
  telefone: string
  cargo: string
  mensagem?: string
  curriculo: string
  dataEnvio: string
}

export default function TrabalheConosco() {
  const [curriculos, setCurriculos] = useState<Curriculo[]>([
    {
      id: 1,
      nome: 'Ana Paula Santos',
      email: 'ana.santos@email.com',
      telefone: '(11) 98765-4321',
      cargo: 'Gerente de Loja',
      mensagem: 'Tenho 5 anos de experiência em gestão de varejo e gostaria de fazer parte da equipe.',
      curriculo: 'ana_santos_cv.pdf',
      dataEnvio: '2024-03-10 10:30'
    },
    {
      id: 2,
      nome: 'Carlos Eduardo Silva',
      email: 'carlos.silva@email.com',
      telefone: '(11) 97654-3210',
      cargo: 'Repositor',
      mensagem: 'Disponibilidade imediata para início.',
      curriculo: 'carlos_silva_cv.pdf',
      dataEnvio: '2024-03-09 15:45'
    },
    {
      id: 3,
      nome: 'Juliana Oliveira',
      email: 'juliana.oliveira@email.com',
      telefone: '(11) 96543-2109',
      cargo: 'Caixa',
      curriculo: 'juliana_oliveira_cv.pdf',
      dataEnvio: '2024-03-08 09:20'
    },
    {
      id: 4,
      nome: 'Roberto Almeida',
      email: 'roberto.almeida@email.com',
      telefone: '(11) 95432-1098',
      cargo: 'Açougueiro',
      mensagem: 'Experiência de 10 anos na área de açougue.',
      curriculo: 'roberto_almeida_cv.pdf',
      dataEnvio: '2024-03-07 14:10'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [curriculoSelecionado, setCurriculoSelecionado] = useState<Curriculo | null>(null)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)
  const [curriculoParaDeletar, setCurriculoParaDeletar] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    setCurriculoParaDeletar(id)
    setModalConfirmacaoAberto(true)
  }

  const confirmarDelecao = () => {
    if (curriculoParaDeletar !== null) {
      setCurriculos(curriculos.filter(c => c.id !== curriculoParaDeletar))
      setCurriculoParaDeletar(null)
      setModalDetalhesAberto(false)
    }
    setModalConfirmacaoAberto(false)
  }

  const handleDownloadCurriculo = (curriculo: Curriculo) => {
    alert(`Download do currículo: ${curriculo.curriculo}`)
  }

  const handleVerDetalhes = (curriculo: Curriculo) => {
    setCurriculoSelecionado(curriculo)
    setModalDetalhesAberto(true)
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Cargo', 'Mensagem', 'Data de Envio'],
      ...curriculosFiltrados.map(c => [
        c.nome,
        c.email,
        c.telefone,
        c.cargo,
        c.mensagem || '',
        c.dataEnvio
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `curriculos_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const curriculosFiltrados = curriculos.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <Briefcase className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Trabalhe Conosco</h1>
            <p className="text-gray-600">Gerencie os currículos recebidos</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Currículos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{curriculos.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Briefcase className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Novos Hoje</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {curriculos.filter(c => c.dataEnvio.startsWith('2024-03-10')).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Esta Semana</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {curriculos.filter(c => {
                  const date = new Date(c.dataEnvio)
                  const today = new Date()
                  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                  return date >= weekAgo
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, email ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download size={20} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Curriculos Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Candidato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Data de Envio
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {curriculosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Nenhum currículo encontrado com este filtro' : 'Nenhum currículo recebido ainda'}
                  </td>
                </tr>
              ) : (
                curriculosFiltrados.map((curriculo) => (
                  <tr key={curriculo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">
                          {curriculo.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 text-gray-800 font-medium">{curriculo.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {curriculo.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          {curriculo.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {curriculo.cargo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(curriculo.dataEnvio).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerDetalhes(curriculo)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadCurriculo(curriculo)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                          title="Baixar currículo"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(curriculo.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Mostrando {curriculosFiltrados.length} de {curriculos.length} currículos
      </div>

      {/* Modal Detalhes */}
      {modalDetalhesAberto && curriculoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-orange-500 text-white p-6 rounded-t-xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {curriculoSelecionado.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{curriculoSelecionado.nome}</h2>
                    <p className="text-orange-100">Candidato(a) para {curriculoSelecionado.cargo}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalDetalhesAberto(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
              {/* Informações de Contato */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Mail size={20} className="text-orange-500" />
                  Informações de Contato
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">E-mail</p>
                      <p className="text-gray-800 font-medium">{curriculoSelecionado.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-gray-800 font-medium">{curriculoSelecionado.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Data de Envio</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(curriculoSelecionado.dataEnvio).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo de Interesse */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Briefcase size={20} className="text-orange-500" />
                  Cargo de Interesse
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 font-medium text-lg">{curriculoSelecionado.cargo}</p>
                </div>
              </div>

              {/* Mensagem */}
              {curriculoSelecionado.mensagem && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText size={20} className="text-orange-500" />
                    Mensagem
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{curriculoSelecionado.mensagem}</p>
                  </div>
                </div>
              )}

              {/* Currículo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Download size={20} className="text-orange-500" />
                  Currículo
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{curriculoSelecionado.curriculo}</p>
                      <p className="text-xs text-gray-500">Documento PDF/DOC</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadCurriculo(curriculoSelecionado)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    <Download size={18} />
                    Baixar
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setModalDetalhesAberto(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setModalDetalhesAberto(false)
                  handleDelete(curriculoSelecionado.id)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Remover Currículo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmação de Exclusão */}
      {modalConfirmacaoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="text-red-600" size={32} />
              </div>
              <p className="text-lg font-semibold text-gray-800 text-center">
                Deseja realmente remover este currículo?
              </p>
            </div>
            <div className="border-t border-gray-200 p-4 flex gap-3 justify-center">
              <button
                onClick={confirmarDelecao}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer font-medium"
              >
                Ok
              </button>
              <button
                onClick={() => {
                  setModalConfirmacaoAberto(false)
                  setCurriculoParaDeletar(null)
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
