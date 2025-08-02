package com.example.utils;

import java.io.IOException;

import com.example.App;
import com.example.configs.ApiCache;
import com.example.controllers.Controller;
import com.example.controllers.modal.ModalControllerAll;
import com.example.controllers.pages.MainController;
import com.example.models.user.UserModel;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXTextArea;

import javafx.animation.FadeTransition;
import javafx.application.Platform;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Circle;
import javafx.util.Duration;

public class ModalUtil {
 
    public static void Show(String modalFxml){
        try {
            MainController controller=(MainController) ApiCache.getTelaCache("main")[0];
            StackPane fundo=  controller.conteinerModal ;
            fundo.setVisible(true);
            Node modal=App.loadFXMLModal(modalFxml);
            ShowMethod(modal, fundo);
            
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void Show(String modalFxml,Runnable action){
        try {
            MainController controller=(MainController) ApiCache.getTelaCache("main")[0];
            StackPane fundo=  controller.conteinerModal ;
            fundo.setVisible(true);
            Node modal=App.loadFXMLModal(modalFxml);
            JFXButton botao= (JFXButton) modal.lookup("#back");
            botao.setOnMouseClicked(event -> {
                action.run();
            });
            ShowMethod(modal, fundo);
            
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


     public static void Show(String modalFxml,Controller controllerModal,AnchorPane content){
        try {
            MainController controller=(MainController) ApiCache.getTelaCache("main")[0];
            StackPane fundo=  controller.conteinerModal ;
            fundo.setVisible(true);
            Node modal=App.loadFXMLModal(modalFxml);
            if (ApiCache.getTelaCache(modalFxml)[0].getClass().equals(ModalControllerAll.class)) {
                ModalControllerAll modalControllerAll=(ModalControllerAll)ApiCache.getTelaCache(modalFxml)[0];
                modalControllerAll.setController(controllerModal);
                modalControllerAll.content=content;
            }
            
            ShowMethod(modal, fundo);
            
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void ShowMethod(Node modal,StackPane fundo){
       Platform.runLater(() -> {
        fundo.setMouseTransparent(false); // 🔥 Permite clique novamente
        if (!fundo.getChildren().contains(modal)) {
            // Em vez de fundo.getChildren().clear(), você pode só remover o modal anterior, se quiser
            fundo.getChildren().removeIf(node -> node.getId() != null && node.getId().equals("modal"));
        }
        JFXButton botao= (JFXButton) modal.lookup("#cancel");
        botao.setOnMouseClicked(event -> {
            Terminate(fundo);
        });
        fundo.setOpacity(0);
        fundo.getChildren().add(modal);
        FadeTrasitionUtil.Fade(0.5, fundo, 1, 0);
       });
    }

    public static void ShowComentario(StackPane fundo,String modalFxml,UserModel model,Runnable action){
        try {
            Node modal=App.loadFXMLModal(modalFxml);
            StackPane image=(StackPane) modal.lookup("#imagemCircular");
            image.setStyle(model.getImg().getStyle());
            image.setPrefSize(100, 100);
            image.setClip(new Circle(100/2,50/2,100/2));
            ((Label)modal.lookup("#nome")).setText(model.getName().getText());
            ((JFXTextArea)modal.lookup("#descricao")).setText(model.getDescricao().getText());
            JFXButton botao= (JFXButton) modal.lookup("#back");
            botao.setOnMouseClicked(event -> {
                action.run();
            });
            System.out.println("errr");
            ShowMethod(modal, fundo);
                        System.out.println("deu");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }


    public static void ShowTemporary(StackPane fundo,String modalFxml,String info,String info1){
        try {
            fundo.setOpacity(0);
            fundo.setVisible(true);
            fundo.getChildren().clear();
            Node modal=App.loadFXMLModalTempory(modalFxml,info,info1);
            fundo.getChildren().add(modal);
            
            FadeTransition fadeTransition = new FadeTransition(Duration.seconds(1.3), fundo);
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
            fundo.setMouseTransparent(true); // 🔥 Isso impede que ele bloqueie cliques
            fundo.getChildren().clear();
        });
    }
}
