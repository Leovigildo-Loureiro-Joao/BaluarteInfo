package com.example.controllers.pages;

import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.controllers.Controller;
import com.example.models.artigo.ArtigoDto;
import com.example.models.artigo.ArtigoModel;
import com.example.models.video.VideoDtoModel;
import com.example.models.video.VideoModel;
import com.example.services.VideoService;

import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.layout.VBox;

public class VideosController implements Controller {

    @FXML
    private VBox listVideos;
    public CardProcess card;
    public VideoService videoService=new VideoService();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        
    }

    @Override
    public void Show() {
      loadVideo();
    }

      private void loadVideo(){
        card=new CardProcess("Buscando as videos");
        listVideos.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return videoService.allArtigos();
            } catch (Exception e) {  // TODO Auto-generated method stub
                card.Error("Erro ao buscar videos");
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if (t.isEmpty()) {
                    card.Vazio("Sem videos");
                }else{
                    listVideos.getChildren().clear();
                    for (VideoDtoModel video : t) {
                        listVideos.getChildren().addAll(new VideoModel(video));
                    }
                }
            });
        });
        
    }
   

}
