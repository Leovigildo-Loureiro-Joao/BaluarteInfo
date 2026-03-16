package com.igreja.api.utils;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.imageio.ImageIO;

public class AvatarUtils {
    private static final int SIZE = 128;

    private AvatarUtils() {}

    public static String resolveAvatar(String existingUrl, String email, String nome) {
        if (existingUrl != null && !existingUrl.isBlank()) {
            return existingUrl;
        }
        String seed = (email != null && !email.isBlank()) ? email : (nome != null ? nome : "user");
        String initials = initials(nome, email);
        Color bg = backgroundColor(seed);
        return pngDataUrl(bg, initials);
    }

    private static String initials(String nome, String email) {
        String source = (nome != null && !nome.isBlank()) ? nome.trim() : (email != null ? email.trim() : "");
        if (source.isBlank()) {
            return "U";
        }

        if (source.contains("@")) {
            source = source.substring(0, source.indexOf("@"));
        }

        String[] parts = source.replaceAll("[^\\p{L}\\p{N}\\s]", " ").trim().split("\\s+");
        if (parts.length == 0 || parts[0].isBlank()) {
            return "U";
        }
        if (parts.length == 1) {
            String p = parts[0];
            return p.substring(0, Math.min(2, p.length())).toUpperCase();
        }
        String a = parts[0].substring(0, 1);
        String b = parts[parts.length - 1].substring(0, 1);
        return (a + b).toUpperCase();
    }

    private static Color backgroundColor(String seed) {
        byte[] hash = sha256(seed.toLowerCase());
        int r = Byte.toUnsignedInt(hash[0]);
        int g = Byte.toUnsignedInt(hash[1]);
        int b = Byte.toUnsignedInt(hash[2]);
        // suaviza a cor para não ficar muito escura/clara
        r = (r + 80) / 2;
        g = (g + 80) / 2;
        b = (b + 80) / 2;
        return new Color(r, g, b);
    }

    private static byte[] sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 não disponível", e);
        }
    }

    private static String pngDataUrl(Color background, String initials) {
        try {
            BufferedImage image = new BufferedImage(SIZE, SIZE, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g = image.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            g.setColor(background);
            g.fillOval(0, 0, SIZE, SIZE);

            int fontSize = initials.length() == 1 ? 64 : 54;
            g.setFont(new Font("SansSerif", Font.BOLD, fontSize));
            g.setColor(Color.WHITE);
            FontMetrics fm = g.getFontMetrics();
            int textWidth = fm.stringWidth(initials);
            int textHeight = fm.getAscent();
            int x = (SIZE - textWidth) / 2;
            int y = (SIZE + textHeight) / 2 - 8;
            g.drawString(initials, x, y);
            g.dispose();

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, "png", out);
            String base64 = Base64.getEncoder().encodeToString(out.toByteArray());
            return "data:image/png;base64," + base64;
        } catch (Exception e) {
            // fallback bem simples
            return "";
        }
    }
}

