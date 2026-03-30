package com.igreja.api.services;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.InscritosModel;
import com.igreja.api.models.ProgramacaoActividadeModel;

@Service
public class InscritosPdfService {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

    public byte[] buildFichaPdf(
            InscritosModel inscrito,
            ActividadeModel actividade,
            List<ProgramacaoActividadeModel> programacao,
            byte[] qrPng) throws Exception {
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            PDImageXObject qrImage = qrPng != null && qrPng.length > 0
                    ? PDImageXObject.createFromByteArray(doc, qrPng, "qr.png")
                    : null;

            float margin = 48f;
            float pageW = page.getMediaBox().getWidth();
            float pageH = page.getMediaBox().getHeight();
            float y = pageH - margin;

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                // Título
                y = writeLine(cs, PDType1Font.HELVETICA_BOLD, 18, margin, y, "Ficha de Inscrição");
                y -= 6;

                String actividadeNome = Optional.ofNullable(actividade.getTitulo()).orElse("-");
                String moderador = Optional.ofNullable(actividade.getOrganizador()).orElse("-");
                LocalDateTime inicio = actividade.getDataEvento();
                LocalDateTime fimPrevisto = computeFimPrevisto(programacao).orElse(null);

                // QR (direita)
                float qrSize = 160f;
                float qrX = pageW - margin - qrSize;
                float qrY = pageH - margin - qrSize + 6;
                if (qrImage != null) {
                    cs.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
                }

                // Dados da actividade
                y = writeLine(cs, PDType1Font.HELVETICA_BOLD, 12, margin, y, "Actividade");
                y = writeLine(cs, PDType1Font.HELVETICA, 11, margin, y, actividadeNome);
                y -= 6;

                y = writeKeyValue(cs, margin, y, "Moderador", moderador);
                y = writeKeyValue(cs, margin, y, "Data", inicio != null ? DATE.format(inicio) : "-");
                y = writeKeyValue(cs, margin, y, "Hora", inicio != null ? TIME.format(inicio) : "-");
                if (fimPrevisto != null) {
                    y = writeKeyValue(cs, margin, y, "Fim previsto", DATE.format(fimPrevisto) + " " + TIME.format(fimPrevisto));
                }
                y = writeKeyValue(cs, margin, y, "Código (ID)", String.valueOf(inscrito.getId()));
                y -= 8;

                // Dados do inscrito
                y = writeLine(cs, PDType1Font.HELVETICA_BOLD, 12, margin, y, "Inscrito");
                y = writeKeyValue(cs, margin, y, "Nome", Optional.ofNullable(inscrito.getNome()).orElse("-"));
                y = writeKeyValue(cs, margin, y, "Email", Optional.ofNullable(inscrito.getEmail()).orElse("-"));
                y = writeKeyValue(cs, margin, y, "Telefone", Optional.ofNullable(inscrito.getTelefone()).orElse("-"));
                y -= 10;

                // Programação
                y = writeLine(cs, PDType1Font.HELVETICA_BOLD, 12, margin, y, "Programação");
                if (programacao == null || programacao.isEmpty()) {
                    y = writeLine(cs, PDType1Font.HELVETICA, 11, margin, y, "Ainda não definida.");
                } else {
                    int maxLines = 20;
                    var sorted = programacao.stream()
                            .sorted(Comparator.comparing(ProgramacaoActividadeModel::getInicio))
                            .toList();

                    for (int i = 0; i < sorted.size() && i < maxLines; i++) {
                        ProgramacaoActividadeModel item = sorted.get(i);
                        LocalDateTime itemStart = item.getInicio();
                        String time = itemStart != null ? TIME.format(itemStart) : "--:--";
                        String date = itemStart != null ? DATE.format(itemStart) : "--/--/----";
                        String tipo = item.getTipo() != null ? item.getTipo().name() : "";
                        String titulo = Optional.ofNullable(item.getTitulo()).orElse("-");
                        String line = String.format(Locale.ROOT, "%s %s - %s%s",
                                date, time, titulo, tipo.isBlank() ? "" : " (" + tipo + ")");
                        y = writeLine(cs, PDType1Font.HELVETICA, 10.5f, margin, y, line);
                        if (y < margin + 60) break; // evita estourar a página no MVP
                    }
                }

                // Rodapé
                String footer = "Guarde este documento e apresente o QR no check-in.";
                writeLineAt(cs, PDType1Font.HELVETICA_OBLIQUE, 9.5f, margin, margin - 8, footer);
            }

            doc.save(out);
            return out.toByteArray();
        }
    }

    private Optional<LocalDateTime> computeFimPrevisto(List<ProgramacaoActividadeModel> programacao) {
        if (programacao == null || programacao.isEmpty()) return Optional.empty();
        return programacao.stream()
                .map(item -> item.getFim() != null ? item.getFim() : item.getInicio())
                .filter(t -> t != null)
                .max(LocalDateTime::compareTo);
    }

    private float writeKeyValue(PDPageContentStream cs, float x, float y, String key, String value) throws Exception {
        y = writeLine(cs, PDType1Font.HELVETICA_BOLD, 11, x, y, key + ":");
        y = writeLine(cs, PDType1Font.HELVETICA, 11, x + 64, y + 12, value == null ? "-" : value);
        return y - 2;
    }

    private float writeLine(PDPageContentStream cs, org.apache.pdfbox.pdmodel.font.PDFont font, float size, float x, float y, String text)
            throws Exception {
        writeLineAt(cs, font, size, x, y, text);
        return y - (size + 6);
    }

    private void writeLineAt(PDPageContentStream cs, org.apache.pdfbox.pdmodel.font.PDFont font, float size, float x, float y, String text)
            throws Exception {
        cs.beginText();
        cs.setFont(font, size);
        cs.newLineAtOffset(x, y);
        cs.showText(safe(text));
        cs.endText();
    }

    private String safe(String value) {
        if (value == null) return "";
        // PDFBox com Type1Font não suporta alguns unicode; sanitiza no MVP.
        return value.replaceAll("[\\r\\n\\t]+", " ").replace('\u00A0', ' ');
    }
}

