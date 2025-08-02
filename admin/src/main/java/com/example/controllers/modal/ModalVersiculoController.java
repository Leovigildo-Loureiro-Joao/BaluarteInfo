package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;

import com.jfoenix.controls.JFXButton;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;

public class ModalVersiculoController implements Initializable {

    @Override
    public void initialize(URL location, ResourceBundle resources) {
      
    }

     @FXML
    private JFXButton cancel;

    @FXML
    private TextArea trecho;

    @FXML
    private TextField versiculo;

    @FXML
    void Adicionar(ActionEvent event) {

    }
    
}
