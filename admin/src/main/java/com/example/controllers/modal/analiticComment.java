package com.example.controllers.modal;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

import com.example.dto.comentario.Analise;
import com.example.dto.comentario.ComentarioDto;
import com.example.services.ComentarioService;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXTextArea;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import lombok.Getter;
import lombok.Setter;
import javafx.fxml.Initializable;

public class analiticComment implements Initializable {
    
    @FXML
    private JFXButton back;

    @FXML
    private JFXButton cancel;

        @FXML
    private JFXButton choose;

    @FXML
    private JFXTextArea descricao;

    @FXML
    private StackPane imagemCircular;

    @FXML
    private Label nome;

    @Getter
    private int id;
    

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        
    }

        @FXML
    void Aceitar(ActionEvent event) {
        try {
            if (choose.getText().equals("Manter")) {
                ComentarioService.Analisar(new Analise(id,true));
                 choose.setText("Negar");    
            }else{
                ComentarioService.Analisar(new Analise(id,false));
                 choose.setText("Manter");  
            }
        } catch (IOException | InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    @FXML
    void Negar(ActionEvent event) {
        try {
            ComentarioService.Apagar(id);
        } catch (IOException | InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void setId(int id) {
        this.id = id;
        ComentarioDto comment;
        try {
            comment = ComentarioService.find(id);
            if (comment.analise()) {
                choose.setText("Negar");    
            }else{
                choose.setText("Manter");    
            }
        } catch (IOException | InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

}