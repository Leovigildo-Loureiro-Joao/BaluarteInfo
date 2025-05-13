package com.example.utils;

import java.io.IOException;

import com.example.App;

import javafx.animation.FadeTransition;
import javafx.scene.Parent;
import javafx.scene.layout.StackPane;
import javafx.util.Duration;

public class ModalUtil {
 
    public static void Show(StackPane fundo,String modalFxml){
        try {

            fundo.setVisible(true);
            fundo.getChildren().clear();
            Parent modal=App.loadFXMLModal(modalFxml);
            modal.setOpacity(0);
            fundo.getChildren().add(modal);
            FadeTransition fadeTransition = new FadeTransition(Duration.seconds(1.5), modal);
            fadeTransition.setDelay(Duration.seconds(1.5));
            fadeTransition.setFromValue(0);
            fadeTransition.setToValue(1);
            fadeTransition.play();
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
}
