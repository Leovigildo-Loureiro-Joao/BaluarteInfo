package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.enums.TableType;
import com.example.services.ActividadeService;
import com.jfoenix.controls.JFXButton;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class ModalComfirmController implements Initializable {

    private int id=-1;
    private TableType tabela;
    @FXML
    private JFXButton continuar;
     @FXML
    private JFXButton cancel;

    public void Init(int id,TableType tabela, Runnable action){
        this.id = id;
        this.tabela = tabela;
        
        continuar.setOnAction(event -> {
            if(Continuar())
                action.run();
             cancel.fire();
        });
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // TODO Auto-generated method stub
        
    }

    boolean Continuar() {
        try {
            if(id!=-1){
                switch (tabela) {
                    case Actividade:
                        return ActividadeService.deleteActividade(id);            
                    case Artigo:
                        return false;
                    case Audio:
                        return false;
                    case Video:
                        return false;
                }
            
            }
        } catch (Exception e) {
            return false;
        }
        return false;

    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

}
