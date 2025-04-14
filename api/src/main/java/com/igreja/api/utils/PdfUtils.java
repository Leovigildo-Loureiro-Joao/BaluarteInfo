package com.igreja.api.utils;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class PdfUtils {

    private static final ExecutorService pdfRenderingExecutor = 
        Executors.newVirtualThreadPerTaskExecutor(); // Pool dedicado para renderização

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

    /**
     * Overload para DPI padrão (150)
     */
    public static BufferedImage extractCoverImage(InputStream pdfStream) throws IOException {
        return extractCoverImage(pdfStream, 150);
    }

    // Fecha o pool de threads quando não for mais necessário
    public static void shutdown() {
        pdfRenderingExecutor.shutdown();
    }
}