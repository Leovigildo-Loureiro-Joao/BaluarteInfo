package com.example.controllers;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.enums.FileType;
import com.example.models.AudioModel;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXComboBox;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.VBox;

public class AudiosController implements Initializable{

    @FXML
    private ImageView audio;

    @FXML
    private TextArea descricao;

    @FXML
    private VBox listAudios;

    @FXML
    private JFXComboBox<String> tipo;

    @FXML
    private TextField titulo;

    @FXML
    private AnchorPane content;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        AudioModel audioModel = new AudioModel("Oração de Jesus", "aasdasdasdas as sda sda sd asd asda sdas asda sda sd asda sda sda sdasdas das asd asd as sda sdas asd", "https://res.cloudinary.com/dh6xfyjxu/video/upload/v1746704664/Senhor_Terias_Misericordia_xz0fhh.mp3", "file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/pexels-felixmittermeier-2832052.jpg");
        listAudios.getChildren().add(audioModel);
    }

    @FXML
    void CarregarAudio(MouseEvent event) {
        UploadFiles.Uplaod(FileType.Audio, audio, content);
    }
    
}
