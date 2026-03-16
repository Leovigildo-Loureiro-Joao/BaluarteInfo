package com.igreja.api.utils;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.net.URL;
import java.net.URLConnection;

public class PdfUtils {

    private static final ExecutorService pdfRenderingExecutor = 
        Executors.newVirtualThreadPerTaskExecutor(); // Pool dedicado para renderização

    private static final Pattern BLANK_LINE = Pattern.compile("\\n\\s*\\n+");
    private static final Pattern BULLET_LINE = Pattern.compile("^(?:[•\\-*–—]|\\u2022)\\s+(.+)$");
    private static final Pattern NUMBERED_LINE = Pattern.compile("^(\\d{1,3})[\\.)]\\s+(.+)$");
    private static final Pattern PAGE_NUMBER_LINE = Pattern.compile(
            "^(?:\\d{1,3}|(?:p[aá]gina|page)\\s*\\d{1,3}|\\d{1,3}\\s*/\\s*\\d{1,3})$",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);

    /**
     * Extrai a capa do PDF de forma assíncrona.
     * Ideal para integração com pipelines não-bloqueantes.
     * @throws TimeoutException 
     * @throws ExecutionException 
     * @throws InterruptedException 
     */
    public static BufferedImage extractCoverImageAsync(InputStream pdfStream) throws InterruptedException, ExecutionException, TimeoutException {
        return pdfRenderingExecutor.submit(() -> {
            try (PDDocument document = PDDocument.load(pdfStream)) {
                PDFRenderer renderer = new PDFRenderer(document);
                return renderer.renderImageWithDPI(0, 150); // DPI ajustável para qualidade
            } catch (IOException e) {
                throw new RuntimeException("Falha ao renderizar capa do PDF", e);
            }
        }).get(10, TimeUnit.SECONDS); // Timeout de 10 segundos
    }

    /**
     * Versão síncrona com otimizações para uso em threads dedicadas.
     * - Fecha recursos automaticamente com try-with-resources
     * - Suporte a configuração de DPI
     */
    public static BufferedImage extractCoverImage(InputStream pdfStream, int dpi) throws IOException {
        try (PDDocument document = PDDocument.load(pdfStream)) {
            PDFRenderer renderer = new PDFRenderer(document);
            return renderer.renderImageWithDPI(0, dpi); // Melhor qualidade que renderImage()
        }
    }

      public static String extractText(InputStream inputStream, int maxPages) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            
            int totalPages = document.getNumberOfPages();
            int pagesToExtract = Math.min(maxPages, totalPages);
            
            stripper.setStartPage(1);
            stripper.setEndPage(pagesToExtract);
            stripper.setLineSeparator("\n");
            stripper.setParagraphStart("\n\n");
            
            String text = stripper.getText(document);
            
