package com.igreja.api.utils;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

public class PdfUtils {
    public static String extractCoverImage(InputStream pdfPath,String filename) throws IOException {
        try (PDDocument document = PDDocument.load(pdfPath)) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            BufferedImage image = pdfRenderer.renderImageWithDPI(0, 300); // Renderiza a primeira página em 300 DPI
            File outputFile = new File(filename); // Define o caminho de saída para a imagem
            ImageIO.write(image, "png", outputFile); // Salva a imagem como PNG
            return outputFile.getAbsolutePath(); // Retorna o caminho da imagem gerada
        }
    }
}
