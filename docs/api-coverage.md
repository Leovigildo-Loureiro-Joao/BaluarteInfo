# API Coverage Checklist

Objetivo: garantir que **todos os endpoints expostos em `api/`** tenham consumo no(s) cliente(s) (`baluarte/` e/ou `admin/`), ou estejam explicitamente marcados como “não aplicável”.

> Este checklist foi criado a partir de uma análise do código (controllers + buscas no frontend). Se você quiser regerar uma tabela completa automaticamente, veja `scripts/generate-api-coverage.py`.

## Status rápido

- `baluarte/` já consome bem: **Actividades (listar/detalhe/admin CRUD), Artigos (listar/detalhe/admin CRUD), Mídias (admin CRUD + detalhe + view), Config (admin), Galeria (admin)**.
- `baluarte/` ainda tem **telas com mock** (principal pendência): Mensagens, Dashboard (stats), Usuários (admin), PerfilAdmin (admin profile/audit), Comentários admin, Inscrições admin/check-in, Sobre público.
- Alguns endpoints “contabilísticos” (acessos/vistos/downloads) ainda não são disparados.

## Pendente no `baluarte/` (prioridade alta)

### Mensagens (User/Admin) — hoje em mock

- [x] `GET /user/me/mensagens` -> `baluarte/src/pages/Mensagem/MinhasMensagens.tsx` (substituir `minhasMensagensMock`)
- [x] `POST /user/mensagem/send` -> `baluarte/src/pages/Mensagem/MinhasMensagens.tsx` (criar mensagem autenticada)
- [x] `GET /admin/mensagem/all` -> `baluarte/src/pages/Mensagem/MensagemAdmin.tsx` (substituir `mensagensMock`)
- [x] `GET /admin/mensagem/{id}` -> `baluarte/src/pages/Mensagem/MensagemAdmin.tsx` (detalhe/preview quando necessário)
- [x] `POST /admin/mensagem/{id}/received` -> `baluarte/src/pages/Mensagem/MensagemAdmin.tsx` (responder)
- [x] `PUT /admin/mensagem/{id}/lido?lido=true|false` -> `baluarte/src/pages/Mensagem/MensagemAdmin.tsx` (marcar lido/não lido)
- [x] `DELETE /admin/mensagem/ignorar/{id}` -> `baluarte/src/pages/Mensagem/MensagemAdmin.tsx` (ignorar)
- [x] `DELETE /admin/mensagem/{id}` -> `baluarte/src/pages/Mensagem/MensagemAdmin.tsx` (remover)

### Dashboard (Admin stats) — hoje em mock

- [x] `GET /admin/statics` -> `baluarte/src/pages/Admin/Dashboard.tsx` (substituir “Dados mockados para os gráficos”)
- [x] (opcional) `GET /user/acessos` / `POST /user/acessos` -> disparar no bootstrap do app / coletar indicador no dashboard
- [x] (opcional) `GET /user/vistos/artigo/{id}` e `GET /user/vistos/midia/{id}` -> refletir no dashboard se for desejado

### Usuários (Admin) — hoje em mock

- [x] `GET /admin/user` -> `baluarte/src/pages/Usuarios/Usuarios.tsx` (substituir `usuariosMock`)
- [x] `GET /admin/user/{id}` -> `baluarte/src/pages/Usuarios/Usuarios.tsx` (abrir detalhe/modal)
- [ ] `PUT /admin/user/{id}` -> `baluarte/src/pages/Usuarios/Usuarios.tsx` (editar)
- [x] `PUT /admin/user/{id}/aprovar` -> `baluarte/src/pages/Usuarios/Usuarios.tsx`
- [x] `PUT /admin/user/{id}/bloquear` -> `baluarte/src/pages/Usuarios/Usuarios.tsx`
- [x] `PUT /admin/user/{id}/desbloquear` -> `baluarte/src/pages/Usuarios/Usuarios.tsx`
- [ ] `PUT /admin/user/{id}/reativar` -> `baluarte/src/pages/Usuarios/Usuarios.tsx`
- [ ] `PUT /admin/user/{id}/role` -> `baluarte/src/pages/Usuarios/Usuarios.tsx`
- [x] `DELETE /admin/user/{id}` -> `baluarte/src/pages/Usuarios/Usuarios.tsx`

### Perfil Admin + Auditoria — hoje em mock

- [x] `GET /admin/profile` -> `baluarte/src/pages/Perfil/PerfilAdmin.tsx` (substituir `adminMock`)
- [x] `PUT /admin/profile` -> `baluarte/src/pages/Perfil/PerfilAdmin.tsx` (salvar)
- [x] `GET /admin/profile/audit?page=&size=&tipo=` -> `baluarte/src/pages/Perfil/PerfilAdmin.tsx` (substituir `auditLogsMock`)
- [x] Remover user mock de `baluarte/src/components/layout/SideBar.tsx` e carregar via `/admin/profile`

### Comentários (Admin) — hoje em mock

- [x] `GET /admin/comentario` -> `baluarte/src/pages/Comentarios/Comentarios.tsx` (substituir `comentariosMock`)
- [x] `PUT /admin/comentario/{id}/status` -> `baluarte/src/pages/Comentarios/Comentarios.tsx`
- [x] `PUT /admin/comentario/analise` -> já usado em `baluarte/src/pages/Actividade/ActividadeDetailAdmin.tsx`

### Inscrições (Admin + check-in) — hoje em mock

