package com.example.models;

import com.jfoenix.controls.JFXButton;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

public class ComentModel extends HBox{

    private Label descricao;
    private JFXButton trash=new JFXButton("",new FontAwesomeIconView(FontAwesomeIcon.TRASH_ALT,"20"));
    private JFXButton edit=new JFXButton("",new FontAwesomeIconView(FontAwesomeIcon.EDIT,"20"));
    
    public ComentModel(String descricao) {
        this.descricao=new Label(descricao);
        this.getChildren().addAll(this.descricao,new VBox(5, edit,trash));
        this.getStyleClass().addAll("card","coment-model");
    }



}
