package com.igreja.api.utils;

import org.springframework.stereotype.Component;
import java.util.regex.Pattern;
import java.util.ArrayList;
import java.util.List;

@Component
public class ArtigoProcessor {
    
    private static final Pattern MULTIPLE_SPACES_INLINE = Pattern.compile("[ \\t\\f\\u000B]+");
    private static final Pattern MULTIPLE_BREAKS = Pattern.compile("\\n{3,}");
    private static final Pattern MARKDOWN_HEADING = Pattern.compile("^(#{1,6})\\s+(.+)$");
    private static final Pattern LIST_ITEM_PREFIX = Pattern.compile("^(?:[•\\-*+]|\\d{1,3}[\\.)])\\s+");
    
    /**
     * Processa o texto bruto do Gemini e converte para HTML estruturado
     */
    public String processToHtml(String titulo, String descricao, String rawText) {
        // Remove HTML bagunçado se existir
        String cleanText = cleanRawText(rawText);
        
        // Divide em parágrafos e seções
        List<String> paragraphs = splitIntoParagraphs(cleanText);
        
        // Constrói HTML do corpo e aplica template único de estilo
        String body = buildBodyHtml(paragraphs);
        return ArtigoHtmlTheme.render(titulo, descricao, body);
    }
    
    private String cleanRawText(String text) {
        if (text == null) return "";
        
        String cleaned = text.replace("\r\n", "\n").replace('\r', '\n');

        // Remove tags HTML bagunçadas (tudo que parece tag)
        cleaned = cleaned.replaceAll("<[^>]*>", "");
        
        // Remove caracteres estranhos como ■
        cleaned = cleaned.replaceAll("[■●▪►]", "");

        // Normaliza espaços (sem destruir quebras de linha)
        cleaned = MULTIPLE_SPACES_INLINE.matcher(cleaned).replaceAll(" ");
        cleaned = cleaned.replaceAll("(?m)[ \\t]+$", "");

        // Normaliza quebras de linha
        cleaned = cleaned.replaceAll("(?m)^[ \\t]*\\n", "\n");
        cleaned = MULTIPLE_BREAKS.matcher(cleaned).replaceAll("\n\n");
        
        return cleaned.trim();
    }
    
    private List<String> splitIntoParagraphs(String text) {
        List<String> paragraphs = new ArrayList<>();
        if (text == null || text.isBlank()) {
            return paragraphs;
        }

        String[] lines = text.split("\\n", -1);
        StringBuilder current = new StringBuilder();
        boolean inListBlock = false;

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            String trimmed = line == null ? "" : line.trim();

            if (trimmed.isEmpty()) {
                if (inListBlock && current.length() > 0) {
                    int next = nextNonEmptyIndex(lines, i + 1);
                    if (next != -1 && isListItemLine(lines[next])) {
                        continue;
                    }
                }
                if (current.length() > 0) {
                    paragraphs.add(current.toString().trim());
                    current = new StringBuilder();
                }
                inListBlock = false;
                continue;
            }

            if (isMarkdownHeading(trimmed) || isChapterTitle(trimmed)) {
                if (current.length() > 0) {
                    paragraphs.add(current.toString().trim());
                    current = new StringBuilder();
                }
                paragraphs.add(trimmed);
                inListBlock = false;
                continue;
            }

            if (current.length() > 0) {
                current.append('\n');
            }
            current.append(trimmed);
            inListBlock = isListItemLine(trimmed) || (inListBlock && isListItemLine(trimmed));
        }

        if (current.length() > 0) {
            paragraphs.add(current.toString().trim());
        }
        
        // Pós-processa: divide blocos muito longos (só quando for texto corrido, sem quebras)
        List<String> normalized = new ArrayList<>(paragraphs.size());
        for (String para : paragraphs) {
            if (para == null || para.isBlank()) continue;

            boolean keepAsBlock = para.contains("\n") || isList(para) || isMarkdownHeading(para) || isChapterTitle(para);
            if (keepAsBlock || para.length() <= 500) {
                normalized.add(para.trim());
                continue;
            }

            String[] sentences = para.split("(?<=[.!?])\\s+");
            StringBuilder currentPara = new StringBuilder();
            for (String sentence : sentences) {
                if (currentPara.length() + sentence.length() > 500) {
                    if (currentPara.length() > 0) {
                        normalized.add(currentPara.toString().trim());
                        currentPara = new StringBuilder();
                    }
                }
                if (currentPara.length() > 0) currentPara.append(' ');
                currentPara.append(sentence);
            }
            if (currentPara.length() > 0) {
                normalized.add(currentPara.toString().trim());
            }
        }

