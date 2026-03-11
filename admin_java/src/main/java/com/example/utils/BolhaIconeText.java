package com.example.utils;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Circle;
import javafx.scene.text.Text;

public class BolhaIconeText {
    public static StackPane Bob(int n,FontAwesomeIcon icone){
        
        StackPane l =new StackPane(new Circle(10),new Text(n+""));
        l.setTranslateY(-10);
        l.setTranslateX(10);
        StackPane bob=new StackPane(new FontAwesomeIconView(icone,"30"),l);
        bob.getStyleClass().add("bolha-reacao");
        return bob;
    }
}
