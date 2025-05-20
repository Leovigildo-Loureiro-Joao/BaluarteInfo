package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

import com.example.App;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.control.TextFormatter;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class LoginController implements Initializable{

    @FXML
    private TextField email;

    @FXML
    private ImageView eye;

    @FXML
    private PasswordField senha;

    @FXML
    void Entrar(ActionEvent event) {
        try {
            App.setRoot("main");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    

    @FXML
    void Ocultar(ActionEvent event) {
        if (eye.getAccessibleText().equals("see")) {
            eye.setImage(new Image(App.class.getResourceAsStream("assets/eye-closed.png")));
            eye.setAccessibleText("not see");    
        }else {
            eye.setImage(new Image(App.class.getResourceAsStream("assets/eye.png")));
            eye.setAccessibleText("see");    
        }
        
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // TODO Auto-generated method stub
        
    }
}
