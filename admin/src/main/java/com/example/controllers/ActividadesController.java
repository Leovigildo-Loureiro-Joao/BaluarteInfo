package com.example.controllers;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.configs.ApiCache;
import com.example.models.ActividadeModel;
import com.jfoenix.controls.JFXButton;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class ActividadesController implements Initializable{
    @FXML
    private VBox listActividade;

   
   
    @FXML
    private AnchorPane content;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        MainController controller=(MainController) ApiCache.getTelaCache("main")[0];
        listActividade.getChildren().add(new ActividadeModel("Actividade 1", "Tema 1", "Tipo 1", "Organizador 1", "Publico Alvo 1", "Up to a certain time, a equivalent action of efforts of the global management concepts the preliminary action plan the commitment to quality assurance and The Program of Restricted Service", "Telefone 1", "Email 1", "Endereco 1", "file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/pexels-felixmittermeier-2832052.jpg", java.time.LocalDateTime.now(),((MainController)controller).conteinerModal));
    }
 
    
}
