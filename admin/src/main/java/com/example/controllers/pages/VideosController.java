package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.controllers.Controller;
import com.example.dto.video.VideoDtoModel;
import com.example.dto.video.VideoDtoRegister;
import com.example.enums.MidiaType;

import com.example.models.video.VideoModel;
import com.example.services.VideoService;
import com.example.utils.FormAnaliserUtil;
import com.example.utils.ModalUtil;
import com.example.utils.ReacaoFormUtil;
import com.jfoenix.controls.JFXButton;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class VideosController implements Controller {

    @FXML
    private VBox listVideos;

    @FXML
    private TextArea descricao;

    @FXML
    private TextField titulo;

    @FXML
    private VBox form;
    private StackPane fundo;

    private ImageView img;

    private Label info;
    @FXML
    private TextField url;
    public CardProcess card;
    public VideoService videoService=new VideoService();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        
    }

    @Override
    public void Show() {
      loadVideo();
    }

    @FXML
    void Enviar(ActionEvent event) {
        JFXButton actionButton = (JFXButton) event.getSource();
        actionButton.setDisable(true);
        if (! FormAnaliserUtil.isEmpty(form)) {
             AddVideo(actionButton);
        }else {
            actionButton.setDisable(false);
        }
    }

    private void AddVideo(JFXButton actionButton){
        CompletableFuture.supplyAsync(() -> {
            try {
                return videoService.postVideo(new VideoDtoRegister(
                        titulo.getText(),
                        descricao.getText(),
                        url.getText(),
                        MidiaType.VIDEO
                    ));
            } catch (IOException | InterruptedException e) {
              return null;
            }
        }).thenAccept(video -> {
            if (video==null) {
                ReacaoFormUtil.Reagir("error","Erro! O Video nao foi adicionado a base de dados" , img, info);
            }else{
                Platform.runLater(() -> {
                    listVideos.getChildren().add(0,new VideoModel(video));
                    FormAnaliserUtil.CleanForm(form);
                    ReacaoFormUtil.Reagir("corret","O Video foi adicionado com sucesso" , img, info);
                });
            }
            actionButton.setDisable(false);
        });    
    }

      private void loadVideo(){
        listVideos.getChildren().clear();
        card=new CardProcess("Buscando as videos");
        listVideos.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return videoService.allVideos();
            } catch (Exception e) {  // TODO Auto-generated method stub
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if(t == null) {
                    card.Error("Erro ao buscar videos");
                    return;
                }
                if (t.isEmpty()) {
                    card.Vazio("Sem videos");
                }else{
                    //listVideos.getChildren().remove(card);
                    card.Error("Erro ao buscar videos");
                    for (VideoDtoModel video : t) {
                        listVideos.getChildren().addAll(new VideoModel(video));
                    }
                }
            });
        });
        
    }

      @Override
      public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
        this.info=info;
        this.img=img;
      }
   

}
