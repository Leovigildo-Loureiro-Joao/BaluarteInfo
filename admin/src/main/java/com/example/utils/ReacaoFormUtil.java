package com.example.utils;

import com.example.App;

import javafx.animation.FadeTransition;
import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;

public class ReacaoFormUtil {

    public static void Reagir(String type, String infoText, ImageView img, Label info) {
        Platform.runLater(() -> {
            HBox box = (HBox) info.getParent();
            info.setText(infoText);
            box.getStyleClass().clear();
            box.getStyleClass().add(type);
            box.getStyleClass().add("reacap");
            img.setImage(new Image(App.class.getResourceAsStream("assets/" + type + ".png")));

            // Cancela animações anteriores (se houver)
            box.getProperties().remove("fadeTransition");
            
            FadeTransition fadeOut = FadeTrasitionUtil.Fade(0.3, box, 1, 0);
            fadeOut.setOnFinished(event -> {
                FadeTransition fadeIn = FadeTrasitionUtil.Fade(1, box, 0, 1);
                box.getProperties().put("fadeTransition", fadeIn);
                fadeIn.play();
            });
            box.getProperties().put("fadeTransition", fadeOut);
            fadeOut.play();
        });
    }
    
}