        return normalized;
    }
    
    private String buildBodyHtml(List<String> paragraphs) {
        StringBuilder html = new StringBuilder();
        boolean hasSection = false;
        
        for (int i = 0; i < paragraphs.size(); i++) {
            String para = paragraphs.get(i);
            if (para.isEmpty()) continue;

            Heading heading = parseMarkdownHeading(para);
            if (heading != null) {
                if (hasSection) {
                    html.append("<hr>\n");
                }
                String tag = switch (heading.level) {
                    case 1 -> "h2"; // h1 já é o título do artigo
                    case 2 -> "h3";
                    case 3 -> "h4";
                    default -> "h4";
                };
                html.append(String.format("<%s>%s</%s>\n", tag, escapeHtml(heading.text), tag));
                hasSection = true;
                continue;
            }
            
            // Detecta se é um título de capítulo/seção
            if (isChapterTitle(para)) {
                if (hasSection) {
                    html.append("<hr>\n");
                }
                html.append(String.format("<h2>%s</h2>\n", escapeHtml(para)));
                hasSection = true;
            }
            // Detecta se é um versículo bíblico
            else if (isBibleVerse(para)) {
                html.append("<blockquote>").append(formatBibleVerse(escapeHtml(para))).append("</blockquote>\n");
            }
            // Detecta se é lista
            else if (isList(para)) {
                html.append(formatAsList(para));
            }
            // Parágrafo normal
            else {
                html.append("<p>").append(escapeHtmlWithBreaks(para)).append("</p>\n");
            }
        }
        return html.toString();
    }
    
    private boolean isMarkdownHeading(String text) {
        return text != null && MARKDOWN_HEADING.matcher(text.trim()).matches();
    }

    private Heading parseMarkdownHeading(String text) {
        if (text == null) return null;
        var m = MARKDOWN_HEADING.matcher(text.trim());
        if (!m.matches()) return null;
        int level = Math.min(6, m.group(1).length());
        String headingText = m.group(2) == null ? "" : m.group(2).trim();
        if (headingText.isEmpty()) return null;
        return new Heading(level, headingText);
    }

    private record Heading(int level, String text) {}

    private boolean isChapterTitle(String text) {
        if (text == null) return false;
        String t = text.trim();
        if (t.isEmpty()) return false;
        String lower = t.toLowerCase();
        if (lower.startsWith("capítulo") ||
                lower.startsWith("cap. ") ||
                lower.startsWith("parte ")) {
            return true;
        }
        if (t.matches("^\\d{1,3}[\\.)]\\s+.*")) {
            return true;
        }

        int wordCount = t.split("\\s+").length;
        boolean hasLetter = t.chars().anyMatch(Character::isLetter);
        boolean isAllCaps = hasLetter && t.equals(t.toUpperCase());

        if (t.endsWith(":") && wordCount >= 2 && t.length() >= 8) {
            return true;
        }
        return isAllCaps && wordCount <= 8 && t.length() <= 60;
    }
    
    private boolean isBibleVerse(String text) {
        return text.matches(".*[A-Za-z]+\\.?\\s*\\d+:\\d+.*") || // Ex: João 3:16
               text.contains("(") && text.contains(")") && text.length() < 200;
    }
    
    private boolean isList(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        String[] lines = text.split("\\n+");
        int matches = 0;
        for (String line : lines) {
            if (isListItemLine(line)) {
                matches++;
            }
        }
        return matches >= 1 && matches == lines.length;
    }
    
    private String formatAsList(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }

        String[] lines = text.split("\\n+");
        List<String> items = new ArrayList<>();
        boolean numbered = false;
        for (String line : lines) {
            if (!isListItemLine(line)) {
                continue;
            }
            String trimmed = line.trim();
            if (trimmed.matches("^\\d{1,3}[\\.)]\\s+.*")) {
                numbered = true;
            }
            String cleanItem = LIST_ITEM_PREFIX.matcher(trimmed).replaceFirst("").trim();
            if (!cleanItem.isEmpty()) {
                items.add(cleanItem);
            }
        }

        if (items.isEmpty()) {
            return "";
        }

        String tag = numbered ? "ol" : "ul";
        StringBuilder list = new StringBuilder();
        list.append(String.format("<%s style=\"margin:12px 0; padding-left:1.5rem; color:#333;\">%n", tag));
        for (String item : items) {
            list.append(String.format("""
                    <li style="margin:6px 0;">%s</li>
                    """, escapeHtml(item)));
        }
        list.append(String.format("</%s>", tag));
        return list.toString();
    }
    
    private String formatBibleVerse(String verse) {
        // Destaca a referência bíblica
        return verse.replaceAll("([A-Za-z]+\\s*\\d+:\\d+)", "<strong style=\"color:#4a6fa5;\">$1</strong>");
    }
    
    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&#39;");
    }

    private String escapeHtmlWithBreaks(String text) {
        if (text == null) return "";
        return escapeHtml(text).replace("\n", "<br/>");
    }

    private boolean isListItemLine(String line) {
        if (line == null) {
            return false;
        }
        String t = line.trim();
        if (t.isEmpty()) {
            return false;
        }
        return t.matches("^[•\\-*+]\\s+.+") || t.matches("^\\d{1,3}[\\.)]\\s+.+");
    }

    private int nextNonEmptyIndex(String[] lines, int start) {
        if (lines == null) {
            return -1;
        }
        for (int i = start; i < lines.length; i++) {
            String t = lines[i] == null ? "" : lines[i].trim();
            if (!t.isEmpty()) {
                return i;
            }
        }
        return -1;
    }
}
