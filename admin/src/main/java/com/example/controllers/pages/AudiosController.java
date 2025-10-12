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
import com.example.enums.AudioType;
import com.example.enums.FileType;
import com.example.enums.MidiaType;
import com.example.models.ActividadeModel;
import com.example.models.ArtigoModel;
import com.example.models.AudioModel;
import com.example.services.AudioService;
import com.example.utils.FormAnaliserUtil;
import com.example.utils.ModalUtil;
import com.example.utils.ReacaoFormUtil;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXComboBox;
import java.util.List;
import java.util.stream.Collectors;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class AudiosController implements Controller{

    @FXML
    public FlowPane listAudios;

    @FXML
    public AnchorPane content;

    public CardProcess card;

    private StackPane fundo;

    public ImageView img;

    public Label info;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
       loadAudio();
    }

    @Override
    public void Show() {
      if (listAudios.getChildren().isEmpty()) {
          loadAudio();  
      }
    }

    @Override
      public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
        this.info=info;
        this.img=img;
      }
   
       @FXML
    void Add(){
        ModalUtil.Show("modalAudio",this,content);
    }
    
    private void loadAudio(){
        listAudios.getChildren().clear();
        card=new CardProcess("Buscando os audios");
        listAudios.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return AudioService.allAudio();
            } catch (Exception e) {
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if (t == null) {
                    card.Error("Erro ao buscar audios", () -> loadAudio());
                    return;
                }
                if (t.isEmpty()) {
                    card.Vazio("Sem Audios", () -> loadAudio());
                }else{
                    listAudios.getChildren().clear();
                    for (AudioDto audio : t) {
                        listAudios.getChildren().addAll(new AudioModel(audio,this));
                    }
                }
            });
        });
        
    }

     

    public void AddAudio(JFXButton actionButton,AudioDtoRegister audioRegister,VBox form,ImageView imgSrc){
        CompletableFuture.supplyAsync(() -> {
            try {
                if (UploadFiles.imgFile==null) {
                    ReacaoFormUtil.Reagir("error","Erro! A imagem nao foi carregada" , img, info);
                    return null;
                }
                if (UploadFiles.audioFile==null) {
                    ReacaoFormUtil.Reagir("error","Erro! O audio nao foi carregado" , img, info);
                    return null;
                }
            } catch (Exception e) {
                ReacaoFormUtil.Reagir("error","Erro! Ocorreu um erro ao carregar os arquivos" , img, info);
                return null;
            }
            try {
                  //System.out.println("Esperndo o AudioService.postAudio");
                return AudioService.postAudio(audioRegister);
            } catch ( IOException | InterruptedException e) {
                 //System.out.println(e.getMessage());
              return null;
            } catch ( Exception e) {
                //System.out.println(e.getMessage());
              return null;
            }
        }).thenAccept(audio -> {
            Platform.runLater(() -> {
                if (audio==null) {
                    ReacaoFormUtil.Reagir("error","Erro! O Audio nao foi adicionado a base de dados" , img, info);
                    actionButton.setDisable(false);
                    return;
                }
                if (listAudios.getChildren().contains(card))
                    listAudios.getChildren().remove(card);
                listAudios.getChildren().add(0,new AudioModel(audio,this));
                FormAnaliserUtil.CleanForm(form);
                imgSrc.setImage(new Image(App.class.getResourceAsStream("assets/audio.png")));
                ReacaoFormUtil.Reagir("corret","O Audio foi adicionado com sucesso" , img, info);
                actionButton.setDisable(false);
            });
        });    
    }

    public void EditAudio(JFXButton actionButton, AudioDtoRegister audioRegister, int id, VBox form) {
        CompletableFuture.supplyAsync(() -> {
            try {
                  //System.out.println("Esperndo o AudioService.postAudio");
                return AudioService.putAudio(audioRegister,id);
            } catch ( IOException | InterruptedException e) {
                 //System.out.println(e.getMessage());
              return null;
            } catch ( Exception e) {
                //System.out.println(e.getMessage());
              return null;
            }
        }).thenAccept(audio -> {
            Platform.runLater(() -> {
                if (audio==null) {
                    ReacaoFormUtil.Reagir("error","Erro! O Audio nao foi adicionado a base de dados" , img, info);
                    actionButton.setDisable(false);
                    return;
                }
                if (listAudios.getChildren().contains(card))
                    listAudios.getChildren().remove(card);
                List<Node> filteredList = listAudios.getChildren().stream()
                    .filter(node -> node instanceof AudioModel)
                    .map(node -> (AudioModel) node)
                    .filter(model -> model.getDados().id() == id)
                    .collect(Collectors.toList());
                if (!filteredList.isEmpty()) {
                    listAudios.getChildren().removeAll(filteredList);
                }    
                listAudios.getChildren().add(0,new AudioModel(audio,this));
                FormAnaliserUtil.CleanForm(form);
                ReacaoFormUtil.Reagir("corret","O Audio foi adicionado com sucesso" , img, info);
                actionButton.setDisable(false);
            });
        });    
    }

}
