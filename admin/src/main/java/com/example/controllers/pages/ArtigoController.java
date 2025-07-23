package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.controllers.Controller;
import com.example.enums.ArtigoType;
import com.example.enums.FileType;
import com.example.dto.actividade.ActividadeDtoSimple;
import com.example.models.actividade.ActividadeModel;
import com.example.dto.artigo.ArtigoDto;
import com.example.dto.artigo.ArtigoRegister;
import com.example.models.artigo.ArtigoModel;
import com.example.services.ArtigoService;
import com.example.utils.FormAnaliserUtil;
import com.example.utils.ReacaoFormUtil;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXComboBox;
import com.jfoenix.controls.JFXButton;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class ArtigoController implements Controller{

   
    @FXML
    private TextArea descricao;

    @FXML
    private AnchorPane content;

    @FXML
    private JFXComboBox<String> filtro;

    @FXML
    private VBox listArtigo;

    @FXML
    private TextField nome;

    @FXML
    private TextField upload;

    @FXML
    private TextField pesqBlock;

    @FXML
    private JFXComboBox<String> tipo;

    @FXML
    private TextField titulo;
    private ArtigoService artigoService = new ArtigoService();
     public CardProcess card = null;

     private StackPane fundo;

    private ImageView img;

    @FXML
    private VBox form;

    private Label info;


    @FXML
    void CarregarPdf(ActionEvent event) {
        UploadFiles.Uplaod(FileType.Pdf, upload, content);
    }
    @Override
    public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
        this.info=info;
        this.img=img;
    }
   

    @FXML
    void Enviar(ActionEvent event) {
        JFXButton actionButton = (JFXButton) event.getSource();
        actionButton.setDisable(true);
        if (! FormAnaliserUtil.isEmpty(form)) {
            AddArtigo(actionButton);
        }else {
            actionButton.setDisable(false);
        }
    }

    private void AddArtigo(JFXButton actionButton){
        
        CompletableFuture.supplyAsync(() -> {
            try {
                return artigoService.postArtigo(new ArtigoRegister(
                        descricao.getText(),
                        titulo.getText(),
                        nome.getText(),
                        upload.getText(),
                        ArtigoType.fromValue(tipo.getValue())
                    ));
            } catch (IOException | InterruptedException e) {
                return null;
            }catch(Exception e){
                System.out.println(e.getMessage());
                return null;
            }
        }, App.getExecutorService()).thenAccept(artigo -> {
            Platform.runLater(() -> {
                actionButton.setDisable(false);
                if (artigo == null) {
                    ReacaoFormUtil.Reagir("error","Erro! O artigo não foi adicionado a base de dados" , img, info);
                    return;
                }
                listArtigo.getChildren().add(0,new ArtigoModel(artigo));
                FormAnaliserUtil.CleanForm(form);
                ReacaoFormUtil.Reagir("corret","O Artigo foi adicionado com sucesso" , img, info);
            });
        });
    }

    @FXML
    void Pesquisar(ActionEvent event) {

    }


    @Override
    public void initialize(URL location, ResourceBundle resources) {
        AddDetails();
        loadArtigo();
        upload.setOnMouseClicked((MouseEvent e) -> {
            UploadFiles.Uplaod(FileType.Pdf, upload, content);
        });
                       
    }

    private void AddDetails(){
        tipo.getItems().addAll(ArtigoType.Lista());
        filtro.getItems().addAll(ArtigoType.Lista());
    }

    @Override
    public void Show() {
     if (listArtigo.getChildren().isEmpty()) {
          loadArtigo();  
      }
    }

    private void loadArtigo(){
        listArtigo.getChildren().clear();
        card=new CardProcess("Buscando os Artigos");
        listArtigo.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return artigoService.allArtigos();
            } catch (Exception e) {
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if (t == null) {
                    card.Error("Erro ao buscar artigos", () -> loadArtigo());
                    return;
                }
                if (t.isEmpty()) {
                    card.Vazio("Sem Actividades",() -> loadArtigo());
                }else{
                  
                    for (ArtigoDto artigoDto : t) {
                        listArtigo.getChildren().addAll(new ArtigoModel(artigoDto));
                    }
                }
            });
        });
        
    }

}