            // Limpeza básica do texto (preservando quebras de linha)
            String cleaned = text == null ? "" : text;
            cleaned = cleaned.replace("\r\n", "\n").replace('\r', '\n');
            cleaned = cleaned.replace('\u00A0', ' ');
            // Normaliza espaços inline sem destruir \n
            cleaned = cleaned.replaceAll("[ \\t\\f\\u000B]+", " ");
            // Remove espaços no início/fim de cada linha
            cleaned = cleaned.replaceAll("(?m)^[ \\t]+", "");
            cleaned = cleaned.replaceAll("(?m)[ \\t]+$", "");
            // Colapsa múltiplas linhas em branco
            cleaned = cleaned.replaceAll("\\n{3,}", "\n\n");
            return cleaned.trim();
        }
    }

    /**
     * Overload para DPI padrão (150)
     */
    public static BufferedImage extractCoverImage(InputStream pdfStream) throws IOException {
        return extractCoverImage(pdfStream, 150);
    }

    /**
     * Extrai texto do PDF e converte para HTML simples.
     * - Quebras de parágrafo viram <p>...</p>
     * - Quebras de linha viram <br/>
     */
    public static String extractHtml(InputStream pdfStream) throws IOException {
        return extractHtml(pdfStream, 0);
    }

    /**
     * Extrai texto do PDF e converte para HTML simples, limitando a quantidade de páginas.
     * @param maxPages Se <= 0, extrai todas as páginas. Se > 0, extrai no máximo as primeiras N páginas.
     */
    public static String extractHtml(InputStream pdfStream, int maxPages) throws IOException {
        try (PDDocument document = PDDocument.load(pdfStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            stripper.setShouldSeparateByBeads(true);
            stripper.setLineSeparator("\n");

            List<String> pages = new ArrayList<>();
            int totalPages = document.getNumberOfPages();
            int endPage = maxPages <= 0 ? totalPages : Math.min(totalPages, maxPages);
            for (int page = 1; page <= endPage; page++) {
                stripper.setStartPage(page);
                stripper.setEndPage(page);
                pages.add(stripper.getText(document));
            }

            List<String> cleanedPages = stripRepeatingHeadersFootersPerPage(pages);
            return pagesToHtml(cleanedPages);
        }
    }

    /**
     * Extrai HTML diretamente a partir de uma URL de PDF.
     */
    public static String extractHtmlFromUrl(String pdfUrl) throws IOException {
        try (InputStream in = openUrlStream(pdfUrl)) {
            return extractHtml(in, 0);
        }
    }

    /**
     * Extrai HTML diretamente a partir de uma URL de PDF, limitando a quantidade de páginas.
     */
    public static String extractHtmlFromUrl(String pdfUrl, int maxPages) throws IOException {
        try (InputStream in = openUrlStream(pdfUrl)) {
            return extractHtml(in, maxPages);
        }
    }

    /**
     * Extrai texto diretamente a partir de uma URL de PDF, limitando a quantidade de páginas.
     */
    public static String extractTextFromUrl(String pdfUrl, int maxPages) throws IOException {
        try (InputStream in = openUrlStream(pdfUrl)) {
            return extractText(in, maxPages);
        }
    }

    private static InputStream openUrlStream(String url) throws IOException {
        if (url == null || url.isBlank()) {
            throw new IOException("URL do PDF vazia.");
        }
        URLConnection conn = new URL(url).openConnection();
        conn.setConnectTimeout((int) TimeUnit.SECONDS.toMillis(10));
        conn.setReadTimeout((int) TimeUnit.SECONDS.toMillis(60));
        try {
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
        } catch (Exception ignored) {
            // Alguns protocolos/impls podem não suportar headers.
        }
        return conn.getInputStream();
    }

    private static String pagesToHtml(List<String> pages) {
        if (pages == null || pages.isEmpty()) {
            return "";
        }
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < pages.size(); i++) {
            String pageText = pages.get(i);
            String pageHtml = toHtml(pageText);
            if (!pageHtml.isBlank()) {
                out.append(pageHtml);
            }
            if (i < pages.size() - 1) {
                out.append("<hr class=\"pdf-page-break\"/>");
            }
        }
        return out.toString();
    }

    private static String toHtml(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }

        String normalized = text.replace("\r\n", "\n").replace('\r', '\n');
        String[] paragraphs = BLANK_LINE.split(normalized);
        StringBuilder html = new StringBuilder();

        for (String paragraph : paragraphs) {
            String trimmed = paragraph.trim();
            if (trimmed.isEmpty()) {
                continue;
            }

            List<String> lines = splitNonEmptyLines(trimmed);
            if (lines.isEmpty()) {
                continue;
            }

            if (isBulletList(lines)) {
                html.append("<ul>");
                for (String line : lines) {
                    var m = BULLET_LINE.matcher(line);
                    String item = m.matches() ? m.group(1) : line;
                    html.append("<li>").append(escapeHtml(normalizeInline(item))).append("</li>");
                }
                html.append("</ul>");
                continue;
            }

            if (isNumberedList(lines)) {
                html.append("<ol>");
                for (String line : lines) {
                    var m = NUMBERED_LINE.matcher(line);
                    String item = m.matches() ? m.group(2) : line;
                    html.append("<li>").append(escapeHtml(normalizeInline(item))).append("</li>");
                }
                html.append("</ol>");
                continue;
            }

            if (looksLikeHeading(lines)) {
                html.append("<h2>").append(escapeHtml(normalizeInline(lines.get(0)))).append("</h2>");
                continue;
            }

            String joined = joinLinesSmart(lines);
            html.append("<p>").append(escapeHtml(normalizeInline(joined))).append("</p>");
        }

        return html.toString();
    }

    private static List<String> splitNonEmptyLines(String block) {
        String[] rawLines = block.split("\\n+");
        List<String> lines = new ArrayList<>(rawLines.length);
        for (String raw : rawLines) {
            String line = raw.trim();
            if (!line.isEmpty()) {
                lines.add(line);
            }
        }
        return lines;
    }

    private static boolean isBulletList(List<String> lines) {
        if (lines.size() < 2) {
            return false;
        }
        int bulletCount = 0;
        for (String line : lines) {
            if (BULLET_LINE.matcher(line).matches()) {
                bulletCount++;
            }
        }
        return bulletCount == lines.size();
    }

    private static boolean isNumberedList(List<String> lines) {
        if (lines.size() < 2) {
            return false;
        }
        int numberedCount = 0;
        for (String line : lines) {
            if (NUMBERED_LINE.matcher(line).matches()) {
                numberedCount++;
            }
        }
        return numberedCount == lines.size();
    }

    private static boolean looksLikeHeading(List<String> lines) {
        if (lines.size() != 1) {
            return false;
        }
        String line = lines.get(0).trim();
        if (line.length() < 4 || line.length() > 80) {
            return false;
        }
        String noDigits = line.replaceAll("\\d", "");
        boolean hasLetter = noDigits.chars().anyMatch(Character::isLetter);
        if (!hasLetter) {
            return false;
        }
        boolean endsWithColon = line.endsWith(":");
        boolean isAllCaps = line.equals(line.toUpperCase(Locale.ROOT));
        return endsWithColon || isAllCaps;
    }

    private static String joinLinesSmart(List<String> lines) {
        StringBuilder out = new StringBuilder();
        String prev = null;

        for (String line : lines) {
            if (prev == null) {
                out.append(line);
                prev = line;
                continue;
            }

            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                continue;
            }

            int lastIdx = out.length() - 1;
            char lastChar = lastIdx >= 0 ? out.charAt(lastIdx) : '\0';
            boolean prevEndsWithHyphen = lastChar == '-' || lastChar == '\u2010' || lastChar == '\u2011';
            boolean nextStartsLower = !trimmed.isEmpty() && Character.isLowerCase(trimmed.charAt(0));

            if (prevEndsWithHyphen && nextStartsLower) {
                out.deleteCharAt(lastIdx);
                out.append(trimmed);
            } else {
                out.append(' ').append(trimmed);
            }

            prev = trimmed;
        }

        return out.toString();
    }

    private static String normalizeInline(String input) {
        if (input == null) {
            return "";
        }
        String s = input.replace('\u00A0', ' ').trim();
        s = s.replaceAll("\\s+", " ");
        s = s.replaceAll("\\s+([,.;:!?])", "$1");
        return s;
    }

    private static String escapeHtml(String input) {
        StringBuilder builder = new StringBuilder(input.length());
        for (int i = 0; i < input.length(); i++) {
            char ch = input.charAt(i);
            switch (ch) {
                case '&' -> builder.append("&amp;");
                case '<' -> builder.append("&lt;");
                case '>' -> builder.append("&gt;");
                case '"' -> builder.append("&quot;");
                case '\'' -> builder.append("&#39;");
                default -> builder.append(ch);
            }
        }
        return builder.toString();
    }

    private static String stripRepeatingHeadersFooters(List<String> pageTexts) {
        List<String> cleaned = stripRepeatingHeadersFootersPerPage(pageTexts);
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < cleaned.size(); i++) {
            String page = cleaned.get(i);
            if (page == null) continue;
            out.append(page.trim());
            if (i < cleaned.size() - 1) {
                out.append("\n\n");
            }
        }
        return out.toString().trim();
    }

    private static List<String> stripRepeatingHeadersFootersPerPage(List<String> pageTexts) {
        if (pageTexts == null || pageTexts.isEmpty()) {
            return List.of();
        }

        List<List<String>> linesByPage = new ArrayList<>(pageTexts.size());
        Map<String, Integer> headerCounts = new HashMap<>();
        Map<String, Integer> footerCounts = new HashMap<>();

        for (String pageText : pageTexts) {
            String normalized = (pageText == null) ? "" : pageText.replace("\r\n", "\n").replace('\r', '\n');
            List<String> lines = splitPreserveOrder(normalized);
            linesByPage.add(lines);

            List<String> header = firstNonEmptyLines(lines, 2);
            for (String line : header) {
                String key = normalizeHeaderFooterKey(line);
                if (key.isEmpty() || isPageNumberLine(key)) continue;
                headerCounts.put(key, headerCounts.getOrDefault(key, 0) + 1);
            }

            List<String> footer = lastNonEmptyLines(lines, 2);
            for (String line : footer) {
                String key = normalizeHeaderFooterKey(line);
                if (key.isEmpty() || isPageNumberLine(key)) continue;
                footerCounts.put(key, footerCounts.getOrDefault(key, 0) + 1);
            }
        }

        int threshold = Math.max(2, (int) Math.ceil(pageTexts.size() * 0.6));
        Set<String> repeatingHeaders = keysAtLeast(headerCounts, threshold);
        Set<String> repeatingFooters = keysAtLeast(footerCounts, threshold);

        List<String> cleanedPages = new ArrayList<>(linesByPage.size());
        for (List<String> lines : linesByPage) {
            StringBuilder pageOut = new StringBuilder();
            for (String line : lines) {
                String key = normalizeHeaderFooterKey(line);
                if (key.isEmpty()) {
                    pageOut.append('\n');
                    continue;
                }
                if (isPageNumberLine(key) || repeatingHeaders.contains(key) || repeatingFooters.contains(key)) {
                    continue;
                }
                pageOut.append(line).append('\n');
            }
            cleanedPages.add(pageOut.toString().trim());
        }

        return cleanedPages;
    }

    private static List<String> splitPreserveOrder(String text) {
        String[] rawLines = (text == null) ? new String[0] : text.split("\\n", -1);
        List<String> lines = new ArrayList<>(rawLines.length);
        for (String raw : rawLines) {
            lines.add(raw == null ? "" : raw);
        }
        return lines;
    }

    private static List<String> firstNonEmptyLines(List<String> lines, int max) {
        List<String> result = new ArrayList<>(max);
        for (String line : lines) {
            String t = (line == null) ? "" : line.trim();
            if (t.isEmpty()) continue;
            result.add(t);
            if (result.size() >= max) break;
        }
        return result;
    }

    private static List<String> lastNonEmptyLines(List<String> lines, int max) {
        List<String> result = new ArrayList<>(max);
        for (int i = lines.size() - 1; i >= 0; i--) {
            String t = (lines.get(i) == null) ? "" : lines.get(i).trim();
            if (t.isEmpty()) continue;
            result.add(t);
            if (result.size() >= max) break;
        }
        // reverse
        for (int i = 0, j = result.size() - 1; i < j; i++, j--) {
            String tmp = result.get(i);
            result.set(i, result.get(j));
            result.set(j, tmp);
        }
        return result;
    }

    private static String normalizeHeaderFooterKey(String line) {
        if (line == null) return "";
        String s = line.replace('\u00A0', ' ').trim();
        s = s.replaceAll("\\s+", " ");
        if (s.length() > 90) {
            return "";
        }
        return s;
    }

    private static boolean isPageNumberLine(String line) {
        if (line == null) return false;
        String s = line.replace('\u00A0', ' ').trim();
        if (s.isEmpty()) return false;
        return PAGE_NUMBER_LINE.matcher(s).matches();
    }

    private static Set<String> keysAtLeast(Map<String, Integer> counts, int threshold) {
        Set<String> keys = new HashSet<>();
        for (Map.Entry<String, Integer> e : counts.entrySet()) {
            if (e.getValue() >= threshold) {
                keys.add(e.getKey());
            }
        }
        return keys;
    }

    // Fecha o pool de threads quando não for mais necessário
    public static void shutdown() {
        pdfRenderingExecutor.shutdown();
    }
}
