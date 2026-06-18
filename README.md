<h1 align="center">Observatório de Projetos Integradores — Senac Pernambuco</h1>

<p align="center">
  <a href="#portuguese">🇧🇷 Português</a> &nbsp;|&nbsp;
  <a href="#english">🇺🇸 English</a>
</p>

<p align="center">
  <a href="https://observatorio-projetos-integradores.vercel.app"><img src="https://img.shields.io/badge/demo-online-brightgreen" alt="Demo"/></a>
  <a href="https://github.com/LuizSanti/observatorio-projetos-integradores-senac"><img src="https://img.shields.io/badge/repo-GitHub-181717?logo=github" alt="GitHub"/></a>
  <a href="https://www.senac.br/"><img src="https://img.shields.io/badge/Institution-Senac%20Pernambuco-blue" alt="Senac"/></a>
  <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"><img src="https://img.shields.io/badge/Compliance-LGPD%20Ready-blueviolet" alt="LGPD"/></a>
</p>

---

<h2 id="portuguese">🇧🇷 Português</h2>

### 📌 Descrição

Plataforma web fullstack para gerenciamento e acompanhamento de Projetos Integradores do curso de Análise e Desenvolvimento de Sistemas (ADS) do Senac Recife. O sistema centraliza todo o ciclo de vida dos projetos — da submissão à avaliação — em um ecossistema único com controle de acesso por perfil.

### 🎯 Objetivo

Eliminar a dependência de ferramentas genéricas como e-mail e Microsoft Teams, unificando submissão, avaliação e acompanhamento dos PIs em uma plataforma com controle de acesso por perfil: **aluno**, **professor** e **coordenador (administrador)**.

---

### 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Python, Django, Django REST Framework, SimpleJWT |
| Banco de Dados | PostgreSQL (produção) / SQLite (desenvolvimento) |
| Notificações | E-mail via SMTP (Gmail) |
| Deploy | Render (backend) · Vercel (frontend) |

---

### 🔒 Conformidade com a LGPD (Lei Geral de Proteção de Dados)

Por processar dados pessoais de alunos, professores e coordenadores, a privacidade foi tratada como requisito central do sistema, em conformidade com a Lei Federal nº 13.709/2018 (LGPD).

#### Práticas implementadas

- **Base legal (Art. 7º):** Os dados coletados (nome, e-mail, turma, projetos) são utilizados exclusivamente para as finalidades acadêmicas do sistema, com acesso restrito por perfil de usuário.
- **Minimização de dados:** Cada perfil acessa apenas as informações necessárias para seu papel — alunos visualizam somente os próprios projetos; professores e coordenadores acessam os projetos de suas turmas.
- **Segurança (Art. 46):** Senhas armazenadas com hash seguro via Django; autenticação por token JWT; endpoints protegidos por `IsAuthenticated`.
- **Controle de acesso granular:** Permissões por perfil implementadas via Django REST Framework, impedindo acesso cruzado entre alunos de turmas diferentes.

---

### 📐 Regras de Negócio

- Projetos seguem o fluxo: `rascunho → submetido → em_avaliacao → aprovado / reprovado`
- A nota final é calculada automaticamente com base em quatro critérios ponderados: Apresentação (25%), Documentação (25%), Inovação (20%) e Técnica (30%)
- Um projeto é aprovado automaticamente quando a nota final é ≥ 7,0
- Cada projeto recebe apenas uma avaliação (relação OneToOne)
- Alunos só podem visualizar, editar e excluir os próprios projetos
- Professores e coordenadores têm acesso a todos os projetos do sistema
- Ao submeter um projeto, os professores cadastrados recebem notificação por e-mail
- Ao avaliar um projeto, o aluno autor recebe notificação por e-mail com o resultado

---

### 📊 Principais Endpoints da API

