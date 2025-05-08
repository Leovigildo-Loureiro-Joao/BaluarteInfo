package com.example.models;

import com.jfoenix.controls.JFXButton;

import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VideoModel extends VBox{
    private Label descricao;
    private WebView webView;
    private String videoId;
    private WebEngine webEngine;
    private HBox rown_button;
    private JFXButton editButton;
    private JFXButton trushButton;


    public VideoModel (String descricao,String videoId) {
        this.videoId=videoId;
        OrdenarModel(descricao);
        AddStyleClass();
        LoadVideo();
    }

    public void LoadVideo(){
        Platform.runLater(() -> {
            webView = new WebView();
            webEngine = webView.getEngine();
            String embedUrl = "https://www.youtube.com/embed/" + videoId + "?rel=0&loop=1&playlist=" + videoId;
            webEngine.load(embedUrl);
            this.getChildren().addAll(webView,new Text("Descrição"),this.descricao,rown_button);
        });
    }

    public void OrdenarModel(String descricao){
        trushButton=new JFXButton("Apagar");
        editButton=new JFXButton("Editar");
        this.descricao=new Label(descricao);
        rown_button=new HBox(editButton,trushButton);
        rown_button.setSpacing(20);
        this.setSpacing(10);
       
    }

    public void AddStyleClass(){
        this.getStyleClass().add("video-model");
        this.getStyleClass().add("card");
        trushButton.getStyleClass().add("buttonColor");
        editButton.getStyleClass().add("buttonWhite");
        rown_button.getStyleClass().add("rown-button");
    }

  
}
