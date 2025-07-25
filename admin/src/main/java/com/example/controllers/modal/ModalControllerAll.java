package com.example.controllers.modal;

import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;
import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.example.services.ActividadeService;
import com.example.utils.FormAnaliserUtil;
import com.example.utils.ModalUtil;
import com.example.utils.ReacaoFormUtil;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXComboBox;
import com.example.App;
import com.example.controllers.Controller;
import com.example.controllers.pages.ActividadesController;
import com.example.controllers.pages.ArtigoController;
import com.example.dto.actividade.*;
import com.example.dto.artigo.ArtigoRegister;
import com.example.enums.*;
import com.example.models.actividade.ActividadeModel;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.VBox;

import jfxtras.scene.control.LocalDateTimeTextField;

public class ModalControllerAll implements Initializable{
    @FXML
    private TextField contactos;
    
    @FXML
    private LocalDateTimeTextField data_hora;

    @FXML
    private TextArea descricao;

    @FXML
    private ImageView imgSrc;

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
    private TextField tema;

    @FXML
    private VBox form;

    private Controller controller;

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

    public AnchorPane content;

    public void setController(Controller controller){
        this.controller=controller;
        if(ActividadesController.class.equals(controller.getClass())){
            publico_alvo.getItems().addAll(PublicoAlvoType.Lista());
            duracao.getItems().addAll(DuracaoActividade.Lista());
            tipo.getItems().addAll(ActividadeType.Lista());
        }else if (ArtigoController.class.equals(controller.getClass())) {
             tipo.getItems().addAll(ArtigoType.Lista());
        }
    }

     @Override
    public void initialize(URL location, ResourceBundle resources) {
    
    }

    @FXML
    void CarregarImagem(MouseEvent event) {
        UploadFiles.Uplaod(FileType.Image, imgSrc,  content); 
    }

     @FXML
    void CarregarPdf(ActionEvent event) {
        UploadFiles.Uplaod(FileType.Pdf, upload, content);
    }


     @FXML
    void EnviarActividade(ActionEvent event) {
        JFXButton actionButton = (JFXButton) event.getSource();
        actionButton.setDisable(true);
        if (! FormAnaliserUtil.isEmpty(form)) {
            ActividadesController control=(ActividadesController)controller;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy, HH:mm:ss");
            control.AddActividade(actionButton,  new ActividadeDtoRegister(
                descricao.getText(),
                tema.getText(),
                titulo.getText(),
                endereco.getText(),
                ActividadeType.valueOf(tipo.getValue()),
                PublicoAlvoType.valueOf(publico_alvo.getValue()),
                DuracaoActividade.valueOf(duracao.getValue()),
                organizador.getText(),
                LocalDateTime.parse(data_hora.getText(),formatter),
                contactos.getText(),
                UploadFiles.imgFile.getPath()
            ),form);
        }else {
            actionButton.setDisable(false);
        }
    }

     @FXML
    void EnviarArtigo(ActionEvent event) {
        JFXButton actionButton = (JFXButton) event.getSource();
        actionButton.setDisable(true);
        if (! FormAnaliserUtil.isEmpty(form)) {
            ArtigoController control=(ArtigoController)controller;
            control.AddArtigo(actionButton,  new ArtigoRegister(
                        descricao.getText(),
                        titulo.getText(),
                        nome.getText(),
                        upload.getText(),
                        ArtigoType.fromValue(tipo.getValue())),form);
        }else {
            actionButton.setDisable(false);
        }
    }

}

   