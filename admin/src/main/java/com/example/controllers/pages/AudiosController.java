package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.controllers.Controller;
import com.example.dto.audio.AudioDto;
import com.example.dto.audio.AudioDtoRegister;

import com.example.enums.FileType;
import com.example.enums.MidiaType;

import com.example.models.audio.AudioModel;
import com.example.services.AudioService;
import com.example.utils.FormAnaliserUtil;
import com.example.utils.ReacaoFormUtil;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXComboBox;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;

import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class AudiosController implements Controller{

    @FXML
    private TextArea descricao;

    @FXML
    private VBox listAudios;

    @FXML
    private JFXComboBox<String> tipo;

    @FXML
    private TextField titulo;

    @FXML
    private AnchorPane content;

    @FXML
    private TextField audioSrc;

    @FXML
    private ImageView imgSrc;
    @FXML
    private VBox form;
    public CardProcess card;

    private AudioService audioService=new AudioService();

    private StackPane fundo;

    private ImageView img;

    private Label info;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
      
    }

    @FXML
    void CarregarAudio(MouseEvent event) {
        UploadFiles.Uplaod(FileType.Audio, audioSrc, content);
    }

    @FXML
    void CarregarImagem(MouseEvent event) {
        UploadFiles.Uplaod(FileType.Image, imgSrc, content);
    }

    @Override
    public void Show() {
       loadAudio();
    }

          @Override
      public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
      }
   
    
    private void loadAudio(){
        listAudios.getChildren().clear();
        card=new CardProcess("Buscando os audios");
        listAudios.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return audioService.allAudio();
            } catch (Exception e) {
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if (t == null) {
                    card.Error("Erro ao buscar audios");
                    return;
                }
                if (t.isEmpty()) {
                    card.Vazio("Sem Audios");
                }else{
                    listAudios.getChildren().clear();
                    for (AudioDto audio : t) {
                        listAudios.getChildren().addAll(new AudioModel(audio));
                    }
                }
            });
        });
        
    }

      @FXML
    void Enviar(ActionEvent event) {
        JFXButton actionButton = (JFXButton) event.getSource();
        actionButton.setDisable(true);
        if (! FormAnaliserUtil.isEmpty(form)) {
             AddAudio(actionButton);
        }else {
            actionButton.setDisable(false);
        }
    }

    private void AddAudio(JFXButton actionButton){
        CompletableFuture.supplyAsync(() -> {
            try {
                return audioService.postAudio(new AudioDtoRegister(
                        titulo.getText(),
                        descricao.getText(),
                        imgSrc.getImage().getUrl(),
                        audioSrc.getText(),
                        MidiaType.AUDIO
                    ));
            } catch (IOException | InterruptedException e) {
              return null;
            }
        }).thenAccept(audio -> {
            if (audio==null) {
                ReacaoFormUtil.Reagir("error","Erro! O Audio nao foi adicionado a base de dados" , img, info);
            }else{
                Platform.runLater(() -> {
                    listAudios.getChildren().add(0,new AudioModel(audio));
                    FormAnaliserUtil.CleanForm(form);
                    ReacaoFormUtil.Reagir("corret","O Audio foi adicionado com sucesso" , img, info);
                });
            }
            actionButton.setDisable(false);
        });    
    }

}
