package com.example.controllers.pages;

import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.controllers.Controller;
import com.example.enums.FileType;
import com.example.models.artigo.ArtigoDto;
import com.example.models.artigo.ArtigoModel;
import com.example.models.audio.AudioDto;
import com.example.models.audio.AudioModel;
import com.example.services.AudioService;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXComboBox;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
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
    public CardProcess card;

    private AudioService audioService=new AudioService();

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
    
    private void loadAudio(){
        card=new CardProcess("Buscando os audios");
        listAudios.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return audioService.allAudio();
            } catch (Exception e) {
                card.Error("Erro ao buscar audios");
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
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
}
