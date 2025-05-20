package com.example.controllers.pages;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.configs.ApiCache;
import com.example.enums.FileType;
import com.example.models.ActividadeModel;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXComboBox;

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

public class ActividadesController implements Initializable{
    
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
      
        listActividade.getChildren().add(new ActividadeModel("Actividade 1", "Tema 1", "Tipo 1", "Organizador 1", "Publico Alvo 1", "Up to a certain time, a equivalent action of efforts of the global management concepts the preliminary action plan the commitment to quality assurance and The Program of Restricted Service", "Telefone 1", "Email 1", "Endereco 1", "file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/pexels-felixmittermeier-2832052.jpg", java.time.LocalDateTime.now()));
        AddDetails();
    }

    private void AddDetails(){
        filtro.getItems().addAll("Todos","Mulheres","Jovens","Pais","Velhos","Crianças");
        publico_alvo.getItems().addAll("Todos","Mulheres","Jovens","Pais","Velhos","Crianças");
        tipo.getItems().addAll("Anual","Mensal","Projecto");
    }
 
    
}
