package com.igreja.api.utils;

/**
 * Template único de estilo para conteúdo HTML de artigos.
 * Mantém uma aparência consistente (cores, tipografia e fundo).
 */
public final class ArtigoHtmlTheme {
    private ArtigoHtmlTheme() {
    }

    public static String render(String titulo, String descricao, String bodyHtml) {
        String safeTitulo = escape(titulo == null ? "" : titulo.trim());
        String safeDescricao = escape(descricao == null ? "" : descricao.trim());
        String safeBody = bodyHtml == null ? "" : bodyHtml.trim();

        String header = "";
        if (!safeTitulo.isBlank() || !safeDescricao.isBlank()) {
            header = """
                    <header class="artigo-header">
                      %s
                      %s
                    </header>
                    """.formatted(
                    safeTitulo.isBlank() ? "" : "<h1 class=\"artigo-title\">" + safeTitulo + "</h1>",
                    safeDescricao.isBlank() ? "" : "<p class=\"artigo-subtitle\">" + safeDescricao + "</p>");
        }

        String template = """
                <div class="artigo-theme">
                  <style>
                    .artigo-theme{
                      --artigo-accent:#b91c1c;
                      --artigo-ink:#111827;
                      --artigo-muted:#6b7280;
                      --artigo-paper:#fffaf7;
                      position:relative;
                      max-width:900px;
                      margin:0 auto;
                      padding:28px 26px;
                      border-radius:18px;
                      background:var(--artigo-paper);
                      color:var(--artigo-ink);
                      font-family:ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                      line-height:1.85;
                      overflow:hidden;
                      box-shadow:0 14px 40px rgba(17,24,39,.08);
                    }
                    .artigo-theme *{box-sizing:border-box;}
                    .artigo-bg{
                      position:absolute;
                      inset:-120px -80px auto -80px;
                      height:520px;
                      pointer-events:none;
                      opacity:.10;
                      filter:grayscale(1);
                    }
                    .artigo-bg svg{width:100%; height:100%;}
                    .artigo-content{position:relative;}
                    .artigo-header{margin-bottom:18px; padding-bottom:14px; border-bottom:2px solid rgba(185,28,28,.20);}
                    .artigo-title{margin:0 0 6px 0; font-size:2.4rem; line-height:1.15; color:var(--artigo-ink);}
                    .artigo-subtitle{margin:0; font-size:1.1rem; color:var(--artigo-muted); font-style:italic;}
                    .artigo-content h2{margin:28px 0 12px 0; font-size:1.6rem; line-height:1.25;}
                    .artigo-content h3{margin:22px 0 10px 0; font-size:1.3rem; line-height:1.3;}
                    .artigo-content h4{margin:18px 0 8px 0; font-size:1.15rem; line-height:1.35;}
                    .artigo-content h2,.artigo-content h3,.artigo-content h4{color:var(--artigo-ink);}
                    .artigo-content h2::after{
                      content:"";
                      display:block;
                      width:78px;
                      height:3px;
                      margin-top:10px;
                      border-radius:3px;
                      background:var(--artigo-accent);
                      opacity:.85;
                    }
                    .artigo-content p{margin:0 0 14px 0;}
                    .artigo-content ul,.artigo-content ol{margin:0 0 14px 0; padding-left:22px;}
                    .artigo-content li{margin:6px 0;}
                    .artigo-content blockquote{
                      margin:18px 0;
                      padding:14px 16px;
                      border-left:5px solid rgba(185,28,28,.65);
                      background:rgba(185,28,28,.06);
                      border-radius:10px;
                      color:#1f2937;
                      font-style:italic;
                    }
                    .artigo-content hr{
                      border:none;
                      border-top:1px solid rgba(17,24,39,.10);
                      margin:26px 0;
                    }
                    .artigo-content strong{color:var(--artigo-ink);}
                    .artigo-content a{color:var(--artigo-accent); text-decoration:none;}
                    .artigo-content a:hover{text-decoration:underline;}
                  </style>
                  <div class="artigo-bg" aria-hidden="true">
                    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0" stop-color="#b91c1c"/>
                          <stop offset="1" stop-color="#7f1d1d"/>
                        </linearGradient>
                      </defs>
                      <g fill="none" stroke="url(#g)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M450 80 L450 520"/>
                        <path d="M285 225 L615 225"/>
                      </g>
                      <circle cx="450" cy="225" r="150" fill="rgba(185,28,28,.10)"/>
                    </svg>
                  </div>
                  <div class="artigo-content">
                    __HEADER__
                    __BODY__
                  </div>
                </div>
                """;

        return template.replace("__HEADER__", header).replace("__BODY__", safeBody);
    }

    private static String escape(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
