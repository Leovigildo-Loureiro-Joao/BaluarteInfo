package com.example.utils;

import com.jfoenix.controls.JFXTextField;

import javafx.scene.shape.Rectangle;

public class RedoundImageUtil {

    public static Rectangle AddRedoundImage(double tamanho,double altura,double radius){
        Rectangle roundRectangle = new Rectangle(tamanho, altura);
        roundRectangle.setArcWidth(radius);
        roundRectangle.setArcHeight(radius);
        
        return roundRectangle;

    }
    


}
