# 🔭 Observatório de Projetos Integradores

> Sistema web centralizado para submissão, avaliação e consulta dos Projetos Integradores do SENAC.

-----
##PORTUGUÊS 

## 📋 Descrição do Sistema

O **Observatório de Projetos Integradores** é uma plataforma web desenvolvida para centralizar e organizar os Projetos Integradores (PIs) dos cursos de tecnologia da Faculdade SENAC. O sistema resolve o problema da descentralização no envio e armazenamento dos projetos, que anteriormente eram enviados por e-mail ou Teams, gerando dificuldades de controle de versões, organização por turma/turno e perda de informações.

A plataforma permite:

- 📤 Submissão centralizada dos projetos pelos alunos
- 📝 Avaliação dos projetos pelos professores dentro da plataforma
- 👁️ Visualização dos projetos pela coordenação
- 💼 Criação de portfólio profissional para os alunos
- 🔍 Consulta de projetos por empresas parceiras

-----

## 🎯 Objetivo

Unificar a avaliação e consulta dos Projetos Integradores em um único sistema e criar uma **Vitrine Digital** para facilitar a busca por projetos inovadores e novos talentos.

-----

## 👥 Partes Interessadas (Stakeholders)

|Perfil                |Funcionalidades                                          |
|----------------------|---------------------------------------------------------|
|**Alunos**            |Submissão de projetos e criação de portfólio profissional|
|**Professores**       |Avaliação de projetos e registro de avaliador            |
|**Coordenadores/Adm** |Visão estratégica do curso e geração de relatórios       |
|**Empresas Parceiras**|Identificação e recrutamento de novos talentos           |

-----

## 🛠️ Tecnologias Utilizadas

- **Python** — Linguagem principal de desenvolvimento
- **Django** — Framework web back-end (com conector para MongoDB)
- **SQLite** — Banco de dados relacional (desenvolvimento/local)
- **MongoDB** — Banco de dados NoSQL (via conector Django)
- **HTML5 / CSS3** — Estrutura e estilização do front-end
- **Git / GitHub** — Controle de versão e hospedagem do repositório
- **Jira** — Gerenciamento de tarefas e organização do projeto

-----

## 📐 Regras de Negócio

- Somente alunos autenticados podem submeter projetos
- Cada projeto deve estar vinculado a uma turma e turno
- Professores só avaliam projetos das turmas às quais estão atribuídos
- O coordenador tem acesso completo a todos os projetos e relatórios
- Empresas parceiras têm acesso somente leitura aos projetos publicados como portfólio
- Um projeto só é visível na Vitrine Digital após aprovação pela coordenação

