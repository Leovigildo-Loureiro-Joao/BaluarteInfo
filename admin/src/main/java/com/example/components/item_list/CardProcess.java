package com.example.components.item_list;

import com.example.utils.LoadImageUtil;
import com.jfoenix.controls.JFXButton;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.application.Platform;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressBar;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

public class CardProcess extends VBox{

    private Node image;
    private Label textos;

    public CardProcess(String texto){
        textos=new Label(texto);
        image=LoadImageUtil.ImageTime();
        getStyleClass().addAll("card","wait");
        getChildren().addAll(textos,image);
    }

    public void Error(String erro){
       Platform.runLater(() -> {
         textos.setText(erro);
        image=new FontAwesomeIconView(FontAwesomeIcon.WINDOW_CLOSE_ALT);
       });
    }

     public void Vazio(String info){
        Platform.runLater(() -> {
        textos.setText(info);
        image=new JFXButton("Voltar a carregar");
       });
        
    }
}
