package com.example.utils;

import com.example.App;

import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class PasswordHiddenText {
 
    public static void Ocultar(PasswordField senha,TextField senhaText,ImageView eye,boolean dark) {
        if (eye.getAccessibleText().equals("see")) {
            eye.setImage(new Image(App.class.getResourceAsStream("assets/eye-closed"+(dark?"-dark":"")+".png")));
            senha.setText(senhaText.getText());
            senhaText.setVisible(false);
            senhaText.setManaged(false);
            senha.setVisible(true);
            senha.setManaged(true);
            eye.setAccessibleText("not see");    
        }else {
            eye.setImage(new Image(App.class.getResourceAsStream("assets/eye"+(dark?"-dark":"")+".png")));
            senhaText.setText(senha.getText());
            senha.setVisible(false);
            senha.setManaged(false);
            senhaText.setVisible(true);
            senhaText.setManaged(true);
            eye.setAccessibleText("see");    
        }
    }
}
