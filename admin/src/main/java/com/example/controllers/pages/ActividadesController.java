package com.example.controllers.pages;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.configs.ApiCache;
import com.example.controllers.Controller;
import com.example.enums.FileType;
import com.example.models.actividade.ActividadeDtoSimple;
import com.example.models.actividade.ActividadeModel;
import com.example.services.ActividadeService;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXComboBox;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.DatePicker;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.ToggleGroup;
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
    private ImageView img;

    @FXML
    private VBox listActividade;

    @FXML
    private TextField organizador;

    @FXML
    private TextField pesqBloco;

    @FXML
    private JFXComboBox<String> publico_alvo;

    @FXML
    private ToggleGroup selectActivy;

    @FXML
    private TextField tema;

    @FXML
    private JFXComboBox<String> tipo;

    @FXML
    private TextField titulo;

      public CardProcess card = null;
    private ActividadeService actividadeService=new ActividadeService();


    @FXML
    void CarregarImagem(MouseEvent event) {
        UploadFiles.Uplaod(FileType.Image, img,  content); 
    }

    @FXML
    void Enviar(ActionEvent event) {

    }

    @FXML
    void pesquisar(ActionEvent event) {

    }

    @FXML
    void SelectSeccao(ActionEvent event) {

    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
      
      
        AddDetails();
    }

    void LoadActividades(){
        card=new CardProcess("Buscando as Actividades");
        listActividade.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return actividadeService.allActividades();    
            } catch (Exception e) {
                card.Error("Erro ao buscar actividades");
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if (t.isEmpty()) {
                    card.Vazio("Sem Actividades");
                }else{
                    listActividade.getChildren().clear();
                    for (ActividadeDtoSimple actividadeDtoSimple : t) {
                        listActividade.getChildren().addAll(new ActividadeModel(actividadeDtoSimple));
                    }
                }
            });
        });
        
    }

    private void AddDetails(){
        filtro.getItems().addAll("Todos","Mulheres","Jovens","Pais","Velhos","Crianças");
        publico_alvo.getItems().addAll("Todos","Mulheres","Jovens","Pais","Velhos","Crianças");
        tipo.getItems().addAll("Anual","Mensal","Projecto");
    }

    @Override
    public void Show() {
       LoadActividades();
    }
 
    
}
