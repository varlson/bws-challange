# 🌐 Biwise App

## 📝 Resumo

**O projeto Biwise_App** é uma aplicação **full-stack** composta por:

- **Frontend:** React + Vite (TypeScript)
- **Backend:** Django + Django REST Framework (DRF)

O frontend (pasta `client/`) consome APIs protegidas com **CSRF** e **cookies HTTP-Only**, utilizando um **AuthProvider** centralizado para gerenciar o estado de autenticação (busca inicial de CSRF e do usuário autenticado via endpoint `/me/`).

---

## 🚀 Demonstração

🔗 _[Link do vídeo de demonstração — [https://youtu.be/t1wSfQn9eqw](https://youtu.be/t1wSfQn9eqw)]_

---

## 🧰 Principais Tecnologias

### 🖥️ Frontend

- **React** (TypeScript) + **Vite**
- **React Router** - Roteamento SPA
- **Axios** - Cliente HTTP configurado com `withCredentials` + CSRF
- **Estrutura Modular:**
  - `context/` → AuthProvider, ThemeProvider
  - `hooks/` → useAuth, useTheme, useLogin
  - `services/` → Auth, Users, Company
  - `pages/` → Login, Register, Dashboard, etc.

### ⚙️ Backend

- **Django 4+** + **Django REST Framework**
- **Autenticação JWT** + Refresh Token (HTTP-Only Cookie)
- **Proteção CSRF** para endpoints sensíveis
- **Sistema 2FA** (duplo fator) e **verificação por e-mail**
- **CORS** configurado para desenvolvimento e produção

### 🔧 Ferramentas de Desenvolvimento

- Node.js / npm / pnpm / yarn
- Python 3.x / virtualenv / pip
- SQLite (padrão) ou PostgreSQL (opcional)

---

## 📦 Estrutura do Projeto

```
biwise-app
├── .gitignore
├── client
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── AuthNix.png
│   │   ├── crateAccount.jpg
│   │   ├── login.jpg
│   │   ├── login2.jpg
│   │   └── vite.svg
│   ├── src
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── layout
│   │   │   │   └── navbar
│   │   │   │       └── index.tsx
│   │   │   ├── theme
│   │   │   │   └── palette.ts
│   │   │   └── ui
│   │   │       ├── avatar.tsx
│   │   │       ├── errorHandler.tsx
│   │   │       ├── loader.tsx
│   │   │       ├── loginCodeConfirmation.tsx
│   │   │       ├── logo.tsx
│   │   │       ├── modal.tsx
│   │   │       ├── sideMenus.tsx
│   │   │       └── themeSwitvher.tsx
│   │   ├── config
│   │   │   └── axios
│   │   │       ├── config.ts
│   │   │       └── request.ts
│   │   ├── constants
│   │   │   └── data.ts
│   │   ├── context
│   │   │   ├── AppContexts.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── helpers
│   │   ├── hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useHooks.ts
│   │   │   ├── useLogin.ts
│   │   │   └── useTheme.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── account
│   │   │   │   └── index.tsx
│   │   │   ├── accountConfirmation
│   │   │   │   └── index.tsx
│   │   │   ├── blog
│   │   │   │   └── index.tsx
│   │   │   ├── dashboard
│   │   │   │   ├── helper.ts
│   │   │   │   └── index.tsx
│   │   │   ├── index.tsx
│   │   │   ├── login
│   │   │   │   └── index.tsx
│   │   │   ├── notFound
│   │   │   │   └── index.tsx
│   │   │   ├── password-recovery
│   │   │   │   ├── index.tsx
│   │   │   │   └── reset-password.tsx
│   │   │   ├── register
│   │   │   │   └── index.tsx
│   │   │   └── users
│   │   │       ├── helper.ts
│   │   │       └── index.tsx
│   │   ├── router
│   │   │   ├── index.tsx
│   │   │   ├── privateRoutes.tsx
│   │   │   └── publicRoutes.tsx
│   │   ├── services
│   │   │   ├── auth
│   │   │   │   ├── login.ts
│   │   │   │   └── logout.ts
│   │   │   ├── company
│   │   │   │   ├── company.model.ts
│   │   │   │   └── company.services.ts
│   │   │   └── users
│   │   │       ├── users.models.ts
│   │   │       └── users.services.ts
│   │   └── types
│   │       └── types.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── readme.md
└── server
    ├── authenixApp
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── permissions.py
    │   ├── serializers.py
    │   ├── tests.py
    │   ├── utils
    │   │   ├── __pycache__
    │   │   │   └── utils.cpython-312.pyc
    │   │   └── utils.py
    │   └── views.py
    ├── db.sqlite3
    ├── manage.py
    ├── requirements.txt
    └── setup
        ├── asgi.py
        ├── settings.py
        ├── urls.py
        └── wsgi.py

```

---

## 🔧 Configuração do Ambiente

### 📋 Pré-requisitos

- **Python** 3.9+
- **Node.js** 18+
- **Git**

### 🐍 Backend Setup

1. **Clone o repositório**

```bash
git clone git@github.com:varlson/bws-challange.git
cd bws-challange
```

2. **Crie e ative o ambiente virtual**

```bash
cd server
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Instale as dependências**

```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente**

Fiz questão de manter alguns arquivos que, em um cenário real, por questões de segurança, seriam substituídos por um arquivo de exemplo, como um env_example.

````

5. **Execute as migrações**

```bash
python manage.py makemigrations
python manage.py migrate
````

6. **Crie um superusuário**

```bash
python manage.py createsuperuser
```

7. **Inicie o servidor**

```bash
python manage.py runserver
```

O backend estará rodando em `http://localhost:8000`

---

### ⚛️ Frontend Setup

1. **Navegue até a pasta do cliente**

```bash
cd client
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O frontend estará rodando em `http://localhost:5173`

---

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação

1. **Login**

   - Usuário envia credenciais para `api/login/`
   - Backend valida e retorna:
     - `access_token` (JSON response)
     - `refresh_token` (HTTP-Only Cookie)
     - CSRF token (Cookie)

2. **Requisições Autenticadas**

   - Frontend inclui `Authorization: Bearer <access_token>`
   - CSRF token é enviado automaticamente via cookie
   - Refresh token permanece seguro no cookie HTTP-Only

3. **Refresh Token**

   - Quando access token expira, frontend chama `token/refresh/`
   - Backend valida refresh token do cookie
   - Retorna novo access token

4. **Logout**
   - Frontend chama `api/logout/`
   - Backend invalida tokens e limpa cookies

## 👥 Autores

- **Suleimane Ducure** - [@varlson](https://github.com/varlson)
