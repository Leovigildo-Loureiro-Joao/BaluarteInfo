package com.example.components.item_list;

import com.example.App;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;

public class ItemDash extends HBox{
    private FontAwesomeIconView image;
    private Label label;
    private String src;

    public ItemDash(String texto,FontAwesomeIcon icon) {
        this.src=texto.toLowerCase().replace(" ", "_");
        image=new FontAwesomeIconView(icon);
        image.setGlyphSize(25);
        label=new Label(texto);
        
        this.setSpacing(20);
        this.getChildren().addAll(image,label);
    }

    public String selectNow() {
        this.getStyleClass().add("select");
        return src;
    }

    public void deselectNow() {
        this.getStyleClass().remove("select");
    }

}
