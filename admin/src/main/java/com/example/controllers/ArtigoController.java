package com.example.controllers;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.ResourceBundle;

import com.example.models.ArtigoModel;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.layout.VBox;

public class ArtigoController implements Initializable{

    @FXML
    private VBox listArtigo;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        listArtigo.getChildren().add(new ArtigoModel("Roma da silva", "Curiously, the matter of the \r\n" + //
                        "criterion must be compatible \r\n" + //
                        "with The Parameter of Relational \r\n" + //
                        "Event(Alfredo Asher in The Book \r\n" + //
                        "of the Application Rules)\r\n" + //
                        "", "null","",LocalDateTime.now()))    ;
                        listArtigo.getChildren().add(new ArtigoModel("Roma da silva", "Curiously, the matter of the criterion must be compatible with The Parameter of Relational Event(Alfredo Asher in The Book of the Application Rules)", "null","",LocalDateTime.now()))    ;
                        listArtigo.getChildren().add(new ArtigoModel("Roma da silva", "Curiously, the matter of the \r\n" + //
                        "criterion must be compatible \r\n" + //
                        "with The Parameter of Relational \r\n" + //
                        "Event(Alfredo Asher in The Book \r\n" + //
                        "of the Application Rules)\r\n" + //
                        "", "null","",LocalDateTime.now()))    ;
                        listArtigo.getChildren().add(new ArtigoModel("Roma da silva", "Curiously, the matter of the \r\n" + //
                        "criterion must be compatible \r\n" + //
                        "with The Parameter of Relational \r\n" + //
                        "Event(Alfredo Asher in The Book \r\n" + //
                        "of the Application Rules)\r\n" + //
                        "", "null","",LocalDateTime.now()))    ;
                        listArtigo.getChildren().add(new ArtigoModel("Roma da silva", "Curiously, the matter of the \r\n" + //
                        "criterion must be compatible \r\n" + //
                        "with The Parameter of Relational \r\n" + //
                        "Event(Alfredo Asher in The Book \r\n" + //
                        "of the Application Rules)\r\n" + //
                        "", "null","",LocalDateTime.now()))    ;
    }
}
