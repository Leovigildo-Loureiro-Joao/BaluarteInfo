package com.example.controllers;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.models.VideoModel;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.layout.VBox;

public class VideosController implements Initializable {

    @FXML
    private VBox listVideos;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        listVideos.getChildren().add(new VideoModel("sasdasd asda sdas das dasd asdas das dasda sdas das dasda sd asdasda sdasd asd","L9hagULsPtk"));
    }

   

}
