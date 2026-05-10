# 🎉 Cuidadora de Criança - Plataforma Completa

Um site profissional e moderno para conectar pais com cuidadores de crianças (babás) confiáveis. Sistema completo com autenticação, perfis, pesquisa avançada, mensagens e avaliações.

## 🚀 Recursos

✅ **Autenticação Segura**: Login/Registo com JWT  
✅ **Perfis Dinâmicos**: Pais e Cuidadores  
✅ **Pesquisa Avançada**: Filtros por cidade e preço  
✅ **Sistema de Mensagens**: Comunicação direta  
✅ **Avaliações e Comentários**: Confiança na comunidade  
✅ **Design Moderno**: Interface responsiva e profissional  
✅ **Banco de Dados**: MySQL para persistência

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **.NET 8 SDK** - [Download aqui](https://dotnet.microsoft.com/download)
2. **Node.js 18+** - [Download aqui](https://nodejs.org)
3. **MySQL 8.0+** - [Download aqui](https://www.mysql.com/downloads/)
4. **Git** - [Download aqui](https://git-scm.com/)

---

## 🔧 Configuração Inicial

### 1️⃣ Configurar Banco de Dados MySQL

Abra o MySQL e execute:

```sql
-- Criar base de dados
CREATE DATABASE CuidadoraDeCriancaDb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar utilizador (opcional, para melhor segurança)
CREATE USER 'cuidadora_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON CuidadoraDeCriancaDb.* TO 'cuidadora_user'@'localhost';
FLUSH PRIVILEGES;
```

**Ou use a conexão padrão:**

- Host: `localhost`
- User: `root`
- Password: `root`
- Database: `CuidadoraDeCriancaDb`

---

## 💻 Executar Backend (ASP.NET Core)

### 1. Navegar para a pasta backend

```bash
cd backend
```

### 2. Restaurar dependências

```bash
dotnet restore
```

### 3. Criar migração do banco de dados

```bash
dotnet ef migrations add InitialCreate
```

### 4. Aplicar migração ao banco de dados

```bash
dotnet ef database update
```

### 4. Executar o servidor

```bash
dotnet run
```

**O backend estará disponível em:** `http://localhost:5000`

📝 **Verificar se está funcionando:**

- Abra: `http://localhost:5000/swagger` para ver a documentação da API

---

## 🎨 Executar Frontend (React)

### 1. Navegar para a pasta frontend

```bash
cd frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar desenvolvimento

```bash
npm run dev
```

**O frontend estará disponível em:** `http://localhost:3000`

### Para produção

```bash
npm run build
npm run preview
```

---

## 🗄️ Estrutura do Projeto

```
Cuidadora-de-crianca/
├── backend/
│   ├── Models/              # Modelos de dados
│   ├── Controllers/         # Controllers da API
│   ├── Services/            # Lógica de negócio
│   ├── Data/               # DbContext e migrations
│   ├── DTOs/               # Data Transfer Objects
│   ├── Program.cs          # Configuração principal
│   └── appsettings.json    # Configurações
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Páginas (Home, Login, Search, etc)
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── api/           # Serviços de API
│   │   ├── App.jsx        # App principal
│   │   └── index.css      # Estilos globais
│   ├── package.json        # Dependências npm
│   ├── vite.config.js      # Configuração Vite
│   └── tailwind.config.js  # Configuração Tailwind
│
└── README.md
```

---

## 🔑 Credenciais Padrão para Teste

Após rodar as migrações, use:

**Para Pais:**

- Email: `pai@exemplo.com`
- Password: `senha123`

**Para Cuidadora:**

- Email: `cuidadora@exemplo.com`
- Password: `senha123`

_Ou crie suas próprias contas através do registo_

---

## 📡 API Endpoints Principais

### Autenticação

- `POST /api/auth/register` - Registar novo utilizador
- `POST /api/auth/login` - Fazer login

### Perfis

- `GET /api/profiles/search?city=Lisboa&maxPrice=20` - Pesquisar babás
- `GET /api/profiles/{id}` - Ver perfil específico
- `POST /api/profiles` - Criar perfil (autenticado)
- `PUT /api/profiles/{id}` - Editar perfil (autenticado)

### Mensagens

- `GET /api/messages/inbox` - Caixa de entrada
- `GET /api/messages/sent` - Mensagens enviadas
- `POST /api/messages/send` - Enviar mensagem
- `PUT /api/messages/{id}/read` - Marcar como lido

### Avaliações

- `GET /api/reviews/profile/{profileId}` - Avaliações de um perfil
- `POST /api/reviews` - Criar avaliação

---

## 🛠️ Troubleshooting

### Erro: "Cannot connect to database"

- ✅ Verifique se MySQL está a correr
- ✅ Verifique a string de conexão em `appsettings.json`
- ✅ Certifique-se que criou a base de dados

### Erro: "CORS blocked"

- ✅ Frontend e backend devem estar em portas diferentes
- ✅ Backend está configurado para aceitar `localhost:3000`

### Frontend não carrega da API

- ✅ Verifique se backend está a correr em `localhost:5000`
- ✅ Verifique se o proxy em `vite.config.js` está correto

### Porta 3000 ou 5000 já está em uso

- ✅ Altere a porta em `vite.config.js` para frontend
- ✅ Altere a porta em `Program.cs` para backend

---

## 🚀 Deploy

### Deploy Frontend (Vercel/Netlify)

```bash
npm run build
# Fazer upload da pasta 'dist'
```

### Deploy Backend (Azure/Heroku)

```bash
dotnet publish -c Release -o ./publish
# Fazer upload ou fazer push para a plataforma
```

---

## 📝 Funcionalidades Implementadas

### ✅ Fase 1 (Atual)

- [x] Sistema de autenticação completo
- [x] Modelos de dados estruturados
- [x] CRUD de perfis
- [x] Pesquisa de babás
- [x] Sistema de mensagens
- [x] Sistema de avaliações
- [x] Interface moderna com TailwindCSS
- [x] Responsive design

### 📋 Fase 2 (Próxima)

- [ ] Pagamento integrado (Stripe)
- [ ] Agendamento de serviços
- [ ] Notificações em tempo real (WebSocket)
- [ ] Upload de fotos
- [ ] Verificação de documentos
- [ ] Relatórios e analytics



## 🎓 Créditos

Desenvolvido como uma plataforma profissional e segura para conectar famílias com cuidadores de confiança.

**Tecnologias Utilizadas:**

- ASP.NET Core 8
- React 18
- MySQL 8
- TailwindCSS
- Vite
- JWT Authentication
