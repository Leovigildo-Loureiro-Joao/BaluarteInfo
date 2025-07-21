package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.models.user.UsuarioModel;
import com.example.services.LoginService;
import com.example.utils.ModalUtil;
import com.example.utils.PasswordHiddenText;
import com.jfoenix.controls.JFXButton;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.control.TextFormatter;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;

public class LoginController implements Initializable{

    private LoginService service=new LoginService();

    @FXML
    private TextField email;

        @FXML
    public StackPane conteinerModal;

    @FXML
    private ImageView eye;

    @FXML
    private PasswordField senha;

    @FXML
    private TextField senhaText;

    @FXML
    void Entrar(ActionEvent event) {
        String userEmail = email.getText();
        String userSenha = senha.getText();
        boolean hasError = false;

        if (userEmail.isEmpty()) {
            email.getStyleClass().add("error");
            hasError = true;
        }
        if (userSenha.isEmpty()) {
            senha.getStyleClass().add("error");
            hasError = true;
        }
        if (hasError) return;

        JFXButton loginButton = (JFXButton) event.getSource();
        loginButton.setDisable(true);

        // Spinner visual opcional aqui, se desejar

        CompletableFuture
            .supplyAsync(() -> {
                try {
                    System.out.println("Autenticando usuário: " + userEmail+ " com senha: " + userSenha);
                    return service.autenticar(userEmail, userSenha);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                    return false; // Trata exceção e impede retorno null
                }
            })
            .thenAccept(authenticated -> Platform.runLater(() -> {
                loginButton.setDisable(false);
                
                if (Boolean.TRUE.equals(authenticated)) {
                    try {
                        App.setRoot("main");
                    } catch (IOException e) {
                        e.printStackTrace();
                        ModalUtil.ShowTemporary(conteinerModal, "modalError","Erro",e.getMessage());
                    }
                } else {
                    senha.getStyleClass().add("error");
                    senhaText.getStyleClass().add("error");
                    ModalUtil.ShowTemporary(conteinerModal, "modalError","Erro","Dados invalidos");
                }
            }));
    }


    

    @FXML
    void Ocultar(ActionEvent event) {
        PasswordHiddenText.Ocultar(senha, senhaText, eye,false);
        
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // TODO Auto-generated method stub
        email.setOnKeyPressed(event -> {
            email.getStyleClass().remove("error");
        });
        senha.setOnKeyPressed(event -> {
            senha.getStyleClass().remove("error");
        });
        senhaText.setOnKeyPressed(event -> {
            senhaText.getStyleClass().remove("error");
        });
       
    }
}
