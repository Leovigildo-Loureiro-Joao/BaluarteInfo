package com.example.controllers.pages;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.controllers.Controller;
import com.example.enums.FileType;
import com.example.models.actividade.ActividadeDtoSimple;
import com.example.models.actividade.ActividadeModel;
import com.example.models.artigo.ArtigoDto;
import com.example.models.artigo.ArtigoModel;
import com.example.services.ArtigoService;
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

public class ArtigoController implements Controller{

   
    @FXML
    private TextArea descricao;

    @FXML
    private AnchorPane content;

    @FXML
    private JFXComboBox<String> filtro;

    @FXML
    private ImageView img;

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


    @FXML
    void CarregarPdf(ActionEvent event) {
        UploadFiles.Uplaod(FileType.Pdf, upload, content);
    }

    @FXML
    void Enviar(ActionEvent event) {

    }

    @FXML
    void Pesquisar(ActionEvent event) {

    }


    @Override
    public void initialize(URL location, ResourceBundle resources) {
        AddDetails();

        upload.setOnMouseClicked((MouseEvent e) -> {
            UploadFiles.Uplaod(FileType.Pdf, upload, content);
        });
                       
    }

    private void AddDetails(){
        tipo.getItems().addAll("Estudo Bíblico","Devocional","Histórico","Doutrinário","Testemunho","Apologética","Profético","Teológico");
        filtro.getItems().addAll("Estudo Bíblico","Devocional","Histórico","Doutrinário","Testemunho","Apologética","Profético","Teológico");
    }

    @Override
    public void Show() {
      loadArtigo();
    }

    private void ClearFields() {
        nome.clear();
        titulo.clear();
        descricao.clear();
        upload.clear();
        img.setImage(null);
        tipo.getSelectionModel().clearSelection();
    }

    private void loadArtigo(){
        card=new CardProcess("Buscando as Actividades");
        listArtigo.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return artigoService.allArtigos();
            } catch (Exception e) {
                card.Error("Erro ao buscar artigos");
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if (t.isEmpty()) {
                    card.Vazio("Sem Actividades");
                }else{
                    listArtigo.getChildren().clear();
                    for (ArtigoDto artigoDto : t) {
                        listArtigo.getChildren().addAll(new ArtigoModel(artigoDto));
                    }
                }
            });
        });
        
    }

}
