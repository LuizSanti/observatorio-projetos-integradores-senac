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

Centralizar o ciclo de vida dos projetos integradores — da submissão à avaliação — em uma plataforma única com controle de acesso por perfil: aluno, professor, coordenador e empresa.

### 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript, REACT e Typescript |
| Backend | Python, Django |
| Banco de Dados | PostgreSQL |

### 📐 Regras de Negócio

- Cada projeto passa pelos status: `RASCUNHO → SUBMETIDO → EM_AVALIACAO → AVALIADO → APROVADO / REPROVADO`
- A nota final é calculada automaticamente: Apresentação (25%) + Documentação (25%) + Inovação (20%) + Técnica (30%)
- Um projeto só aparece no portfólio público se estiver com status `APROVADO` ou `AVALIADO`
- Cada professor pode avaliar um projeto apenas uma vez
- O upload de um novo arquivo incrementa automaticamente a versão do projeto

### 🚀 Como Executar

**Pré-requisitos:** Python 3.10+ e pip instalados.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/observatorio-projetos.git
cd observatorio-projetos/backend

# Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows

# Instale as dependências e rode o servidor
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Acesse em `http://127.0.0.1:8000`. Para o frontend, abra `frontend/index.html` no navegador.

**Credenciais de teste:**

| Perfil | E-mail | Senha |
|---|---|---|
| Aluno | aluno@senac.br | aluno123 |
| Professor | professor@senac.br | prof123 |
| Coordenador | admin@senac.br | admin123 |

### 📄 Documentação

> _(adicione aqui o link para a documentação completa)_

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

Centralize the full lifecycle of integrative projects — from submission to evaluation — in a single platform with role-based access control: student, teacher, coordinator, and company.

### 🛠️ Technologies

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript, Chart.js 4.4 |
| Backend | Python 3, Django |
| Database | SQLite |

### 📐 Business Rules

- Projects follow this status flow: `DRAFT → SUBMITTED → UNDER_REVIEW → EVALUATED → APPROVED / REJECTED`
- Final grade is auto-calculated: Presentation (25%) + Documentation (25%) + Innovation (20%) + Technical (30%)
- Projects only appear in the public portfolio if status is `APPROVED` or `EVALUATED`
- Each teacher may evaluate a given project only once
- Uploading a new file automatically increments the project version

### 🚀 How to Run

**Prerequisites:** Python 3.10+ and pip.

```bash
# Clone the repository
git clone https://github.com/seu-usuario/observatorio-projetos.git
cd observatorio-projetos/backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows

# Install dependencies and start the server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Access at `http://127.0.0.1:8000`. For the frontend, open `frontend/index.html` in your browser.

**Test credentials:**

| Role | E-mail | Password |
|---|---|---|
| Student | aluno@senac.br | aluno123 |
| Teacher | professor@senac.br | prof123 |
| Coordinator | admin@senac.br | admin123 |

### 📄 Documentation

> _(add the link to the full documentation here)_

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
