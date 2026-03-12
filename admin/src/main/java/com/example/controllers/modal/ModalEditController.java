package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;

import com.jfoenix.controls.JFXButton;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;
import javafx.scene.layout.StackPane;
import javafx.scene.text.Text;

public class ModalEditController implements Initializable{
    @FXML
    private JFXButton cancel;

    @FXML
    private StackPane fundo;

    @FXML
    private TextArea info;

    @FXML
    private Text title;

    @FXML
    void Alterar(ActionEvent event) {

    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
      
    }
}
