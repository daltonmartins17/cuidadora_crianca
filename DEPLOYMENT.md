# 🚀 CHECKLIST DE DEPLOYMENT & BOAS PRÁTICAS

## ⚠️ ANTES DE COLOCAR EM PRODUÇÃO

### 🔐 Segurança

#### Backend

- [ ] **JWT Key**: Altere para uma chave segura e complexa em `appsettings.json`

  ```json
  "Jwt": {
    "Key": "GERE-UMA-CHAVE-MUITO-LONGA-E-SEGURA-AQUI-MINIMO-50-CARACTERES",
    "Issuer": "CuidadoraDeCrianca",
    "Audience": "CuidadoraDeCriancaUsers",
    "ExpirationMinutes": 1440
  }
  ```

- [ ] **Connection String**: Use variáveis de ambiente

  ```json
  "ConnectionStrings": {
    "DefaultConnection": "Server=SERVIDOR_PRODUCAO;Database=CuidadoraDeCriancaDb;User=USER_PROD;Password=SENHA_SEGURA;"
  }
  ```

- [ ] **CORS**: Configure para domínios específicos (não "\*")

  ```csharp
  options.WithOrigins("https://www.cuidadora.pt", "https://cuidadora.pt")
  ```

- [ ] **HTTPS**: Ative HTTPS obrigatório

  ```csharp
  app.UseHttpsRedirection();
  ```

- [ ] **SQL Injection**: Verifique todas as queries (usando EF Core minimiza risco)

- [ ] **Password Hashing**: Considere usar `bcrypt` em vez de SHA256

#### Frontend

- [ ] **API URL**: Use variáveis de ambiente `.env`

  ```
  VITE_API_URL=https://api.cuidadora.pt
  ```

- [ ] **Remova console.log()**: Em produção

  ```javascript
  // Antes de deploy, remova ou use condicional
  if (import.meta.env.DEV) {
    console.log("Dev mode");
  }
  ```

- [ ] **Desative source maps**: Em produção
  ```javascript
  // vite.config.js
  build: {
    sourcemap: false;
  }
  ```

### 🗄️ Banco de Dados

- [ ] **Backup**: Faça backup completo antes de deploy

  ```bash
  mysqldump -u root -p CuidadoraDeCriancaDb > backup.sql
  ```

- [ ] **Verificar integridade**: Todas as migrations aplicadas

  ```bash
  dotnet ef migrations list
  ```

- [ ] **Índices**: Adicione índices em colunas frequentemente consultadas

  ```sql
  CREATE INDEX idx_users_email ON Users(Email);
  CREATE INDEX idx_profiles_city ON Profiles(City);
  ```

- [ ] **Permissões**: Crie user específico com permissões mínimas
  ```sql
  CREATE USER 'cuidadora_prod'@'localhost' IDENTIFIED BY 'SENHA_MUITO_SEGURA';
  GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER ON CuidadoraDeCriancaDb.* TO 'cuidadora_prod'@'localhost';
  ```

### 🌐 Deployment

#### Backend (Azure/Heroku/AWS)

- [ ] **Build Release**: Compile em modo Release

  ```bash
  dotnet publish -c Release -o ./publish
  ```

- [ ] **Environment Variables**: Configure todas as variáveis
  - JWT Key
  - Connection String
  - Email SMTP (futuro)
  - API Keys (futuro)

- [ ] **Logging**: Configure proper logging

  ```csharp
  // Program.cs
  builder.Logging.AddConsole();
  builder.Logging.SetMinimumLevel(LogLevel.Information);
  ```

- [ ] **Health Check**: Implemente endpoint de health
  ```csharp
  app.MapHealthChecks("/health");
  ```

#### Frontend (Vercel/Netlify)

- [ ] **Build**: Execute build

  ```bash
  npm run build
  ```

- [ ] **Teste o build localmente**:

  ```bash
  npm run preview
  ```

- [ ] **Configurar domínio**: Use domínio personalizado

- [ ] **SSL/HTTPS**: Configurado automaticamente

### 📊 Performance

#### Backend

- [ ] **Caching**: Considere adicionar Redis
- [ ] **Pagination**: Implemente em endpoints que retornam muitos dados
- [ ] **Compression**: Ative gzip no Kestrel
  ```csharp
  builder.Services.AddResponseCompression();
  app.UseResponseCompression();
  ```

#### Frontend

- [ ] **Bundle Size**: Verifique tamanho final

  ```bash
  npm run build -- --analyze
  ```

- [ ] **Lazy Loading**: Implemente code splitting para páginas

- [ ] **Image Optimization**: Comprima imagens

- [ ] **Minification**: Automático no Vite build

### 📱 Compatibilidade

- [ ] **Testar em múltiplos navegadores**:
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)

- [ ] **Testar em dispositivos**:
  - Desktop (1920x1080)
  - Tablet (768x1024)
  - Mobile (375x667)

- [ ] **Testar em diferentes conexões** (3G, 4G, WiFi)

### 🧪 Testes

- [ ] **Testes funcionais**: Verificar cada funcionalidade
- [ ] **Testes de API**: Testar todos os endpoints
- [ ] **Testes de autenticação**: Login/logout/refresh token
- [ ] **Testes de validação**: Form validation
- [ ] **Testes de erro**: Tratamento de erros

### 📝 Documentação