| Método | Endpoint | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/auth/login/` | Autenticação por token | Todos |
| GET · POST | `/api/projetos/` | Listar e criar projetos | Aluno / Professor |
| PATCH · DELETE | `/api/projetos/{id}/` | Editar ou excluir projeto | Aluno (próprio) |
| POST | `/api/avaliacoes/` | Registrar avaliação com nota | Professor |
| GET | `/api/projetos/{id}/avaliacao/` | Consultar nota e feedback | Aluno / Professor |
| GET | `/api/admin/relatorios/` | Relatórios institucionais | Coordenador |

> ⚠️ Todos os endpoints (exceto `/api/auth/login/`) requerem `Authorization: Token <token>` no header.

---

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

# Rode as migrações e inicie o servidor Django
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

#### Variáveis de Ambiente (`.env`)

```env
SECRET_KEY=sua_chave_secreta_django
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

### 🌐 Ambiente de Demonstração

| Recurso | URL |
|---|---|
| 🖥️ Sistema (Frontend) | https://observatorio-projetos-integradores.vercel.app |
| ⚙️ API (Backend) | https://observatorio-senac-api.onrender.com |
| 📁 Repositório | https://github.com/LuizSanti/observatorio-projetos-integradores-senac |
| 🎨 Protótipo (Figma) | https://www.figma.com/make/vGVc9jZHSzgIRlpgJuSHTF/Design-de-interface-para-Senac |
| 📊 Quadro Jira | https://larivcksoares.atlassian.net/jira/software/projects/PI211/boards/5 |
| 🎤 Apresentação | https://www.canva.com/design/DAHI7LEGOCs/MfeRA_ExhoCmNvrxr4klPw/edit |

**Credenciais de teste:**

| Perfil | Usuário | Senha |
|---|---|---|
| Aluno | aluno1 | Obs@2026#Senac! |
| Professor | prof1 | Obs@2026#Senac! |
| Administrador | admin | Obs@2026#Senac! |

> ⚠️ O login é feito por **usuário**, não por e-mail.

---

### 📝 Melhorias Planejadas (Próximas Versões)

- **Portfólio público:** Interface para empresas parceiras consultarem projetos aprovados e identificarem talentos
- **Versionamento de arquivos:** Histórico de versões por upload de PDF
- **Notificações em tempo real:** Integração com Django Channels (WebSocket)
- **Interface de cadastro:** Tela de criação de usuários no Frontend (atualmente via Django Admin)
- **Integração com videoconferência:** Suporte a apresentações online

---

### 👥 Equipe

| Nome | Função |
|---|---|
| Felipe Mitchell Campos | Fullstack Developer |
| Luiz Gabriel Santiago | Fullstack Developer & Tech Lead |
| Mariah Aparecida Navarro | Frontend Developer & UI/UX |
| Rejane Mendonça | Backend Developer |
| Vinícius Nascimento | Backend Developer & DBA |
| Victória Soares | Frontend Developer |

*Orientador(a): Prof. Guibson Barros*

---

<h2 id="english">🇺🇸 English</h2>

### 📌 Description

A fullstack web platform for managing and tracking Integrative Projects (*Projetos Integradores*) from the Systems Analysis and Development (ADS) program at Senac Recife. The system centralizes the full project lifecycle — from submission to evaluation — in a single platform with role-based access control.

### 🎯 Objective

Replace the dependency on generic tools like email and Microsoft Teams by unifying project submission, evaluation, and tracking in a dedicated platform with role-based access: **student**, **teacher**, and **coordinator (administrator)**.

---

### 🛠️ Technologies

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Python, Django, Django REST Framework, SimpleJWT |
| Database | PostgreSQL (production) / SQLite (development) |
| Notifications | Email via SMTP (Gmail) |
| Deploy | Render (backend) · Vercel (frontend) |

---

### 🔒 LGPD & Data Privacy Compliance (Lei Geral de Proteção de Dados)

Because this application processes personal data from students, teachers, and coordinators, privacy was treated as a core system requirement, in compliance with Brazilian Federal Law nº 13.709/2018 (LGPD).

