package com.example.dto.midia;




import java.io.IOException;

import com.example.services.ActividadeService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jfoenix.controls.JFXButton;

import javafx.application.Platform;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;

public record MidiaSimple(int id,String titulo,String url) {

    public static MidiaSimple fromJson(String resposta) {
       try {
            Gson gson = new GsonBuilder()
                .create();
            return gson.fromJson(resposta, MidiaSimple.class);
        } catch (Exception e) {
           return null;
        }
    }

public VBox GaleriaImage() {
    // Container principal
    VBox vb = new VBox();
    vb.setPrefSize(200, 250); // Tamanho padrão do card
    vb.setMaxSize(200, 250);
    vb.setStyle("-fx-background-color: white; -fx-border-color: #ddd; -fx-border-radius: 8; -fx-background-radius: 8;");
    vb.setAlignment(Pos.TOP_CENTER);
    vb.setSpacing(10);
    vb.setPadding(new Insets(10));
    
    // ImageView para a imagem
    ImageView imga = new ImageView();
    imga.setFitWidth(180);
    imga.setFitHeight(120);
    imga.setPreserveRatio(true);
    imga.setStyle("-fx-border-radius: 5; -fx-background-radius: 5;");
    
    // Exemplo de imagem (substitua pela sua)
    Platform.runLater(()->{
         try {
            imga.setImage(new Image(url));
        } catch (Exception e) {
            // Imagem padrão caso a original não carregue
            imga.setStyle("-fx-background-color: #e0e0e0; -fx-border-color: #ccc;");
        }
    });
    
    // Label do título
    Label titulos = new Label("Título da Imagem");
    titulos.setStyle("-fx-font-weight: bold; -fx-font-size: 14px; -fx-text-fill: #333;");
    titulos.setWrapText(true);
    titulos.setMaxWidth(180);
    titulos.setAlignment(Pos.CENTER);
    
    // Botão de ação
    JFXButton bt = new JFXButton("Trash");
    bt.setStyle("-fx-background-color: #af4c4cff; -fx-text-fill: white; -fx-font-weight: bold;");
    bt.setPrefWidth(120);
    
    // Ação do botão
    bt.setOnAction(e -> {
        try {
            ActividadeService.galeriaDel(id);
            ((GridPane) vb.getParent()).getChildren().remove(vb);

        } catch (IOException | InterruptedException e1) {
            e1.printStackTrace();
        }
    });
    
    // Adicionando todos os elementos ao VBox
    vb.getChildren().addAll(imga,titulos,bt);
    
    // Efeito hover no card
    vb.setOnMouseEntered(e -> {
        vb.setStyle("-fx-background-color: #f5f5f5; -fx-border-color: #bbb; -fx-border-radius: 8; -fx-background-radius: 8; -fx-cursor: hand;");
    });
    
    vb.setOnMouseExited(e -> {
        vb.setStyle("-fx-background-color: white; -fx-border-color: #ddd; -fx-border-radius: 8; -fx-background-radius: 8;");
    });
    
    return vb;
}

     public VBox Trailler() {
    // Container principal
    VBox vb = new VBox();
    vb.setPrefSize(320, 280);
    vb.setMaxSize(320, 280);
    vb.setStyle("-fx-background-color: #1a1a1a; -fx-border-color: #333; -fx-border-radius: 8; -fx-background-radius: 8;");
    vb.setAlignment(Pos.TOP_CENTER);
    vb.setSpacing(10);
    vb.setPadding(new Insets(10));
    
    // WebView para o vídeo do YouTube
    WebView webView = new WebView();
    webView.setPrefSize(300, 180);
    webView.setStyle("-fx-border-radius: 5;");
    
    WebEngine webEngine = webView.getEngine();
    
    // ID do vídeo do YouTube (exemplo)
    String videoId = url; // Rick Astley - Never Gonna Give You Up
    
    // Embed do YouTube
    String videoUrl = "https://www.youtube.com/embed/" + videoId + "?autoplay=0&controls=1";
    String htmlContent = "<!DOCTYPE html>" +
            "<html>" +
            "<body style='margin:0; padding:0;'>" +
            "<iframe width='100%' height='100%' src='" + videoUrl + "'" +
            " frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'" +
            " allowfullscreen></iframe>" +
            "</body>" +
            "</html>";
    
    webEngine.loadContent(htmlContent);
    
    
    JFXButton trushButton = new JFXButton("🗑️");
    trushButton.setStyle("-fx-background-color: #ff4444; -fx-text-fill: white; -fx-font-size: 14px; -fx-background-radius: 15;");
    trushButton.setPrefSize(30, 30);
    
    // Ação do botão de lixeira
    trushButton.setOnAction(e -> {
        // Aqui você pode adicionar confirmação antes de deletar
        try {
            ActividadeService.trailerDel(id);
        } catch (IOException | InterruptedException e1) {
            e1.printStackTrace();
        }
        // Remover da interface
        ((GridPane) vb.getParent()).getChildren().remove(vb);
    });
    
    // Container para o botão (alinhado à direita)
    HBox buttonContainer = new HBox();
    buttonContainer.setAlignment(Pos.CENTER_RIGHT);
    buttonContainer.setPrefWidth(300);
    buttonContainer.getChildren().add(trushButton);
    
    // Adicionando todos os elementos ao VBox
    vb.getChildren().addAll(buttonContainer, webView);
    
    // Efeito hover no card
    vb.setOnMouseEntered(e -> {
        vb.setStyle("-fx-background-color: #2a2a2a; -fx-border-color: #555; -fx-border-radius: 8; -fx-background-radius: 8; -fx-cursor: hand;");
    });
    
    vb.setOnMouseExited(e -> {
        vb.setStyle("-fx-background-color: #1a1a1a; -fx-border-color: #333; -fx-border-radius: 8; -fx-background-radius: 8;");
    });
    
    return vb;
}
    
}