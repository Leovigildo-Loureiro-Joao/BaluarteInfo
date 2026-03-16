# API BaluarteSiteInfo

API da plataforma digital da Igreja Baluarte.  
O objetivo do projeto é centralizar conteúdo da igreja, comunicação com visitantes e membros, gestão de actividades e administração do site.

## Ideia de negócio

Esta API foi pensada para sustentar um site e um painel administrativo da igreja com quatro frentes principais:

- publicação de conteúdo cristão, como artigos, estudos, áudios e vídeos
- divulgação de actividades da igreja, incluindo eventos mensais, anuais e projectos
- recolha de mensagens, comentários e inscrições de pessoas interessadas
- gestão institucional da igreja, com informações como missão, visão e apresentação do ministério

Na prática, a plataforma permite que a igreja publique conteúdo, organize actividades e receba participação tanto de membros como de pessoas externas que tenham interesse em acompanhar ou inscrever-se.

## O que já foi implementado

### Conteúdo

- gestão de artigos com criação, edição, remoção e listagem
- upload e consulta de mídia em vídeo e áudio
- suporte a comentários ligados ao conteúdo publicado
- organização do conteúdo por tipo

### Actividades

- criação de actividades do tipo mensal, anual e projecto
- edição, remoção e listagem de actividades
- inscrição de participantes nas actividades
- autenticação/confirmação de inscrição

### Comunicação

- envio de mensagens pelo utilizador/visitante
- consulta administrativa das mensagens recebidas
- gestão de comentários
- fluxo de notificações administrativas
- contagem de visualizações de artigos e mídias

### Gestão institucional

- cadastro e atualização de informações da igreja
- suporte para blocos institucionais como missão, visão, quem somos e conteúdos relacionados
- configurações administrativas da aplicação
- estatísticas e endpoint de saúde da API

### Segurança

- autenticação com JWT
- proteção de rotas por perfil
- separação de rotas públicas, de utilizador e de administrador
- tratamento padronizado de erros em JSON
- CORS centralizado

### Qualidade técnica

- separação em `controllers`, `services`, `repositories`, `dto` e `models`
- documentação Swagger/OpenAPI
- testes web para rotas principais da API

## Tecnologias

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Swagger / OpenAPI 3

## Como executar

### Pré-requisitos

- Java 21
- Maven Wrapper (`./mvnw`)
- banco de dados configurado
- variáveis de ambiente da aplicação preenchidas

### Variáveis importantes

Exemplos de variáveis usadas pela API:

- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`
- credenciais de base de dados
- credenciais de email
- credenciais do Cloudinary

### Subir a API

```bash
./mvnw spring-boot:run
```

Base local:

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### Erro "Failed to refresh live data ... jmxrmi"

Se estiveres a usar IntelliJ e aparecer algo como:

`Failed to refresh live data from process service:jmx:rmi:///jndi/rmi://127.0.0.1:10000/jmxrmi after retries: 10`

isso normalmente significa que o IDE tentou ler "Live data" via JMX, mas a aplicação não está com o agente JMX remoto ativo (ou o hostname/porta não batem).

Opções:

- **Desligar no IDE**: desativa a recolha de "Live data" / JMX no run configuration do Spring Boot.
- **Ligar JMX na execução** (apenas dev/local): inicia a API com JMX remoto em `127.0.0.1:10000`:

```bash
ENABLE_JMX=true JMX_PORT=10000 ./speed.sh
```

## Como consumir as rotas

### Base URL

- `http://localhost:8080`

### Autenticação (JWT)

1. Faça login em `POST /auth/login`.
2. A resposta traz `token` e `user`.
3. Envie o token no header:

```
Authorization: Bearer SEU_TOKEN
```

### Headers padrão

- `Content-Type: application/json` (para JSON)
- `Authorization: Bearer <token>` (para rotas protegidas)

### Exemplo de login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@igrejabaluarte.com",
    "password": "sua_senha"
  }'
```

### Exemplo de chamada autenticada

```bash
curl http://localhost:8080/admin/statics \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Logout

```bash
curl -X POST http://localhost:8080/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Paginação (quando aplicável)

As rotas que retornam listas podem aceitar os parâmetros padrão do Spring Data:

- `page` (página, base 0)
- `size` (quantidade por página)
- `sort` (ex.: `sort=dataPublicacao,desc`)

### Upload de arquivos

Rotas de mídia aceitam `multipart/form-data` quando necessário.  
No Swagger é possível ver os campos obrigatórios de cada endpoint.

## Módulos principais e rotas

### Autenticação

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /user/me`

### Público

- `POST /public/mensagem/**`
- `POST /public/inscritos/**`

### Utilizador

- `POST /user/comentario`
- `PUT /user/comentario/edit/{id}`
- `DELETE /user/comentario/delete/{id}`
- `GET /user/comentario/{id}`
- `POST /user/mensagem/send`
- `POST /user/inscritos/{idActividade}`
- `POST /user/inscritos/auntenticar`
- `GET /user/vistos/artigo/{id}`
- `GET /user/vistos/midia/{id}`

### Artigos

- `GET /user/artigo`
- `GET /user/artigo/{id}`
- `POST /admin/artigo`
- `PUT /admin/artigo/edit/{id}`
- `DELETE /admin/artigo/delete/{id}`

### Mídia

- `GET /user/midia/video`
- `GET /user/midia/audio`
- `GET /user/midia/{id}`
- `POST /admin/midia/video`
- `POST /admin/midia/audio`
- `PUT /admin/midia/video/{id}`
- `PUT /admin/midia/audio/{id}`
- `DELETE /admin/midia/{id}`

### Actividades

- `GET /user/actividade`
- `GET /user/actividade/{id}`
- `POST /admin/actividade`
- `PUT /admin/actividade/{id}`
- `DELETE /admin/actividade/{id}`

### Administração

- `GET /admin/config/all`
- `PUT /admin/config/edit`
- `GET /admin/mensagem/all`
- `DELETE /admin/mensagem/ignorar/{id}`
- `GET /admin/notificacao`
- `GET /admin/notificacao/all`
- `PUT /admin/notificacao/{id}/ler`
- `DELETE /admin/notificacao`
- `GET /admin/statics`

### Sistema

- `GET /health`

## Estado atual

Hoje a API já cobre o núcleo funcional do sistema da igreja:

- publicação de conteúdo
- gestão de actividades
- inscrição de participantes
- área administrativa
- autenticação e autorização
- notificações com regras de negócio e testes
- visualizações de artigos e mídias

Os próximos pontos naturais de evolução são:

- endurecimento da segurança de uploads
- melhoria da documentação operacional
- expansão da cobertura de testes
