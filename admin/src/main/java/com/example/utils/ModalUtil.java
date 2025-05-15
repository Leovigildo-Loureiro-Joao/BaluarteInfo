package com.example.utils;

import java.io.IOException;

import com.example.App;
import com.jfoenix.controls.JFXButton;

import javafx.animation.FadeTransition;
import javafx.application.Platform;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.layout.StackPane;
import javafx.util.Duration;

public class ModalUtil {
 
    public static void Show(StackPane fundo,String modalFxml){
        try {

            fundo.setVisible(true);
            fundo.getChildren().clear();
            Node modal=App.loadFXMLModal(modalFxml);
            JFXButton botao= (JFXButton) modal.lookup("#cancel");
            botao.setOnMouseClicked(event -> {
                Terminate(fundo);
            });
            modal.setOpacity(0);
            fundo.getChildren().add(modal);
            FadeTransition fadeTransition = new FadeTransition(Duration.seconds(0.5), modal);
            fadeTransition.setDelay(Duration.seconds(0.5));
            fadeTransition.setFromValue(0);
            fadeTransition.setToValue(1);
            fadeTransition.play();
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }


    public static void ShowTemporary(StackPane fundo,String modalFxml){
        try {
            fundo.setOpacity(0);
            fundo.setVisible(true);
            fundo.getChildren().clear();
            Node modal=App.loadFXMLModal(modalFxml);
            fundo.getChildren().add(modal);
            
            FadeTransition fadeTransition = new FadeTransition(Duration.seconds(0.5), fundo);
            fadeTransition.setFromValue(0);
            fadeTransition.setToValue(1);
            fadeTransition.play();
            fadeTransition.setOnFinished(event -> {
                Terminate(fundo);
            });
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    private static void Terminate(StackPane fundo){
      
        FadeTransition opacityTransition = new FadeTransition(Duration.seconds(0.5), fundo);
        opacityTransition.setFromValue(1);
        opacityTransition.setToValue(0);
        opacityTransition.play();
        opacityTransition.setOnFinished(e -> {
            fundo.setVisible(false);
            fundo.getChildren().clear();
        });
    }
}
