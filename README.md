<h1 align="center">Observatório de Projetos — Senac</h1>

<p align="center">
  <a href="#portuguese">🇧🇷 Português</a> &nbsp;|&nbsp;
  <a href="#english">🇺🇸 English</a>
</p>

---

<h2 id="portuguese">🇧🇷 Português</h2>

### 📌 Descrição

Sistema web fullstack para gerenciamento e acompanhamento de projetos integradores do curso de Análise e Desenvolvimento de Sistemas (ADS) do Senac Recife.

### 🎯 Objetivo

Centralizar o ciclo de vida dos projetos integradores — da submissão à avaliação — em uma plataforma única com controle de acesso por perfil: aluno, professor e administrador (coordenador).

### 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Python, Django, Django REST Framework, SimpleJWT |
| Banco de Dados | PostgreSQL (produção) / SQLite (desenvolvimento) |
| Notificações | E-mail via SMTP (Gmail) |
| Deploy | Render (backend) e Vercel (frontend) |

### 📐 Regras de Negócio

- Cada projeto passa pelos status: `rascunho → submetido → em_avaliacao → aprovado / reprovado`
- A nota final é calculada automaticamente como a média das notas de Apresentação, Documentação, Inovação e Técnica
- Um projeto é aprovado automaticamente quando a nota final é igual ou superior a 7.0, e reprovado caso contrário
- Cada projeto pode receber apenas uma avaliação
- O aluno só pode visualizar, editar e excluir os próprios projetos
- Professores e administradores têm acesso a todos os projetos do sistema
- Ao submeter um projeto, os professores cadastrados recebem uma notificação por e-mail
- Ao avaliar um projeto, o aluno autor recebe uma notificação por e-mail com o resultado

### 🚀 Como Executar

**Pré-requisitos:** Python 3.13+, Node.js e pip instalados.

```bash
# Clone o repositório
git clone https://github.com/LuizSanti/observatorio-projetos-integradores-senac.git
cd observatorio-projetos-integradores-senac

# Crie e ative o ambiente virtual
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Linux/macOS

# Instale as dependências do backend
pip install -r requirements.txt

# Configure as variáveis de ambiente
# Copie o arquivo .env.example para .env e preencha os valores

# Rode as migrações e o servidor Django
python manage.py migrate
python manage.py runserver
```

Em outro terminal, rode o frontend:

```bash
npm install
npm run dev
```

- Backend: `http://127.0.0.1:8000`
- Frontend: `http://localhost:5173`

### 🌐 Ambiente de Demonstração

| Camada | URL |
|---|---|
| Frontend | https://observatorio-projetos-integradores.vercel.app |
| Backend (API) | https://observatorio-senac-api.onrender.com |

**Credenciais de teste:**

| Perfil | Usuário | Senha |
|---|---|---|
| Aluno | aluno1 | Obs@2026#Senac! |
| Professor | prof1 | Obs@2026#Senac! |
| Administrador | admin | Obs@2026#Senac! |

> ⚠️ O login é feito por **usuário**, não por e-mail.

### 👥 Equipe

| Nome |
|---|
| Felipe Mitchell Campos |
| Luiz Gabriel Santiago |
| Mariah Aparecida Navarro |
| Vinícius Nascimento |
| Victória Soares |

---

<h2 id="english">🇺🇸 English</h2>

### 📌 Description

A fullstack web system for managing and tracking integrative projects from the Systems Analysis and Development (ADS) program at Senac Recife.

### 🎯 Objective

Centralize the full lifecycle of integrative projects — from submission to evaluation — in a single platform with role-based access control: student, teacher, and administrator (coordinator).

### 🛠️ Technologies

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Python, Django, Django REST Framework, SimpleJWT |
| Database | PostgreSQL (production) / SQLite (development) |
| Notifications | Email via SMTP (Gmail) |
| Deploy | Render (backend) and Vercel (frontend) |

### 📐 Business Rules

- Projects follow this status flow: `draft → submitted → under_review → approved / rejected`
- Final grade is automatically calculated as the average of Presentation, Documentation, Innovation, and Technical scores
- A project is automatically approved when the final grade is 7.0 or higher, and rejected otherwise
- Each project can receive only one evaluation
- Students can only view, edit, and delete their own projects
- Teachers and administrators have access to all projects in the system
- When a project is submitted, registered teachers receive an email notification
- When a project is evaluated, the student author receives an email notification with the result

### 🚀 How to Run

**Prerequisites:** Python 3.13+, Node.js, and pip.

```bash
# Clone the repository
git clone https://github.com/LuizSanti/observatorio-projetos-integradores-senac.git
cd observatorio-projetos-integradores-senac

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Linux/macOS

# Install backend dependencies
pip install -r requirements.txt

# Set up environment variables
# Copy .env.example to .env and fill in the values

# Run migrations and start the Django server
python manage.py migrate
python manage.py runserver
```

In another terminal, run the frontend:

```bash
npm install
npm run dev
```

- Backend: `http://127.0.0.1:8000`
- Frontend: `http://localhost:5173`

### 🌐 Demo Environment

| Layer | URL |
|---|---|
| Frontend | https://observatorio-projetos-integradores.vercel.app |
| Backend (API) | https://observatorio-senac-api.onrender.com |

**Test credentials:**

| Role | Username | Password |
|---|---|---|
| Student | aluno1 | Obs@2026#Senac! |
| Teacher | prof1 | Obs@2026#Senac! |
| Administrator | admin | Obs@2026#Senac! |

> ⚠️ Login is done by **username**, not email.

### 👥 Team

| Name |
|---|
| Felipe Mitchell Campos |
| Luiz Gabriel Santiago |
| Mariah Aparecida Navarro |
| Vinícius Nascimento |
| Victória Soares |

---

<p align="center">Senac Fecomércio © 2026</p>
