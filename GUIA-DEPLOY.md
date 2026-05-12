# Guia de Deploy — Site Dra. Beatriz Aroeira

Site estático em HTML/CSS/JS, com painel administrativo (Sveltia CMS) para edição do blog.
Mesma arquitetura do site do Dr. Pedro Barbosa.

---

## 1. O que está nesta pasta

```
fazer upload/
├── index.html               (home)
├── sobre.html               (sobre mim)
├── servicos.html            (lista de serviços)
├── blog.html                (lista de posts)
├── contato.html             (contato + FAQ)
├── politica-privacidade.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico / favicon.png
├── servicos/                (6 páginas de serviços)
├── blog/                    (posts em HTML)
├── blog/posts/              (posts em Markdown gerenciados pelo admin)
├── admin/                   (Sveltia CMS — login + edição do blog)
├── assets/                  (imagens, fotos, logo, depoimentos)
├── css/                     (style.css, home.css, pages.css)
└── js/                      (main.js)
```

---

## 2. Subir para o GitHub

1. Acesse https://github.com/aroeiravillar e crie um repositório novo chamado **`site-dra-beatriz-aroeira`** (público ou privado).
2. Faça upload de **todo o conteúdo desta pasta `fazer upload/`** para a raiz do repositório (não subir a pasta `fazer upload` em si — subir o que está dentro dela).
3. Branch principal: **`main`**.

---

## 3. Deploy no Vercel

1. Entre em https://vercel.com/ e conecte sua conta GitHub.
2. Clique em **Add New → Project** e importe o repositório `site-dra-beatriz-aroeira`.
3. **Framework Preset:** Other (site estático puro).
4. **Build Command:** deixe em branco.
5. **Output Directory:** deixe em branco (raiz do repositório).
6. Clique em **Deploy**.

Em poucos segundos o site estará no ar com uma URL `*.vercel.app`.

---

## 4. Apontar o domínio drabeatrizaroeira.com.br

No painel do Vercel (Project → Settings → Domains):
1. Adicione o domínio `drabeatrizaroeira.com.br` e também `www.drabeatrizaroeira.com.br`.
2. O Vercel mostrará os registros DNS a configurar no provedor onde o domínio está registrado (Registro.br, GoDaddy, etc.):
   - Tipo **A** apontando para o IP do Vercel (geralmente `76.76.21.21`).
   - Tipo **CNAME** para `www` apontando para `cname.vercel-dns.com`.
3. Aguarde de minutos a algumas horas para o DNS propagar.

---

## 5. Configurar o painel admin (Sveltia CMS)

O painel é acessado em: **https://drabeatrizaroeira.com.br/admin/**

### Como funciona o login

O Sveltia CMS autentica via **GitHub OAuth**. A Dra. Beatriz precisa:
1. Ter uma conta no GitHub.
2. Ter acesso de escrita ao repositório `aroeiravillar/site-dra-beatriz-aroeira` (adicione-a como colaboradora em GitHub → Settings → Collaborators).

Ao abrir `/admin/`, ela clica em **Login com GitHub** e autoriza pelo `auth.sveltia.dev` (que é o serviço oficial gratuito do Sveltia). Depois disso, ela tem acesso ao painel completo para criar e editar posts.

### O que ela pode fazer no painel
- Criar novos artigos do blog (formulário com Título, Categoria, Imagem de capa, Conteúdo em editor de texto rico).
- Editar/excluir artigos existentes.
- Subir imagens (ficam salvas em `/assets/blog/`).
- Cada publicação é commitada automaticamente no GitHub e o Vercel já republica o site.

---

## 6. Imagens da Dra. Beatriz incluídas

Todas as imagens originais do site Framer foram trazidas para `assets/`:
- **photo-beatriz-hero.jpg** — foto principal (parede de mármore) — usada no Hero da home
- **photo-beatriz-porta.jpg** — foto encostada na porta — usada na seção "Sobre" da home e na página Sobre
- **photo-beatriz-sentada.jpg** — sentada, mãos cruzadas — usada na seção Contato e card de serviço Obstetrícia
- **photo-beatriz-mesa.jpg** — sentada, mão no queixo — usada no card Acompanhamento Ginecológico
- **logo-ba-full.png** — logo completa — usada no rodapé
- **logo-ba-mono.png** — símbolo dourado — usado no header e favicon
- **testimonial-1 a 10** — os 10 depoimentos extraídos como cards-imagem — usados no carrossel da home
- **flores-horizontal.jpg / flor-branca.jpg / bege-bg.jpg** — imagens de apoio para serviços e backgrounds

---

## 7. Onde editar coisas no código

| O que mudar | Onde |
|---|---|
| Telefone WhatsApp | Buscar `553184536446` em todos os HTMLs |
| CRM / RQE | Buscar `71907` e `501564` |
| Endereço da clínica | Buscar `Rua Ouro Preto, 1596` |
| Cores | `css/style.css` — variáveis CSS no topo (`:root`) |
| Logo | Substituir os arquivos `assets/logo-ba-*.png` |
| FAQ | Editar `index.html` e `contato.html` (mesma lista nos dois) |
| Depoimentos | Trocar imagens em `assets/testimonial-*.png` |

---

## 8. Checklist pós-deploy

- [ ] Verificar todas as páginas no domínio final
- [ ] Testar links de WhatsApp em desktop e mobile
- [ ] Testar painel admin (login GitHub)
- [ ] Publicar 1 artigo de teste pelo painel e verificar que aparece em `/blog.html` (vai precisar atualizar o `blog.html` para listar dinamicamente — versão atual lista os 2 posts em HTML estaticamente)
- [ ] Configurar Google Search Console e enviar o sitemap.xml
- [ ] (Opcional) Adicionar Google Tag Manager / Analytics no `<head>` quando solicitado

---

**Site feito por AV Marketing Médico.**