- [x] `GET /admin/inscritos?page=&size=&actividadeId=` -> `baluarte/src/pages/Inscricao/Inscricao.tsx` (substituir mocks)
- [x] `POST /user/inscritos/auntenticar` -> `baluarte/src/pages/Inscricao/Inscricao.tsx` (check-in via QR; alinhar payload esperado)
- [x] `POST /user/inscritos/{idActividade}` -> `baluarte/src/pages/Actividade/ActividadeDetail.tsx` (botão “Inscrever-me”)

### Sobre (público) e edição (Admin)

- [x] `GET /public/sobre` -> `baluarte/src/pages/Sobre/Sobre.tsx` (carregar conteúdo dinâmico)
- [x] `GET /admin/sobre` -> `baluarte/src/pages/Sobre/SobreEditAdmin.tsx` (substituir `conteudoMock`)
- [x] `PUT /admin/sobre` -> `baluarte/src/pages/Sobre/SobreEditAdmin.tsx`

## Pendente no `baluarte/` (prioridade média/baixa)

### Actividade (alguns endpoints ainda não aparecem no fluxo)

- [x] `GET /user/actividade/{id}/edicoes` -> sugerido para “outras edições” na UI de detalhe (`ActividadeDetail.tsx`)
- [x] `GET /user/actividade/{id}/comentarios` -> se a UI de comentários de actividade ainda não está ligada
- [x] `GET /user/actividade/{id}/inscritos?page=&size=` -> se a UI precisa exibir lista/paginação de inscritos
- [x] `GET /admin/actividade/datas` -> se a UI admin precisa listar datas marcadas
- [x] `GET /admin/actividade/{id}/comentarios/{analise}` -> se o admin precisa filtrar comentários por análise

### Mídia (endpoints user list/relacionados/comentários)

- [x] `GET /user/midia/video` -> `baluarte/src/pages/Midia/Midia.tsx` (seção “Últimos vídeos”)
- [x] `GET /user/midia/audio` -> `baluarte/src/pages/Midia/Midia.tsx` (seção “Últimos áudios”)
- [x] `GET /user/midia/{id}/comentarioAll` -> `baluarte/src/components/midia/MidiaDetail.tsx`
- [x] `GET /user/midia/{id}/relacionados` -> `baluarte/src/components/midia/MidiaDetail.tsx` (card “Relacionados”)
- [x] `GET /user/midia/{id}/relacionados-edicoes` -> `baluarte/src/components/midia/MidiaDetail.tsx` (card “Outras edições”)
- [x] `POST /user/me/midia/{id}/view` -> `baluarte/src/components/midia/MidiaDetail.tsx` (view qualificada)

### Downloads do usuário (registro)

- [x] `POST /user/me/download/artigo/{id}` -> `baluarte/src/pages/Artigos/ArtigosDetails.tsx` + `baluarte/src/components/artigos/VisualizarArtigoModal.tsx`
- [x] `POST /user/me/download/midia/{id}` -> `baluarte/src/components/midia/MidiaDetail.tsx`
- [x] `GET /user/me/downloads/artigos` -> `baluarte/src/pages/Perfil/Perfil.tsx` (aba “Downloads”)
- [x] `GET /user/me/downloads/midias` -> `baluarte/src/pages/Perfil/Perfil.tsx` (aba “Downloads” + filtro `midiaType`)

### Notificações (Admin)

- [x] `GET /admin/notificacao` -> `baluarte/src/components/layout/Notificacao.tsx` + `baluarte/src/components/layout/SideBar.tsx` (badge)
- [x] `GET /admin/notificacao/all` -> `baluarte/src/pages/Admin/Notificacoes.tsx`
- [x] `PUT /admin/notificacao/{id}/ler` -> `baluarte/src/components/layout/Notificacao.tsx` + `baluarte/src/pages/Admin/Notificacoes.tsx`
- [x] `DELETE /admin/notificacao` -> `baluarte/src/components/layout/Notificacao.tsx` + `baluarte/src/pages/Admin/Notificacoes.tsx`

### Contacto (público)

- [x] `POST /public/mensagem/send` -> `baluarte/src/pages/Contacto.tsx` (visitante)
- [x] `POST /user/mensagem/send` -> `baluarte/src/pages/Contacto.tsx` (logado)
- [x] `GET /public/contacto-config` -> `baluarte/src/pages/Contacto.tsx` (dados de contacto configuráveis)

## Pendente no cliente `admin/` (Java desktop)

O módulo `admin/` (Java) consome parte grande do backend, mas ainda faltam chamadas para:

- [ ] Perfil/audit: `GET/PUT /admin/profile`, `GET /admin/profile/audit`
- [ ] Mensagens (admin): `GET /admin/mensagem/all`, `GET /admin/mensagem/{id}`, `POST /admin/mensagem/{id}/received`, `PUT /admin/mensagem/{id}/lido`, `DELETE /admin/mensagem/ignorar/{id}`, `DELETE /admin/mensagem/{id}`
- [ ] Inscritos: `GET /admin/inscritos`
- [ ] Sobre: `GET/PUT /admin/sobre`
- [ ] Público: `GET /public/sobre`, `POST /public/mensagem/send`, endpoints públicos de inscrição/PDF (se o desktop precisar)

## Próxima execução sugerida

1) Mensagens (`MinhasMensagens.tsx` e `MensagemAdmin.tsx`) -> remover mocks e ligar endpoints
2) Dashboard (`Dashboard.tsx`) -> ligar `/admin/statics`
3) Usuários (`Usuarios.tsx`) + PerfilAdmin (`PerfilAdmin.tsx`) -> ligar endpoints `/admin/user*` e `/admin/profile*`
4) Inscrições (`Inscricao.tsx`) + Comentários admin (`Comentarios.tsx`) -> ligar endpoints
