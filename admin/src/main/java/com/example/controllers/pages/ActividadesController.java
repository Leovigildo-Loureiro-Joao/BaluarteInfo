package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.configs.ApiCache;
import com.example.controllers.Controller;
import com.example.enums.ActividadeType;
import com.example.enums.DuracaoActividade;
import com.example.enums.FileType;
import com.example.enums.PublicoAlvoType;
import com.example.dto.actividade.*;
import com.example.models.actividade.ActividadeModel;
import com.example.services.ActividadeService;
import com.example.utils.FormAnaliserUtil;
import com.example.utils.ReacaoFormUtil;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXComboBox;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.ToggleGroup;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class ActividadesController implements Controller{
    
    @FXML
    private TextField contactos;

    @FXML
    private AnchorPane content;

    @FXML
    private DatePicker data_hora;

    @FXML
    private TextArea descricao;

    @FXML
    private JFXComboBox<String> filtro;

    @FXML
    private ImageView imgSrc;

    @FXML
    private VBox listActividade;

    @FXML
    private TextField organizador;

     @FXML
    private TextField endereco;

    @FXML
    private TextField pesqBloco;

    @FXML
    private JFXComboBox<String> publico_alvo;

    @FXML
    private JFXComboBox<String> duracao;

    @FXML
    private ToggleGroup selectActivy;

    @FXML
    private TextField tema;
    @FXML
    private VBox form;

    @FXML
    private JFXComboBox<String> tipo;

    @FXML
    private TextField titulo;

      public CardProcess card = null;
    private ActividadeService actividadeService=new ActividadeService();

    private StackPane fundo;

    private ImageView img;

    private Label info;

    @FXML
    void CarregarImagem(MouseEvent event) {
        UploadFiles.Uplaod(FileType.Image, imgSrc,  content); 
    }

    @FXML
    void Enviar(ActionEvent event) {
        JFXButton actionButton = (JFXButton) event.getSource();
        actionButton.setDisable(true);
        if (! FormAnaliserUtil.isEmpty(form)) {
            AddActividade(actionButton);
        }else {
            actionButton.setDisable(false);
        }
    }

    private void AddActividade(JFXButton actionButton){
        
        CompletableFuture.supplyAsync(() -> {
            if (UploadFiles.imgFile == null) {
                ReacaoFormUtil.Reagir("error", "Erro! A imagem nao foi carregada", img, info);
                return null;
            }
            if (data_hora.getValue() == null) {
                ReacaoFormUtil.Reagir("error", "Erro! A data e hora do evento nao foram selecionadas", img, info);
                return null;
            }
            try {
                return actividadeService.postActividade(new ActividadeDtoRegister(
                        descricao.getText(),
                        tema.getText(),
                        titulo.getText(),
                        endereco.getText(),
                        ActividadeType.valueOf(tipo.getValue()),
                        PublicoAlvoType.valueOf(publico_alvo.getValue()),
                        DuracaoActividade.valueOf(duracao.getValue()),
                        organizador.getText(),
                        LocalDateTime.from(data_hora.getValue()),
                        contactos.getText(),
                        UploadFiles.imgFile.getPath()
                    ));
            } catch (IOException | InterruptedException e) {
                return null;
            }catch(Exception e){
                System.out.println(e.getMessage());
                return null;
            }
        }, App.getExecutorService()).thenAccept(actividade -> {
            Platform.runLater(() -> {
                actionButton.setDisable(false);
                if (actividade == null) {
                    ReacaoFormUtil.Reagir("error","Erro! A actividade não foi adicionada a base de dados" , img, info);
                    return;
                }
                listActividade.getChildren().add(0,new ActividadeModel(actividade));
                FormAnaliserUtil.CleanForm(form);
                img.setImage(new Image(App.class.getResourceAsStream("assets/audio.png")));
                ReacaoFormUtil.Reagir("corret","A Actividade foi adicionada com sucesso" , img, info);
            });
        });
    }

    @FXML
    void pesquisar(ActionEvent event) {

    }

    @FXML
    void SelectSeccao(ActionEvent event) {

    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        LoadActividades();
         AddDetails();
    }

    @Override
      public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
        this.info=info;
        this.img=img;
      }
   

    void LoadActividades(){
         listActividade.getChildren().clear();
        card=new CardProcess("Buscando as Actividades");
        listActividade.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return actividadeService.allActividades();    
            } catch (Exception e) {
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if (t == null) {
                    card.Error("Erro ao buscar actividades",() -> LoadActividades());
                    return;
                }
                if (t.isEmpty()) {
                    card.Vazio("Sem Actividades",() -> LoadActividades());
                }else{
                   
                    for (ActividadeDtoSimple actividadeDtoSimple : t) {
                        listActividade.getChildren().addAll(new ActividadeModel(actividadeDtoSimple));
                    }
                }
            });
        });
        
    }

    private void AddDetails(){
        filtro.getItems().addAll("Todos","Mulheres","Jovens","Pais","Velhos","Crianças");
        publico_alvo.getItems().addAll(PublicoAlvoType.Lista());
        duracao.getItems().addAll(DuracaoActividade.Lista());
        tipo.getItems().addAll(ActividadeType.Lista());
    }

    @Override
    public void Show() {
        if (listActividade.getChildren().isEmpty()) {
          LoadActividades();  
        }
    }
 
    
}
