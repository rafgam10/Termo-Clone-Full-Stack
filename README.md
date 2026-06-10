# Termo Clone Full-Stack

Clone completo do jogo **Termo** (versao brasileira do Wordle), desenvolvido como projeto de estudo de aplicacoes full-stack com Nuxt 4 e Flask.

## Sobre o Jogo

O jogador tem **6 tentativas** para adivinhar uma **palavra de 5 letras** em portugues. A cada tentativa, o jogo fornece feedback visual colorido:

- **Verde**: a letra esta na posicao correta.
- **Amarelo**: a letra existe na palavra, mas em outra posicao.
- **Cinza**: a letra nao existe na palavra.

## Stack Tecnologica

### Frontend

| Tecnologia | Versao |
|------------|--------|
| Nuxt 4 (Vue 3) | ^4.4.8 |
| Nuxt UI | ^4.8.2 |
| Tailwind CSS | ^4.3.0 |
| TypeScript | ^6.0.3 |
| ESLint | ^10.4.1 |
| pnpm | 11.5.2 |

### Backend

| Tecnologia | Versao |
|------------|--------|
| Python Flask | 3.1.3 |
| SQLAlchemy (Flask-SQLAlchemy) | 3.1.1 |
| SQLite | - |
| Alembic (Flask-Migrate) | 4.1.0 |
| Flask-CORS | 6.0.5 |
| pytest | 9.0.3 |
| gunicorn | 26.0.0 |

## Estrutura do Projeto

```
Termo-Clone-Full-Stack/
├── backend/
│   ├── src/
│   │   ├── __init__.py              # App factory (create_app)
│   │   ├── models/
│   │   │   └── word_model.py        # Modelo da tabela words
│   │   ├── routes/
│   │   │   ├── __init__.py          # Blueprint web (health check) + register_routes()
│   │   │   └── word_route.py        # Blueprint word (/word/start, /word/check)
│   │   ├── settings/
│   │   │   ├── config.py            # Configuracoes via .env
│   │   │   └── extensions.py        # Instancias de db, migrate, cors
│   │   ├── controllers/             # Escopo para futuros controllers
│   │   └── views/                   # Escopo para futuras views
│   ├── migrations/                  # Migracoes Alembic
│   │   └── versions/
│   ├── instance/
│   │   └── banco.db                 # Banco SQLite
│   ├── insert_words.sql             # Seed de 200+ palavras
│   ├── run.py                       # Ponto de entrada
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/
│   ├── app/
│   │   ├── app.vue                  # Layout raiz (UApp, UHeader, NuxtPage)
│   │   ├── app.config.ts            # Tema (primary=green)
│   │   ├── assets/css/main.css      # Tailwind + tema customizado
│   │   ├── composables/
│   │   │   ├── tentativas.ts        # Estado das tentativas (6x5)
│   │   │   └── teclado.ts           # Estado do teclado virtual
│   │   └── pages/
│   │       └── index.vue            # Pagina principal do jogo
│   ├── nuxt.config.ts
│   ├── package.json
│   └── eslint.config.mjs
└── README.md
```

## Arquitetura

```
                    FRONTEND (Nuxt 4)
                         |
                    $fetch para
                 localhost:5000
                         |
                    BACKEND (Flask)
                         |
                    SQLAlchemy ORM
                         |
                    SQLite (banco.db)
```

### Fluxo do Jogo

1. O jogador acessa a pagina inicial.
2. O frontend chama `GET /word/start` no `onMounted`.
3. O backend sorteia uma palavra aleatoria do banco e a armazena na sessao Flask (cookie assinado).
4. O jogador digita letras no teclado virtual ou teclado fisico.
5. Ao apertar "Enviar" com 5 letras, o frontend chama `POST /word/check` com a tentativa.
6. O backend executa o algoritmo de comparacao em 3 passos:
   - **Passo 1 (Verde)**: marca letras na posicao exata.
   - **Passo 2 (Amarelo)**: marca letras que existem em outra posicao.
   - **Passo 3 (Cinza)**: marca letras que nao existem.
