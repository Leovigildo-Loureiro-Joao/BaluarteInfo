package com.example.controllers;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.models.AudioModel;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.layout.VBox;

public class AudiosController implements Initializable{

    @FXML
    private VBox listAudios;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        AudioModel audioModel = new AudioModel("Oração de Jesus", "aasdasdasdas as sda sda sd asd asda sdas asda sda sd asda sda sda sdasdas das asd asd as sda sdas asd", "https://res.cloudinary.com/dh6xfyjxu/video/upload/v1746704664/Senhor_Terias_Misericordia_xz0fhh.mp3", "file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/pexels-felixmittermeier-2832052.jpg");
        listAudios.getChildren().add(audioModel);
    }
    
}
