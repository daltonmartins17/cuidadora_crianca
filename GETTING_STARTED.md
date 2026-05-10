# 🚀 GETTING STARTED - COMECE AGORA!

## ⏱️ 5 MINUTOS PARA TER TUDO A FUNCIONAR

### 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se que tem:

```
✓ MySQL instalado     → https://www.mysql.com/downloads/
✓ .NET 8 SDK          → https://dotnet.microsoft.com/download
✓ Node.js 18+         → https://nodejs.org/
✓ Git                 → https://git-scm.com/
✓ VS Code (recomendado) → https://code.visualstudio.com/
```

Verifique instalação:

```bash
mysql --version
dotnet --version
node --version
npm --version
```

---

## ⚡ PASSO 1: PREPARAR BASE DE DADOS (1 minuto)

### Opção A: MySQL Workbench

1. Abra MySQL Workbench
2. Connect à sua instância local
3. Execute este comando:

```sql
CREATE DATABASE CuidadoraDeCriancaDb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Opção B: Terminal

```bash
mysql -u root -p
```

```sql
CREATE DATABASE CuidadoraDeCriancaDb;
exit
```

✅ **Base de dados criada!**

---

## ⚡ PASSO 2: RODAR BACKEND (2 minutos)

Abra **Terminal 1**:

```bash
# Navegar para backend
cd backend

# Restaurar dependências (.NET packages)
dotnet restore

# Aplicar migrações (criar tabelas)
dotnet ef database update

# Rodar servidor
dotnet run
```

📊 Se ver isto é sucesso:

```
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://localhost:5001
      Now listening on: http://localhost:5000
      Application started. Press Ctrl+C to exit.
```

✅ **Backend rodando em http://localhost:5000**

---

## ⚡ PASSO 3: RODAR FRONTEND (2 minutos)

Abra **Terminal 2** (deixe o primeiro a correr):

```bash
# Navegar para frontend
cd frontend

# Instalar dependências (npm packages)
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

📊 Se ver isto é sucesso:

```
  VITE v5.0.0  ready in 245 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

✅ **Frontend rodando em http://localhost:3000**

---

## ⚡ PASSO 4: USAR A APLICAÇÃO (1 minuto)

1. **Abra navegador**

   ```
   http://localhost:3000
   ```

2. **Clique "Registar"**
   - Preencha o formulário
   - Escolha tipo de conta (Progenitor ou Cuidadora)
   - Clique "Criar Conta"

3. **Explore!**
   - Pesquise babás
   - Veja perfis
   - Envie mensagens
   - Deixe avaliações

✅ **PRONTO! 🎉**

---

## 🎯 PRÓXIMAS FUNCIONALIDADES PARA TESTAR

### Como Progenitor:

1. ✅ Login
2. ✅ Pesquisar babás (clique "Procurar Babás")
3. ✅ Ver detalhes (clique no card)
4. ✅ Enviar mensagem (clique "Contactar")
5. ✅ Ver caixa de mensagens (ícone envelope)

### Como Cuidadora:

1. ✅ Login
2. ✅ Criar perfil (clique no perfil, preença dados)
3. ✅ Ver mensagens recebidas
4. ✅ Deixar disponível no perfil

---

## 🔗 LINKS IMPORTANTES

| Link                          | Descrição           |
| ----------------------------- | ------------------- |
| http://localhost:3000         | 🎨 Frontend (App)   |
| http://localhost:5000         | 🔙 Backend (API)    |
| http://localhost:5000/swagger | 📚 Documentação API |

---

## 📂 ESTRUTURA DE PASTAS

```
Cuidadora-de-crianca/
├── backend/             ← Backend (ASP.NET)
├── frontend/            ← Frontend (React)
├── README.md            ← Documentação principal
├── SETUP.md             ← Guia detalhado
├── ARCHITECTURE.md      ← Estrutura técnica
└── ...
```

---

## ❓ PROBLEMAS COMUNS & SOLUÇÕES

### "Erro ao conectar à base de dados"

```
❌ Problema: Connection refused
✅ Solução:
   1. MySQL está a correr?
   2. Verifique appsettings.json
   3. Execute: CREATE DATABASE CuidadoraDeCriancaDb;
```

### "Port 5000 já está em uso"

```
❌ Problema: Address already in use
✅ Solução:
   1. Feche outro processo em 5000
   2. Ou edite Program.cs para outra porta
```

### "Port 3000 já está em uso"

```
❌ Problema: Port already in use
✅ Solução:
   1. Feche outro processo em 3000
   2. Ou edite vite.config.js para outra porta
```

### "npm install falla"

```
❌ Problema: Permission denied
✅ Solução:
   1. Deletar node_modules: rm -r node_modules
   2. Fazer: npm install novamente
   3. Ou: npm install --legacy-peer-deps
