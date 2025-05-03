package com.example.components.item_list;

import com.example.App;

import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;

public class ItemDash extends HBox{
    private ImageView image;
    private Label label;
    private String src;

    public ItemDash(String texto,String src){
        this.src=src;
        
        image=new ImageView(new Image(App.class.getResourceAsStream("assets/"+src+".png")));
        label=new Label(texto);
        
        this.setSpacing(20);
        this.getChildren().addAll(image,label);
    }

    public String selectNow() {
        image=new ImageView(new Image(App.class.getResourceAsStream("assets/"+src+"_color.png")));
        this.getStyleClass().add("select");
        this.getChildren().set(0, image);
        return src;
    }

    public void deselectNow() {
        image=new ImageView(new Image(App.class.getResourceAsStream("assets/"+src+".png")));
        this.getStyleClass().remove("select");
        this.getChildren().set(0, image);
    }

}