-----

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Python 3.10+](https://www.python.org/downloads/)
- [Git](https://git-scm.com/)
- [pip](https://pip.pypa.io/en/stable/) (geralmente já incluso com o Python)

-----

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/observatorio-projetos-integradores.git
cd observatorio-projetos-integradores
```

-----

### 2. Criar e ativar o ambiente virtual

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

-----

### 3. Instalar as dependências

```bash
pip install -r requirements.txt
```

> As principais dependências incluem Django, o conector Django-MongoDB e outras bibliotecas listadas no `requirements.txt`.

-----

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações locais (chave secreta, configurações do banco, etc.).

-----

### 5. Aplicar as migrações do banco de dados

```bash
python manage.py makemigrations
python manage.py migrate
```

-----

### 6. Criar um superusuário (administrador)

```bash
python manage.py createsuperuser
```

Siga as instruções no terminal para definir usuário, e-mail e senha.

-----

### 7. Rodar o servidor de desenvolvimento

```bash
python manage.py runserver
```

Acesse o sistema em: <http://127.0.0.1:8000>

Painel administrativo: <http://127.0.0.1:8000/admin>

-----

## 📁 Estrutura do Projeto

```
observatorio-projetos-integradores/
│
├── core/                  # App principal do sistema
├── usuarios/              # Gerenciamento de usuários e perfis
├── projetos/              # Submissão e avaliação de projetos
├── templates/             # Templates HTML
├── static/                # Arquivos estáticos (CSS, JS, imagens)
├── manage.py
├── requirements.txt
├── .env.example
└── README.md
```

-----

## 📚 Documentação

A documentação completa do projeto está disponível em: 

-----

## 🏫 Instituição

Desenvolvido por alunos do curso de Análise e Desenvolvivmento de Sistemas da **Faculdade SENAC**, como parte do Projeto Integrador interdisciplinar.

-----

## 📄 Licença

Este projeto é de uso acadêmico e está sob os termos definidos pela instituição SENAC.

##ENGLISH

# 🔭 Integrative Projects Observatory

> A centralized web system for submission, evaluation, and consultation of Integrative Projects at SENAC.

-----

## 📋 System Description

The **Integrative Projects Observatory** is a web platform developed to centralize and organize the Integrative Projects (IPs) of SENAC’s technical courses. The system solves the problem of decentralization in project submission and storage, which were previously sent via e-mail or Teams, causing difficulties with version control, class/shift organization, and loss of information.

The platform allows:

- 📤 Centralized project submission by students
- 📝 Project evaluation by teachers within the platform
- 👁️ Project visualization by coordinators
- 💼 Professional portfolio creation for students
- 🔍 Project browsing by partner companies

-----

## 🎯 Objective

To unify the evaluation and consultation of Integrative Projects into a single system and create a **Digital Showcase** to make it easier to discover innovative projects and new talents.

-----

## 👥 Stakeholders

|Profile               |Features                                              |
|----------------------|------------------------------------------------------|
|**Students**          |Project submission and professional portfolio creation|
|**Teachers**          |Project evaluation and evaluator record               |
|**Coordinators/Admin**|Strategic overview of the course and report generation|
|**Partner Companies** |Identification and recruitment of new talents         |

-----

## 🛠️ Technologies Used

- **Python** — Main development language
- **Django** — Back-end web framework (with MongoDB connector)
- **SQLite** — Relational database (development/local)
- **MongoDB** — NoSQL database (via Django connector)
- **HTML5 / CSS3** — Front-end structure and styling
- **Git / GitHub** — Version control and repository hosting
- **Trello** — Task management and project organization

> ⚠️ Technologies may be adjusted, replaced, or expanded throughout the project, according to needs identified by the team or technical factors that justify the adoption of new tools or complementary technologies.

-----

## 📐 Business Rules

- Only authenticated students can submit projects
- Each project must be linked to a class and shift
- Teachers can only evaluate projects from their assigned classes
- The coordinator has full access to all projects and reports
- Partner companies have read-only access to projects published as portfolio
- A project is only visible in the Digital Showcase after approval by the coordinator

-----

## 🚀 How to Run the Project

### Prerequisites

Make sure you have the following installed on your machine:

- [Python 3.10+](https://www.python.org/downloads/)
- [Git](https://git-scm.com/)
- [pip](https://pip.pypa.io/en/stable/) (usually bundled with Python)

-----

### 1. Clone the repository

```bash
git clone https://github.com/your-username/integrative-projects-observatory.git
cd integrative-projects-observatory
```

-----

### 2. Create and activate a virtual environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

-----

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> Main dependencies include Django, the Django-MongoDB connector, and other libraries listed in `requirements.txt`.

-----

### 4. Set up environment variables

Create a `.env` file at the root of the project based on the example file:

```bash
cp .env.example .env
```

Edit the `.env` file with your local settings (secret key, database configuration, etc.).

-----

### 5. Apply database migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

-----

### 6. Create a superuser (admin)

```bash
python manage.py createsuperuser
```

Follow the terminal instructions to set your username, e-mail, and password.

-----

### 7. Run the development server

```bash
python manage.py runserver
```

Access the system at: <http://127.0.0.1:8000>

Admin panel: <http://127.0.0.1:8000/admin>

-----

## 📁 Project Structure

```
integrative-projects-observatory/
│
├── core/                  # Main application
├── users/                 # User and profile management
├── projects/              # Project submission and evaluation
├── templates/             # HTML templates
├── static/                # Static files (CSS, JS, images)
├── manage.py
├── requirements.txt
├── .env.example
└── README.md
```

-----

## 📚 Documentation

Full project documentation is available at: *(link to be added)*

-----

## 🏫 Institution

Developed by students of the technical course at **SENAC — Fecomércio Sesc**, as part of the interdisciplinary Integrative Project.

-----

## 📄 License

This project is for academic use and is subject to the terms defined by the SENAC institution.

## Nosso Time / Our Team

Felipe Mitchell Campos

Luiz Gabriel Santiago

Mariah Aparecida Navarro

Vinícius Nascimento

Victória Soares