7. O resultado e retornado como um array de `{letter, result}`.
8. O frontend atualiza o grid de tentativas e as cores do teclado.
9. Se o jogador acertar todas as letras ou esgotar as 6 tentativas, o jogo e encerrado.

### Gerenciamento de Estado

- A palavra-alvo e armazenada **no servidor** (sessao Flask), impedindo que o cliente a descubra.
- O estado das tentativas e gerenciado pelo composable `useTentativas`.
- As cores do teclado seguem uma prioridade: `success > warning > error > neutral`. Uma vez que uma tecla fica verde, ela nunca e rebaixada.

## API Endpoints

### `GET /word/start`

Inicia uma nova partida. Seleciona uma palavra aleatoria do banco e a armazena na sessao.

**Resposta:**
```json
{
  "msg": "start game."
}
```

### `POST /word/check`

Valida a tentativa do jogador.

**Request:**
```json
{
  "word": "casa"
}
```

**Resposta (exemplo):**
```json
{
  "won": false,
  "status": [
    { "letter": "c", "result": "success" },
    { "letter": "a", "result": "warning" },
    { "letter": "s", "result": "error" },
    { "letter": "a", "result": "error" }
  ]
}
```

- `result` pode ser: `"success"` (verde), `"warning"` (amarelo), `"error"` (cinza).
- `won` e `true` quando todas as letras estao verdes.

### `GET /`

Health check.

**Resposta:** HTML com `<h1>MVC funcionando</h1>`.

## Modelo de Dados

### Tabela `words`

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| `id` | INTEGER (PK) | Identificador unico, auto-incremento |
| `word` | VARCHAR(6) | Palavra de 5 letras em portugues |

O banco e populado com mais de 200 palavras em portugues atraves do arquivo `backend/insert_words.sql`. Exemplos: banco, barco, bravo, breve, bruxa, cargo, carro, claro, copia, cofre, cravo, ciclo, dados, danos, etc.

## Como Executar

### Pre-requisitos

- Python 3.13+
- Node.js 22+
- pnpm 11.5+

### Backend

```bash
cd backend

# Criar e ativar ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# ou .venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt

# Executar migracoes (cria as tabelas)
flask db upgrade

# Popular o banco com palavras (opcional se o banco ja existir)
sqlite3 instance/banco.db < insert_words.sql

# Iniciar o servidor
python run.py
```

O servidor sera iniciado em `http://localhost:5000`.

### Frontend

```bash
cd frontend

# Instalar dependencias
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor sera iniciado em `http://localhost:3000`.

### Producao

Para ambiente de producao, utilize `gunicorn` no backend:

```bash
cd backend
gunicorn --bind 0.0.0.0:5000 run:app
```

E no frontend:

```bash
cd frontend
pnpm build
pnpm preview
```

## Variaveis de Ambiente

O arquivo `backend/.env` contem as seguintes variaveis:

| Variavel | Descricao |
|----------|-----------|
| `SECRET_KEY` | Chave secreta do Flask (assinatura de sessoes) |
| `SQLALCHEMY_DATABASE_URI` | URI do banco de dados (ex: `sqlite:///banco.db`) |
| `FLASK_ENV` | Ambiente do Flask (`development`, `production`) |
| `FLASK_DEBUG` | Modo debug (`0` ou `1`) |

## CI/CD

O projeto utiliza **GitHub Actions** para integracao continua. A cada push, o pipeline executa:

1. Checkout do codigo
2. Instalacao do pnpm
3. Setup do Node.js 22
4. `pnpm install`
5. `pnpm run lint`
6. `pnpm run typecheck`

Configuracao em `frontend/.github/workflows/ci.yml`.

## Licenca

Distribuido sob a licenca MIT. Copyright (c) 2026 Rafael Timoteo Costa Oliveira.

## Autor

- **Rafael Timoteo Costa Oliveira**
- Projeto de estudo full-stack
