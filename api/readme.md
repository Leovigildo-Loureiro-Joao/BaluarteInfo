# 📖 API BaluarteSiteInfo

Documentação da API do **Igreja Baluarte**.  
Esta API gerencia informações, artigos, mídia, atividades, mensagens e autenticação de usuários.

---

## 📌 Informações Gerais
- **Título:** API BaluarteSiteInfo  
- **Versão:** v1  
- **Base URL:** `http://localhost:8080`  
- **Contato:** Leovigildo Loureiro João (leovigildojoao902@gmail.com)  

---

## 🚀 Tecnologias
- Java + Spring Boot  
- Spring Web / Data JPA  
- Spring Security (autenticação JWT)  
- Swagger (OpenAPI 3)  

---

## ▶️ Como rodar o projetoA API estará disponível em:

Swagger UI → http://localhost:8080/swagger-ui/index.html
```bash
mvn spring-boot:run
# ou
./mvnw spring-boot:run

A API estará disponível em:

- Swagger UI → [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- OpenAPI JSON → [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

## 🔑 Autenticação

- `POST /auth/register` → registrar novo usuário
- `POST /auth/login` → autenticar usuário

## 👥 Usuário (User / Comentários / Mensagens / Inscrições)

- `POST /user/comentario` → criar comentário
- `PUT /user/comentario/edit/{id}` → editar comentário
- `DELETE /user/comentario/delete/{id}` → remover comentário
- `GET /user/comentario/{id}` → buscar comentário por ID
- `POST /user/mensagem/send` → enviar mensagem
- `POST /user/inscritos/{idActividade}` → inscrever-se em atividade
- `POST /user/inscritos/auntenticar` → autenticar inscrição

## 📚 Conteúdo (Artigos, Mídia, Atividades)

### Artigos

- `GET /user/artigo` → listar artigos (paginado)
- `GET /user/artigo/{id}` → buscar artigo por ID
- `POST /admin/artigo` → criar artigo
- `PUT /admin/artigo/edit/{id}` → editar artigo
- `DELETE /admin/artigo/delete/{id}` → remover artigo

### Mídia

- `GET /user/midia/video` → listar vídeos
- `GET /user/midia/audio` → listar áudios
- `GET /user/midia/{id}` → buscar mídia por ID
- `POST /admin/midia/video` → cadastrar vídeo
- `POST /admin/midia/audio` → cadastrar áudio
- `PUT /admin/midia/video/{id}` → editar vídeo
- `PUT /admin/midia/audio/{id}` → editar áudio
- `DELETE /admin/midia/{id}` → remover mídia

### Atividades

- `GET /user/actividade` → listar atividades (paginado)
- `GET /user/actividade/{id}` → buscar atividade por ID
- `POST /admin/actividade` → criar atividade
- `PUT /admin/actividade/{id}` → editar atividade
- `DELETE /admin/actividade/{id}` → remover atividade

## 📢 Notificações & Mensagens

- `GET /admin/notificacao` → listar notificações
- `PUT /admin/notificacao/{id}/ler` → marcar como lida
- `DELETE /admin/notificacao` → remover notificações
- `GET /admin/mensagem/all` → listar mensagens recebidas
- `POST /admin/mensagem/{id}/received` → responder mensage
- `DELETE /admin/mensagem/ignorar/{id}` → ignorar mensagem

---

## ⚙️ Configurações & Estatísticas

- `GET /admin/config/all` → listar configurações
- `PUT /admin/config/edit` → editar configuração    
- `GET /admin/statics` → estatísticas do sistema
- `GET /health` → verificar status da API


