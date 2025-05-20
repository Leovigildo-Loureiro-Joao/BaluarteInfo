package com.example.controllers.pages;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.utils.ModalUtil;
import com.jfoenix.controls.JFXTextArea;
import com.jfoenix.controls.JFXToggleNode;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextField;
import javafx.scene.control.ToggleGroup;
import javafx.scene.layout.AnchorPane;

public class EditController implements Initializable{

  
    @FXML
    private JFXToggleNode checkSomos;

    @FXML
    private AnchorPane container;

    @FXML
    private JFXTextArea conteudo;

    @FXML
    private JFXTextArea missao;

    @FXML
    private ToggleGroup sectEdit;

    @FXML
    private JFXToggleNode sectSalva;

    @FXML
    private JFXTextArea trecho;

    @FXML
    private TextField versiculo;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
      
    }


    @FXML
    public void EditConteudo(ActionEvent event) {
        ModalUtil.Show("modalEdit");
    }

    @FXML
    public void EditMissao(ActionEvent event) {
        ModalUtil.Show( "modalVisao");
    }


    @FXML
    public void Select(ActionEvent event) {
        JFXToggleNode toggleNode=(JFXToggleNode)event.getTarget();
        toggleNode.getChildrenUnmodifiable().get(1).getStyleClass().remove("sel");
        if (toggleNode.equals(checkSomos)) {
            checkSomos.getChildrenUnmodifiable().get(1).getStyleClass().add("sel");
            sectSalva.getChildrenUnmodifiable().get(1).getStyleClass().remove("sel");
        }else{
            sectSalva.getChildrenUnmodifiable().get(1).getStyleClass().add("sel");
            checkSomos.getChildrenUnmodifiable().get(1).getStyleClass().remove("sel");
        }

    }

    @FXML
    public void EditeVBiblico(ActionEvent event) {
        ModalUtil.Show("modalVersiculo");
    }
    
}
