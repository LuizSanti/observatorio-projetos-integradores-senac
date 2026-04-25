# Guia de Contribuição — Observatório de Projetos Integradores

Bem-vindo(a) ao repositório! Siga este guia antes de fazer qualquer alteração no projeto.

---

## Fluxo de Branches

```
main       → código estável, revisado e aprovado
develop    → integração das entregas da sprint
feature/*  → onde cada membro trabalha
```

### Regra principal

> **Nunca commite diretamente em `main` ou `develop`.**  
> Todo trabalho deve ser feito em uma branch `feature/` e entrar via Pull Request.

---

## Passo a Passo para Contribuir

### 1. Clone o repositório (somente na primeira vez)

```bash
git clone https://github.com/LuizSanti/observatorio-projetos-integradores-senac.git
cd observatorio-projetos-integradores-senac
```

### 2. Atualize o develop antes de começar

```bash
git checkout develop
git pull origin develop
```

### 3. Crie sua branch a partir do develop

```bash
git checkout -b feature/nome-da-sua-tarefa
```

**Exemplos de nomes:**
```
feature/modelagem-banco-dados
feature/autenticacao-login
feature/crud-projetos
feature/readme-documentacao
```

### 4. Faça suas alterações e commite

```bash
git add .
git commit -m "feat: descrição clara do que foi feito"
```

**Padrão de mensagens de commit:**

| Prefixo | Quando usar |
|---------|-------------|
| `feat:` | Nova funcionalidade ou entrega |
| `fix:` | Correção de erro |
| `docs:` | Alteração em documentação |
| `chore:` | Configuração, organização de arquivos |
| `refactor:` | Melhoria de código sem mudar comportamento |

### 5. Suba sua branch para o GitHub

```bash
git push -u origin feature/nome-da-sua-tarefa
```

### 6. Abra um Pull Request

- Acesse o repositório no GitHub
- Clique em **"Compare & pull request"**
- **Base branch:** `develop` ← **não `main`**
- Descreva o que foi feito
- Aguarde a revisão do Tech Lead

---

## Organização de Arquivos

```
docs/              → diagramas, modelagem, documentação
apps/              → código das funcionalidades (Django)
templates/         → arquivos HTML
static/            → CSS, JS, imagens do sistema
```

### O que cada responsável entrega

| Responsável | Onde sobe | O quê |
|-------------|-----------|-------|
| Tech Lead | `apps/`, `core/` | Código Python/Django |
| BD | `docs/` | Diagramas ER, dicionário de dados |
| Frontend | `templates/`, `static/` | HTML, CSS |

---

## O que NÃO deve ser commitado

```
venv/              → ambiente virtual Python
.env               → variáveis de ambiente e senhas
__pycache__/       → arquivos gerados automaticamente
*.pyc              → bytecode Python
db.sqlite3         → banco de dados local
```

Esses itens já estão no `.gitignore`. Não os remova.

---

## Dúvidas

Fale com Luiz Gabriel antes de abrir PR em caso de dúvida sobre onde colocar um arquivo ou como nomear uma branch.