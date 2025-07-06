package com.example.utils;

import com.example.App;

import javafx.animation.FadeTransition;
import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;

public class ReacaoFormUtil {

    public static void Reagir(String type,String infoText,ImageView img,Label info){
       Platform.runLater(() -> {
            HBox box=(HBox) info.getParent();
            info.setText(infoText);
            box.getStyleClass().clear();
            box.getStyleClass().add(type);
            box.getStyleClass().add("reacap");
            img.setImage(new Image(App.class.getResourceAsStream("assets/"+type+".png")));
            FadeTransition fade =FadeTrasitionUtil.Fade(.3, box, 1, 0);
            fade.setOnFinished(event -> {
                FadeTrasitionUtil.Fade(5, box, 0, 1);
            });
        });
    }
    
}
