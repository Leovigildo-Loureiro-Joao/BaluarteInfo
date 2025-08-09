package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;

import com.jfoenix.controls.JFXButton;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class ModalComfirmController implements Initializable {

    @FXML
    private Label acao;

    @FXML
    private JFXButton cancel;

    @FXML
    private JFXButton cancel1;

    @FXML
    private ImageView img;

    @FXML
    private Label outro;

    @FXML
    private Label titulo;

    public void Init(String titulo, String acao, String outro, Image img) {
        this.titulo.setText(titulo);
        this.acao.setText(acao);
        this.outro.setText(outro);
        this.img.setImage(img);
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // TODO Auto-generated method stub
        
    }

     @FXML
    void Continuar(ActionEvent event) {

    }

}
