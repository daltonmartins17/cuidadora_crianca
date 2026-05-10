# Guia Rápido de Instalação e Execução

## ⚡ Início Rápido (5 minutos)

### Passo 1: Preparar o Banco de Dados

```bash
# Abra MySQL e execute:
CREATE DATABASE CuidadoraDeCriancaDb;
```

### Passo 2: Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
# Backend rodando em http://localhost:5000
```

### Passo 3: Frontend

```bash
# Em outro terminal
cd frontend
npm install
npm run dev
# Frontend rodando em http://localhost:3000
```

### Passo 4: Acesse

- Abra o navegador em **http://localhost:3000**
- Clique em "Registar" para criar uma conta
- Escolha o tipo de conta (Progenitor ou Cuidadora)

---

## 🧪 Testar Funcionalidades

### 1. Login/Registo

✅ Criar conta novo  
✅ Fazer login  
✅ Fazer logout

### 2. Procurar Babás

✅ Pesquisar por cidade  
✅ Filtrar por preço  
✅ Ver detalhes do perfil

### 3. Criar Perfil (como Cuidadora)

✅ Preencher informações  
✅ Adicionar experiência  
✅ Definir preço/hora

### 4. Mensagens

✅ Enviar mensagem  
✅ Ver inbox  
✅ Marcar como lido

### 5. Avaliações

✅ Deixar comentário  
✅ Dar estrelas  
✅ Ver avaliações

---

## 📱 URLs Principais

| Página    | URL                            | Descrição           |
| --------- | ------------------------------ | ------------------- |
| Home      | http://localhost:3000          | Página principal    |
| Login     | http://localhost:3000/login    | Fazer login         |
| Registo   | http://localhost:3000/register | Criar conta         |
| Procurar  | http://localhost:3000/search   | Procurar babás      |
| Perfil    | http://localhost:3000/profile  | Meu perfil          |
| Mensagens | http://localhost:3000/messages | Caixa de entrada    |
| API Docs  | http://localhost:5000/swagger  | Documentação da API |

---

## 🐛 Comandos Úteis

### Backend

```bash
# Atualizar banco de dados
dotnet ef database update

# Criar nova migração
dotnet ef migrations add NomeDaMigracao

# Limpar banco de dados
dotnet ef database drop

# Ver migrações
dotnet ef migrations list
```

### Frontend

```bash
# Instalar pacotes
npm install

# Atualizar pacotes
npm update

# Remover node_modules e reinstalar
rm -r node_modules && npm install

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 💡 Dicas Úteis

1. **JWT Token**: O token é armazenado em `localStorage` com a chave `token`
2. **Dados do Utilizador**: Informações do utilizador em `localStorage` com a chave `user`
3. **Variáveis de Ambiente**: Edite `appsettings.json` para configurar JWT e BD
4. **Cors**: Frontend deve estar em porta diferente do backend
5. **Hot Reload**: Frontend atualiza automaticamente ao salvar ficheiros

---

## ✅ Checklist Inicial

- [ ] MySQL instalado e a correr
- [ ] .NET 8 SDK instalado
- [ ] Node.js 18+ instalado
- [ ] Base de dados criada
- [ ] Backend compilado com sucesso
- [ ] Frontend com npm install completo
- [ ] Backend a correr em http://localhost:5000
- [ ] Frontend a correr em http://localhost:3000
- [ ] Consegue aceder à página inicial
- [ ] Consegue registar-se
- [ ] Consegue fazer login

---

**Pronto! 🎉 Seu projeto está funcionando!**

Para mais detalhes, leia o [README.md](./README.md)
