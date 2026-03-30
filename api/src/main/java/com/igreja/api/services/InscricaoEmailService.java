package com.igreja.api.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.InscritosModel;
import com.igreja.api.models.ProgramacaoActividadeModel;

import jakarta.mail.internet.MimeMessage;

@Service
public class InscricaoEmailService {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public InscricaoEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendFichaInscricao(
            InscritosModel inscrito,
            ActividadeModel actividade,
            List<ProgramacaoActividadeModel> programacao,
            byte[] qrPng,
            byte[] pdfBytes) throws Exception {
        String destino = Optional.ofNullable(inscrito.getEmail()).orElse("").trim();
        if (destino.isBlank()) return;

        String assunto = "Ficha de inscrição - " + Optional.ofNullable(actividade.getTitulo()).orElse("Actividade");

        String html = buildHtml(inscrito, actividade, programacao);
        String plain = buildPlain(inscrito, actividade, programacao);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(from);
        helper.setTo(destino);
        helper.setSubject(assunto);
        helper.setText(plain, html);

        if (pdfBytes != null && pdfBytes.length > 0) {
            helper.addAttachment("ficha-inscricao.pdf", new ByteArrayResource(pdfBytes), "application/pdf");
        }
        if (qrPng != null && qrPng.length > 0) {
            helper.addAttachment("qr-inscricao.png", new ByteArrayResource(qrPng), "image/png");
        }

        mailSender.send(message);
    }

    private String buildPlain(InscritosModel inscrito, ActividadeModel actividade, List<ProgramacaoActividadeModel> programacao) {
        StringBuilder sb = new StringBuilder();
        sb.append("Ficha de inscrição\n\n");
        sb.append("Actividade: ").append(n(actividade.getTitulo())).append("\n");
        sb.append("Moderador: ").append(n(actividade.getOrganizador())).append("\n");
        LocalDateTime inicio = actividade.getDataEvento();
        if (inicio != null) {
            sb.append("Data/Hora: ").append(DATE.format(inicio)).append(" ").append(TIME.format(inicio)).append("\n");
        }
        sb.append("\nInscrito\n");
        sb.append("Nome: ").append(n(inscrito.getNome())).append("\n");
        sb.append("Email: ").append(n(inscrito.getEmail())).append("\n");
        sb.append("Telefone: ").append(n(inscrito.getTelefone())).append("\n");
        sb.append("ID: ").append(inscrito.getId()).append("\n");
        sb.append("\nProgramação\n");
        sb.append(programacaoToPlain(programacao));
        sb.append("\n\nAnexo: ficha-inscricao.pdf");
        return sb.toString();
    }

    private String buildHtml(InscritosModel inscrito, ActividadeModel actividade, List<ProgramacaoActividadeModel> programacao) {
        LocalDateTime inicio = actividade.getDataEvento();
        String dataHora = inicio == null ? "-" : (DATE.format(inicio) + " " + TIME.format(inicio));

        StringBuilder out = new StringBuilder();
        out.append("<div style=\"font-family:Arial,sans-serif;line-height:1.5;color:#111827\">");
        out.append("<h2 style=\"margin:0 0 8px\">Ficha de inscrição</h2>");
        out.append("<p style=\"margin:0 0 10px\">Segue a sua ficha e o QR em anexo (PDF).</p>");
        out.append("<div style=\"padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb\">");
        out.append("<p style=\"margin:0\"><b>Actividade:</b> ").append(esc(n(actividade.getTitulo()))).append("</p>");
        out.append("<p style=\"margin:6px 0 0\"><b>Moderador:</b> ").append(esc(n(actividade.getOrganizador()))).append("</p>");
        out.append("<p style=\"margin:6px 0 0\"><b>Data/Hora:</b> ").append(esc(dataHora)).append("</p>");
        out.append("</div>");

        out.append("<h3 style=\"margin:16px 0 8px\">Inscrito</h3>");
        out.append("<ul style=\"margin:0;padding-left:18px\">");
        out.append("<li><b>Nome:</b> ").append(esc(n(inscrito.getNome()))).append("</li>");
        out.append("<li><b>Email:</b> ").append(esc(n(inscrito.getEmail()))).append("</li>");
        out.append("<li><b>Telefone:</b> ").append(esc(n(inscrito.getTelefone()))).append("</li>");
        out.append("<li><b>ID:</b> ").append(inscrito.getId()).append("</li>");
        out.append("</ul>");

        out.append("<h3 style=\"margin:16px 0 8px\">Programação</h3>");
        out.append(programacaoToHtml(programacao));
        out.append("<p style=\"margin:16px 0 0;color:#6b7280;font-size:12px\">Apresente o QR no check-in.</p>");
        out.append("</div>");
        return out.toString();
    }

    private String programacaoToPlain(List<ProgramacaoActividadeModel> programacao) {
        if (programacao == null || programacao.isEmpty()) return "Ainda não definida.\n";
        var sorted = programacao.stream().sorted(Comparator.comparing(ProgramacaoActividadeModel::getInicio)).toList();
        StringBuilder sb = new StringBuilder();
        for (var item : sorted) {
            LocalDateTime start = item.getInicio();
            String when = start == null ? "-" : (DATE.format(start) + " " + TIME.format(start));
            String tipo = item.getTipo() == null ? "" : " (" + item.getTipo().name() + ")";
            sb.append("- ").append(when).append(" - ").append(n(item.getTitulo())).append(tipo).append("\n");
        }
        return sb.toString();
    }

    private String programacaoToHtml(List<ProgramacaoActividadeModel> programacao) {
        if (programacao == null || programacao.isEmpty()) return "<p style=\"margin:0\">Ainda não definida.</p>";
        var sorted = programacao.stream().sorted(Comparator.comparing(ProgramacaoActividadeModel::getInicio)).toList();
        StringBuilder sb = new StringBuilder();
        sb.append("<ul style=\"margin:0;padding-left:18px\">");
        for (var item : sorted) {
            LocalDateTime start = item.getInicio();
            String when = start == null ? "-" : (DATE.format(start) + " " + TIME.format(start));
            String tipo = item.getTipo() == null ? "" : " (" + item.getTipo().name() + ")";
            sb.append("<li><b>").append(esc(when)).append("</b> - ").append(esc(n(item.getTitulo()))).append(esc(tipo)).append("</li>");
        }
        sb.append("</ul>");
        return sb.toString();
    }

    private String n(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }

    private String esc(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
