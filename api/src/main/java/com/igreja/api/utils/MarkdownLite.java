package com.igreja.api.utils;

import java.util.ArrayList;
import java.util.List;

public class MarkdownLite {
    private MarkdownLite() {}

    public static String toSafeHtml(String markdown) {
        String input = markdown == null ? "" : markdown.replace("\r\n", "\n").trim();
        if (input.isBlank()) {
            return "";
        }

        List<String> lines = List.of(input.split("\n"));
        StringBuilder html = new StringBuilder();

        List<String> currentParagraph = new ArrayList<>();
        List<String> currentList = new ArrayList<>();

        for (String rawLine : lines) {
            String line = rawLine == null ? "" : rawLine.trim();

            if (line.isBlank()) {
                flushList(html, currentList);
                flushParagraph(html, currentParagraph);
                continue;
            }

            if (line.startsWith("### ")) {
                flushList(html, currentList);
                flushParagraph(html, currentParagraph);
                html.append("<h3 class=\"text-primary font-bold\">")
                        .append(formatInline(line.substring(4)))
                        .append("</h3>");
                continue;
            }
            if (line.startsWith("## ")) {
                flushList(html, currentList);
                flushParagraph(html, currentParagraph);
                html.append("<h2 class=\"text-primary font-bold\">")
                        .append(formatInline(line.substring(3)))
                        .append("</h2>");
                continue;
            }
            if (line.startsWith("# ")) {
                flushList(html, currentList);
                flushParagraph(html, currentParagraph);
                html.append("<h1 class=\"text-primary font-bold\">")
                        .append(formatInline(line.substring(2)))
                        .append("</h1>");
                continue;
            }

            if (line.startsWith("- ") || line.startsWith("* ")) {
                flushParagraph(html, currentParagraph);
                currentList.add(line.substring(2));
                continue;
            }

            if (line.startsWith("> ")) {
                flushList(html, currentList);
                flushParagraph(html, currentParagraph);
                html.append("<blockquote><p>")
                        .append(formatInline(line.substring(2)))
                        .append("</p></blockquote>");
                continue;
            }

            currentParagraph.add(line);
        }

        flushList(html, currentList);
        flushParagraph(html, currentParagraph);

        return html.toString();
    }

    private static void flushParagraph(StringBuilder html, List<String> paragraphLines) {
        if (paragraphLines.isEmpty()) {
            return;
        }
        String joined = String.join(" ", paragraphLines).trim();
        if (!joined.isBlank()) {
            html.append("<p>").append(formatInline(joined)).append("</p>");
        }
        paragraphLines.clear();
    }

    private static void flushList(StringBuilder html, List<String> items) {
        if (items.isEmpty()) {
            return;
        }
        html.append("<ul class=\"list-disc pl-6\">");
        for (String item : items) {
            String value = item == null ? "" : item.trim();
            if (!value.isBlank()) {
                html.append("<li>").append(formatInline(value)).append("</li>");
            }
        }
        html.append("</ul>");
        items.clear();
    }

    private static String formatInline(String text) {
        // Começa escapando tudo, depois aplica apenas marcações seguras que nós geramos.
        String escaped = escape(text);
        // Bold: **texto**
        // Regras simples (não suporta nesting complexo de propósito)
        return escaped.replaceAll("\\*\\*(.+?)\\*\\*", "<strong>$1</strong>");
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