#### Implemented Privacy Standards

- **Legal Basis (Art. 7º):** Collected data (name, email, class, projects) is used exclusively for the system's academic purposes, with access restricted by user role.
- **Data Minimization:** Each role accesses only the information required for their function — students see only their own projects; teachers and coordinators access their class's projects.
- **Security (Art. 46):** Passwords stored with secure hashing via Django; token-based JWT authentication; endpoints protected by `IsAuthenticated`.
- **Granular Access Control:** Role-based permissions via Django REST Framework, preventing cross-access between students from different classes.

---

### 📐 Business Rules

- Projects follow this status flow: `draft → submitted → under_review → approved / rejected`
- Final grade is automatically calculated from four weighted criteria: Presentation (25%), Documentation (25%), Innovation (20%), and Technical (30%)
- A project is automatically approved when the final grade is ≥ 7.0
- Each project can receive only one evaluation (OneToOne relationship)
- Students can only view, edit, and delete their own projects
- Teachers and administrators have access to all projects in the system
- When a project is submitted, registered teachers receive an email notification
- When a project is evaluated, the student author receives an email notification with the result

---

### 📊 Core API Endpoints

| Method | Endpoint | Description | Role |
|---|---|---|---|
| POST | `/api/auth/login/` | Token-based authentication | All |
| GET · POST | `/api/projetos/` | List and create projects | Student / Teacher |
| PATCH · DELETE | `/api/projetos/{id}/` | Edit or delete a project | Student (own) |
| POST | `/api/avaliacoes/` | Submit evaluation with grade | Teacher |
| GET | `/api/projetos/{id}/avaliacao/` | View grade and feedback | Student / Teacher |
| GET | `/api/admin/relatorios/` | Institutional reports | Coordinator |

> ⚠️ All endpoints (except `/api/auth/login/`) require `Authorization: Token <token>` in the header.

---

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

---

### 🌐 Demo Environment

| Resource | URL |
|---|---|
| 🖥️ System (Frontend) | https://observatorio-projetos-integradores.vercel.app |
| ⚙️ API (Backend) | https://observatorio-senac-api.onrender.com |
| 📁 Repository | https://github.com/LuizSanti/observatorio-projetos-integradores-senac |
| 🎨 Prototype (Figma) | https://www.figma.com/make/vGVc9jZHSzgIRlpgJuSHTF/Design-de-interface-para-Senac |
| 📊 Jira Board | https://larivcksoares.atlassian.net/jira/software/projects/PI211/boards/5 |
| 🎤 Presentation | https://www.canva.com/design/DAHI7LEGOCs/MfeRA_ExhoCmNvrxr4klPw/edit |

**Test credentials:**

| Role | Username | Password |
|---|---|---|
| Student | aluno1 | Obs@2026#Senac! |
| Teacher | prof1 | Obs@2026#Senac! |
| Administrator | admin | Obs@2026#Senac! |

> ⚠️ Login is done by **username**, not email.

---

### 📝 Future Improvements

- **Public portfolio:** Interface for partner companies to browse approved projects and identify talent
- **File versioning:** PDF upload history tracking
- **Real-time notifications:** Django Channels (WebSocket) integration
- **User registration UI:** Frontend screen for creating users (currently via Django Admin)
- **Video conferencing integration:** Support for online project presentations

---

### 👥 Team

| Name | Role |
|---|---|
| Felipe Mitchell Campos | Fullstack Developer |
| Luiz Gabriel Santiago | Fullstack Developer & Tech Lead |
| Mariah Aparecida Navarro | Frontend Developer & UI/UX |
| Rejane Mendonça | Backend Developer |
| Vinícius Nascimento | Backend Developer & DBA |
| Victória Soares | Frontend Developer |

*Academic Advisor: Prof. Guibson Barros*

---

<p align="center">Senac Fecomércio © 2026</p>