- [ ] **README atualizado**: Com instruções de produção
- [ ] **API Documentation**: Swagger disponível
- [ ] **Comentários no código**: Explicar lógica complexa
- [ ] **Changelog**: Versão 1.0.0 concluída

---

## 🎯 PASSO A PASSO: DEPLOY NO AZURE

### 1. Criar App Service

```bash
# Login no Azure
az login

# Criar resource group
az group create --name cuidadora-rg --location westeurope

# Criar App Service Plan
az appservice plan create --name cuidadora-plan --resource-group cuidadora-rg --sku B1 --is-linux

# Criar App Service
az webapp create --resource-group cuidadora-rg --plan cuidadora-plan --name cuidadora-api --runtime "DOTNETCORE|8.0"
```

### 2. Deploy Backend

```bash
# Entrar no diretório backend
cd backend

# Publicar
dotnet publish -c Release -o ./publish

# Fazer zip
Compress-Archive -Path ./publish/* -DestinationPath ./publish.zip

# Deploy
az webapp deployment source config-zip --resource-group cuidadora-rg --name cuidadora-api --src ./publish.zip
```

### 3. Configurar Variáveis de Ambiente

```bash
az webapp config appsettings set --resource-group cuidadora-rg --name cuidadora-api \
  --settings \
  "ConnectionStrings__DefaultConnection=Server=seu-servidor.mysql.database.azure.com;Database=CuidadoraDeCriancaDb;User=user;Password=senha;" \
  "Jwt__Key=sua-chave-segura-aqui" \
  "Jwt__Issuer=CuidadoraDeCrianca" \
  "Jwt__Audience=CuidadoraDeCriancaUsers"
```

### 4. Deploy Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod

# Configurar variáveis de ambiente
# .env.production
VITE_API_URL=https://cuidadora-api.azurewebsites.net
```

---

## 🛡️ SEGURANÇA PÓS-DEPLOYMENT

### Monitoramento

- [ ] **Application Insights**: Ativo no Azure
- [ ] **Logs**: Revisados regularmente
- [ ] **Alerts**: Configurados para erros

### Backup

- [ ] **Backup automático**: BD a cada 24h
- [ ] **Restore test**: Testar restauração
- [ ] **Off-site**: Cópia em local seguro

### Atualizações

- [ ] **Patch Management**: Manter dependências atualizadas
- [ ] **Security Updates**: Aplicar com urgência
- [ ] **Testing**: Testar em staging antes de prod

### Auditoria

- [ ] **Logs de acesso**: Quem fez login
- [ ] **Logs de mudanças**: Quem alterou o quê
- [ ] **Logs de erro**: Monitorar anomalias

---

## 📊 MONITORAMENTO EM PRODUÇÃO

### Métricas para Acompanhar

```
Backend:
✓ Resposta média da API (< 500ms ideal)
✓ Taxa de erro (< 1% ideal)
✓ Uptime (> 99.5% ideal)
✓ Utilizadores ativos

Frontend:
✓ Carregamento de página (< 3s ideal)
✓ Interatividade (< 100ms ideal)
✓ Bounce rate
✓ Conversões (Registos)
```

### Ferramentas Recomendadas

- **Azure Monitor**: Métricas de backend
- **Google Analytics**: Comportamento de utilizadores
- **Sentry**: Rastreamento de erros
- **New Relic**: Performance monitoring

---

## 🔄 PROCESSO DE DEPLOYMENT CONTÍNUO

### Configurar GitHub Actions (Futuro)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: "8.0.x"

      - name: Publish
        run: dotnet publish -c Release -o ./publish

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: cuidadora-api
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: ./publish

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## ✅ CHECKLIST FINAL

### 72 Horas Antes

- [ ] Notifique utilizadores sobre maintenance
- [ ] Faça backup completo
- [ ] Teste deployment em staging
- [ ] Prepare rollback plan

### 24 Horas Antes

- [ ] Finalize testes
- [ ] Confirme todas as configs
- [ ] Brief da equipa
- [ ] Monitor pronto

### No Dia

- [ ] Comece no horário calmo
- [ ] Tenha equipa disponível
- [ ] Monitor em tempo real
- [ ] Comunicar progresso

### Pós-Deployment

- [ ] Verifique todas as funcionalidades
- [ ] Monitore erros
- [ ] Responda a feedback
- [ ] Documente lessons learned

---

## 🆘 ROLLBACK

Se algo der muito errado:

```bash
# Backend
az webapp deployment slot swap --name cuidadora-api --resource-group cuidadora-rg

# Frontend
vercel rollback

# BD
mysql < backup.sql
```

---

## 📞 SUPORTE EM PRODUÇÃO

### Onboarding da Equipa de Support

1. Documente procedimentos comuns
2. Crie playbooks para problemas
3. Configure alertas inteligentes
4. Estabeleça SLA

### Procedimentos de Escalação

1. Utilizador reporta issue
2. Support verifica logs
3. Backend/Frontend developers notificados
4. Fix prioritizado
5. Hotfix em produção ou próxima release

---

## 📚 LEITURA RECOMENDADA

- [The Twelve-Factor App](https://12factor.net/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Azure Best Practices](https://docs.microsoft.com/azure/architecture/guide/)
- [React Security](https://react.dev/learn)

---

## 🎊 PARABÉNS!

Seu projeto Cuidadora de Criança está pronto para o mundo! 🌍

**Boa sorte no deployment! 🚀**

---

**Última atualização**: Dezembro 2024  
**Status**: Pronto para Produção ✅
