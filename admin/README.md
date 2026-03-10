# Frontend - Multiplic

Frontend SPA (Single Page Application) da plataforma institucional Multiplic, construído com React.js, TypeScript, Tailwind CSS e Vite.

## 🎯 Visão Geral

Esta aplicação é o cliente web responsável por exibir conteúdo gerenciado pelo backend API. Implementa:

- ✅ Interface responsiva e moderna
- ✅ Consumo de API RESTful
- ✅ Navegação intuitiva
- ✅ SEO otimizado
- ✅ Acessibilidade (WCAG)
- ✅ Performance otimizada

## 🏗️ Stack Tecnológico

- **React** 19.2.0 - Framework UI
- **TypeScript** 5.9 - Tipagem estática
- **Vite** 7.2 - Build tool
- **Tailwind CSS** 4.1 - Styling utility-first
- **React Router** 6.x - Navegação
- **Axios** - HTTP client
- **ESLint** - Linter

## 📁 Estrutura do Projeto

```
src/
├── pages/              # Páginas (rotas)
│   ├── HomePage.tsx
│   ├── AxesPage.tsx
│   ├── ProjectsPage.tsx
│   ├── PostsPage.tsx
│   ├── EventsPage.tsx
│   ├── TransparencyPage.tsx
│   ├── HackathonPage.tsx
│   └── ElevaPage.tsx
├── components/         # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── StateComponents.tsx
├── services/           # Serviços (API, etc)
│   └── api.ts          # Configuração Axios
├── hooks/              # Hooks customizados
│   └── useData.ts
├── types/              # TypeScript types
│   └── index.ts
├── assets/             # Imagens, SVG, etc
├── App.tsx             # Root component
├── App.css             # Estilos globais
├── index.css           # Tailwind imports
└── main.tsx            # Entry point
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clonar repositório
git clone <repo-url>
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env conforme necessário
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 📖 Documentação

- **[PAGES_MAP.md](./PAGES_MAP.md)** - Mapa de páginas e rotas
- **[COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)** - Guia de componentes
- **[API_CONSUMPTION.md](./API_CONSUMPTION.md)** - Como consumir a API
- **[SEO_GUIDE.md](./SEO_GUIDE.md)** - Práticas de SEO

## 🌐 Páginas Implementadas

| Rota | Página | Status |
|------|--------|--------|
| `/` | Home | ✅ |
| `/axes` | Eixos | ✅ |
| `/projects` | Projetos | ✅ |
| `/posts` | Notícias | ✅ |
| `/events` | Eventos | ✅ |
| `/transparency` | Transparência | ✅ |
| `/hackathon` | Hackathon | ✅ |
| `/eleva` | Eleva | ✅ |

## 🔌 Consumo de API

### Configuração

A URL da API é configurada em `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Exemplo de Uso

```tsx
import { useData } from '@/hooks/useData'
import { projectService } from '@/services/api'

function MyComponent() {
  const { data, loading, error } = useData(
    () => projectService.getAll(),
    []
  )

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return <div>{/* render data */}</div>
}
```

Ver [API_CONSUMPTION.md](./API_CONSUMPTION.md) para mais detalhes.

## 🎨 Styling

### Tailwind CSS

Utilitários Tailwind configurados para todas as páginas.

### Cores Principais

- **Primária**: `blue-600`
- **Sucesso**: `green-600`
- **Alerta**: `yellow-600`
- **Erro**: `red-600`

### Responsividade

Mobile-first approach com breakpoints:

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## ♿ Acessibilidade

- Semantic HTML
- ARIA labels e roles
- Keyboard navigation
- Color contrast adequado
- Alt text em imagens

## 📊 Performance

### Otimizações

- Code splitting com React Router
- Lazy loading de componentes (futuro)
- Tailwind CSS otimizado
- Imagens otimizadas (futuro)

### Core Web Vitals

Metas:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## 🔒 Segurança

- HTTPS em produção
- Sanitização de input
- CORS configurado
- Headers de segurança

## 📝 Commits e Branches

### Branches

- `main` - Produção
- `frontend` - Desenvolvimento

### Convenção de Commit

```
feat: adicionar nova página
fix: corrigir bug em componente
docs: atualizar README
style: ajustes de styling
refactor: reorganizar código
test: adicionar testes
```

## 🤝 Contribuição

1. Criar branch: `git checkout -b feature/minha-feature`
2. Commit: `git commit -am 'feat: descrição'`
3. Push: `git push origin feature/minha-feature`
4. PR: Abrir Pull Request

## 📚 Recursos

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Vite Docs](https://vite.dev)

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## 📄 Licença

MIT

---

**Última atualização**: Fevereiro 4, 2026
