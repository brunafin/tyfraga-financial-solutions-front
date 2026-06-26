# Turcoin

Aplicativo web (PWA) para gestão de empréstimos pessoais. Permite cadastrar clientes, simular empréstimos com juros, registrar operações, acompanhar parcelas e visualizar indicadores financeiros.

Consome a API FastAPI do repositório [`tyfraga_fastapi`](../../back/tyfraga_fastapi).

## Stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) 7
- [Tailwind CSS](https://tailwindcss.com/) 4
- [React Router](https://reactrouter.com/) 7
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (app instalável)

## Pré-requisitos

- Node.js 20+ (recomendado)
- npm
- API backend rodando (ver [README do backend](../../back/tyfraga_fastapi/README.md) a partir da pasta `tyfraga/`)

## Configuração

```bash
cd tyfraga_vite
npm install
```

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8000
```

## Executando

```bash
# Desenvolvimento (porta 5173 por padrão)
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

Com a API e o front rodando, acesse `http://localhost:5173`.

## Telas

| Rota | Tela | Descrição |
|------|------|-----------|
| `/` | Dashboard | Resumo financeiro, últimos eventos e próximos vencimentos |
| `/simulator` | Simulador | Simula e cria novos empréstimos |
| `/customers` | Clientes | Lista de clientes |
| `/customers/create` | Novo cliente | Cadastro de cliente |
| `/customers/:id` | Detalhe do cliente | Métricas, empréstimos e edição |
| `/loans/:id` | Detalhe do empréstimo | Parcelas, pagamento e exclusão |
| `/timeline` | Timeline | Histórico completo de operações |
| `/config` | Configurações | Em desenvolvimento |
| `/payments` | Pagamentos | Em desenvolvimento |

## Fluxo principal

```
1. Cadastrar cliente          →  /customers/create
2. Simular empréstimo         →  /simulator
3. Definir parcelas e taxa    →  calcular no front
4. Confirmar empréstimo       →  POST /loans
5. Acompanhar no dashboard    →  /
6. Registrar pagamento        →  /loans/:id → marcar parcela paga
```

## Simulador de empréstimos

O coração do sistema está em `src/pages/Simulator` e nos utilitários de cálculo.

### Modos de simulação

| Modo | Entrada | Saída |
|------|---------|-------|
| **Taxa** | Valor, taxa mensal (%) e datas das parcelas | Valor de cada parcela, total com juros |
| **Parcela definida** | Valor, valor fixo da parcela e datas | Taxa mensal equivalente |

### Fórmula de juros

A taxa mensal é convertida em taxa diária (mês de 30 dias):

```
taxa_diaria = (1 + taxa_mensal) ^ (1/30) - 1
```

O valor da parcela é calculado descontando cada vencimento pelo número de dias desde a data do empréstimo (`src/utils/calculateBase.ts`).

### Valores monetários

Os inputs de moeda trabalham em **centavos** no formulário. Na hora de enviar para a API:

- `original_value` → valor emprestado em reais
- `loan_value` → total com juros em reais (`totalWithInterest * 100` convertido)
- `installment_value` → valor da parcela em reais

Na exibição, use `formatCentsToRealBRL` quando os valores vierem em centavos da API.

## Serviços (API)

| Arquivo | Endpoints consumidos |
|---------|---------------------|
| `src/services/customer.ts` | `/customers` |
| `src/services/loan.ts` | `/loans`, `/payments/{id}/pay` |
| `src/services/dashboard.ts` | `/dashboard`, `/timeline`, `/next-payments` |

A instância Axios está em `src/services/api.ts` e usa `VITE_API_URL` de `src/config/env.ts`.

## PWA

O app pode ser instalado no celular como aplicativo nativo. A configuração está em `vite.config.ts` (`vite-plugin-pwa`).

- Nome: **Turcoin**
- Modo: `standalone`
- Service worker com cache de assets e fallback para `index.html`

## Estrutura do projeto

```
src/
├── components/       # Header, Nav, UI reutilizável
├── config/
│   └── env.ts        # Variáveis de ambiente
├── contexts/         # Loader global
├── pages/
│   ├── Dashboard/
│   ├── Simulator/    # Simulador de empréstimos
│   ├── Customers/
│   ├── Loan/
│   └── Timeline/
├── services/         # Chamadas à API
└── utils/            # Cálculos financeiros e formatação
```

## Desenvolvimento local completo

Terminal 1 — API:

```bash
cd back/tyfraga_fastapi
poetry install
poetry run alembic upgrade head
poetry run task run
```

Terminal 2 — Frontend:

```bash
cd front/tyfraga_vite
npm install
npm run dev
```

> Os comandos acima assumem que você está na pasta raiz `tyfraga/`, onde ficam `back/` e `front/`.

Certifique-se de que `VITE_API_URL` aponta para a URL da API (`http://localhost:8000`).

## Backend

Documentação completa da API, migrations e regras de negócio: [tyfraga_fastapi/README.md](../../back/tyfraga_fastapi/README.md)