```

### "CORS error"

```
❌ Problema: Access-Control-Allow-Origin
✅ Solução:
   Frontend está em 3000?
   Backend está em 5000?
   Verificar Program.cs CORS config
```

---

## ✅ CHECKLIST DE PRIMEIRA VEZ

Após começar, verifique:

- [ ] Backend rodando em http://localhost:5000
- [ ] Frontend rodando em http://localhost:3000
- [ ] Conseguiu abrir a página inicial
- [ ] Conseguiu registar uma conta
- [ ] Conseguiu fazer login
- [ ] Conseguiu pesquisar (se Progenitor)
- [ ] Conseguiu criar perfil (se Cuidadora)

---

## 🎓 PRÓXIMOS PASSOS

### Para Aprender

1. Leia [README.md](README.md)
2. Explore [ARCHITECTURE.md](ARQUITECTURA.md)
3. Revise o código comentado

### Para Modificar

1. Abra VS Code
2. Modifique um ficheiro
3. Veja mudanças ao vivo

### Para Expandir

1. Adicione novo Controller
2. Adicione nova Página
3. Teste tudo

---

## 🔧 COMANDOS ÚTEIS

### Backend

```bash
# Recriar base de dados
dotnet ef database drop
dotnet ef database update

# Criar nova migração
dotnet ef migrations add NomeDaMigracao

# Ver migrações
dotnet ef migrations list
```

### Frontend

```bash
# Atualizar pacotes
npm update

# Limpar e reinstalar
rm -r node_modules && npm install

# Build para produção
npm run build
```

---

## 📱 FUNCIONALIDADES PRINCIPAIS

```
🔐 AUTENTICAÇÃO
   Login / Registo / Logout

👥 PERFIS
   Ver perfis / Criar perfil / Editar perfil

🔍 PESQUISA
   Procurar por cidade / Filtrar por preço

💬 MENSAGENS
   Enviar / Receber / Marcar como lido

⭐ AVALIAÇÕES
   Deixar comentário / Ver avaliações
```

---

## 🎨 DESIGN

O projeto usa:

- **TailwindCSS** para estilos
- **Gradientes roxo/rosa** para tema
- **Ícones Lucide React** para elementos
- **Cards responsivos** para conteúdo
- **Animações suaves** para interatividade

---

## 🔐 SEGURANÇA

Implementado:

- ✅ Hash de senhas (SHA256)
- ✅ JWT tokens com expiração
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Rotas protegidas

---

## 📊 PERFORMANCE

- ✅ Frontend: Vite (build rápido)
- ✅ Backend: ASP.NET Core (performance)
- ✅ Database: MySQL (queries otimizadas)
- ✅ Lazy loading
- ✅ Minificação automática

---

## 🆘 PRECISA DE AJUDA?

### Consulte

1. **[README.md](README.md)** - Documentação completa
2. **[SETUP.md](SETUP.md)** - Guia detalhado
3. **[ARCHITECTURE.md](ARQUITECTURA.md)** - Estrutura técnica
4. **Código comentado** - Explicações no código

### Verifique

1. Terminal de erros (Console do VS Code)
2. Browser console (F12)
3. Swagger docs (http://localhost:5000/swagger)

---

## 🎉 VOCÊ CONSEGUIU!

Parabéns! Seu projeto está a funcionar! 🚀

Agora:

1. ✅ Explore a aplicação
2. ✅ Teste todas as funcionalidades
3. ✅ Modifique algo
4. ✅ Adicione features
5. ✅ Publique no mundo!

---

## 📞 SUPORTE RÁPIDO

| Dúvida          | Resposta                            |
| --------------- | ----------------------------------- |
| **Como rodar?** | Siga os 4 passos acima ↑            |
| **Docs?**       | Abra [README.md](README.md)         |
| **Código?**     | Leia comentários no ficheiro        |
| **Erro?**       | Veja "Problemas Comuns" acima       |
| **Deploy?**     | Abra [DEPLOYMENT.md](DEPLOYMENT.md) |

---

## 🌟 PARABÉNS NOVAMENTE!

Você tem um projeto **profissional, funcional e bonito**!

**Divirta-se a programar!** 🎊

---

```
╔════════════════════════════════════════╗
║  PRONTO PARA COMEÇAR?                  ║
║                                        ║
║  Terminal 1: cd backend && dotnet run ║
║  Terminal 2: cd frontend && npm run dev║
║                                        ║
║  Depois abra: http://localhost:3000   ║
║                                        ║
║  Sucesso! 🚀                           ║
╚════════════════════════════════════════╝
```

**Versão**: 1.0.0  
**Data**: Dezembro 2024  
**Status**: ✅ Pronto para Começar

Aproveite! 🎉
