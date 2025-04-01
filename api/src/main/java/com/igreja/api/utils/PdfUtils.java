package com.igreja.api.utils;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

public class PdfUtils {
    public static String extractCoverImage(String pdfPath, String outputImagePath,String filename) throws IOException {
        try (PDDocument document = PDDocument.load(new File(pdfPath))) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            BufferedImage image = pdfRenderer.renderImageWithDPI(0, 300); // Renderiza a primeira página em 300 DPI
            File outputFile = new File(outputImagePath+filename);
            ImageIO.write(image, "png", outputFile); // Salva a imagem como PNG
            return outputFile.getAbsolutePath(); // Retorna o caminho da imagem gerada
        }
    }
}
