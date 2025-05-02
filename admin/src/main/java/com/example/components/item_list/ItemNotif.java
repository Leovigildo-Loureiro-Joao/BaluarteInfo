package com.example.components.item_list;

import com.example.App;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

public class ItemNotif extends VBox{
     
    public ItemNotif(String texto,String data){
        this.setPadding(new Insets(10, 0, 10, 25));
        this.setAlignment(Pos.CENTER_RIGHT);
        ImageView image=new ImageView(new Image(App.class.getResourceAsStream("assets/notif.png")));
        image.setFitWidth(20);
        image.setFitHeight(20);
        image.setTranslateY(5);
        Text textos=new Text(texto);
        textos.setWrappingWidth(350);
        HBox hb= new HBox(image,textos);
        hb.setSpacing(10);
        Label lab=new Label(data);
        lab.setTranslateX(-30);
        this.getChildren().addAll(hb,lab);
        this.setHeight(50);
    }

    public void selectNow() {
        this.getStyleClass().add("select");
    }

    public void deselectNow() {
        this.getStyleClass().remove("select");
    }
    
}