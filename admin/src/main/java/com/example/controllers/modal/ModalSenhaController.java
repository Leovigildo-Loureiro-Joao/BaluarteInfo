package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.utils.PasswordHiddenText;
import com.jfoenix.controls.JFXButton;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;

public class ModalSenhaController implements Initializable{
@FXML
    private PasswordField comfSenha;

    @FXML
    private ImageView eye;

    @FXML
    private ImageView eye1;

    @FXML
    private ImageView eye2;

    @FXML
    private PasswordField newSenha;

    @FXML
    private PasswordField senha;

    @FXML
    private TextField senhaText;

    @FXML
    private TextField senhaText1;

    @FXML
    private TextField senhaText2;

    @FXML
    private JFXButton cancel;

    @FXML
    private HBox bloco1;

    @FXML
    private HBox bloco2;

    @FXML
    private HBox bloco3;

    @FXML
    void Adicionar(ActionEvent event) {

    }

    @FXML
    void Ocultar(ActionEvent event) {
        System.out.println(event.getTarget().getClass().getName());
        if (bloco1.getChildren().contains((JFXButton)event.getTarget())) {
            PasswordHiddenText.Ocultar(senha, senhaText, eye,true);    
        }else if (bloco2.getChildren().contains((JFXButton)event.getTarget())) {
            PasswordHiddenText.Ocultar(newSenha, senhaText1, eye1,true);    
        }else
            PasswordHiddenText.Ocultar(comfSenha, senhaText2, eye2,true);    
        
    }
    @Override
    public void initialize(URL location, ResourceBundle resources) {
     
    }
    
}
