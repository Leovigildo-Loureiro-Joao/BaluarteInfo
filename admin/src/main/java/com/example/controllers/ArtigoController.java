package com.example.controllers;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.ResourceBundle;

import com.example.enums.FileType;
import com.example.models.ArtigoModel;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXComboBox;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.VBox;

public class ArtigoController implements Initializable{

   
    @FXML
    private TextArea descricao;

    @FXML
    private AnchorPane content;

    @FXML
    private JFXComboBox<String> filtro;

    @FXML
    private ImageView img;

    @FXML
    private VBox listArtigo;

    @FXML
    private TextField nome;

    @FXML
    private TextField upload;

    @FXML
    private TextField pesqBlock;

    @FXML
    private JFXComboBox<String> tipo;

    @FXML
    private TextField titulo;


    @FXML
    void CarregarPdf(ActionEvent event) {
        UploadFiles.Uplaod(FileType.Pdf, upload, content);
    }

    @FXML
    void Enviar(ActionEvent event) {

    }

    @FXML
    void Pesquisar(ActionEvent event) {

    }


    @Override
    public void initialize(URL location, ResourceBundle resources) {
        AddDetails();

        listArtigo.getChildren().add(new ArtigoModel("Roma da silva", "Curiously, the matter of the \r\n" + //
                        "criterion must be compatible \r\n" + //
                        "with The Parameter of Relational \r\n" + //
                        "Event(Alfredo Asher in The Book \r\n" + //
                        "of the Application Rules)\r\n" + //
                        "", "null","",LocalDateTime.now()))    ;
                       
    }

    private void AddDetails(){
        tipo.getItems().addAll("Estudo Bíblico","Devocional","Histórico","Doutrinário","Testemunho","Apologética","Profético","Teológico");
        filtro.getItems().addAll("Estudo Bíblico","Devocional","Histórico","Doutrinário","Testemunho","Apologética","Profético","Teológico");
    }

}
