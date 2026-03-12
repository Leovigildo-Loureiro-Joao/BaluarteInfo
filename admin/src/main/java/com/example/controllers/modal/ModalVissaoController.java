package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.models.ComentModel;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXTextArea;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

public class ModalVissaoController implements Initializable{

    @FXML
    private JFXButton cancel;

    @FXML
    private TextArea info;

    @FXML
    private Text title;

        @FXML
    private VBox listData;

    @FXML
    void Alterar(ActionEvent event) {

    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        listData.getChildren().add(new ComentModel("sfsdfsdfsdf dfgdf df gdf df dfg df gdf gdfgd fgd fgdfgdfg gdf dfg"));
    }


    
}
