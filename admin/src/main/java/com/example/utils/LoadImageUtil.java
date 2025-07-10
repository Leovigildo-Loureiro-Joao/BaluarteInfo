package com.example.utils;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.App;

import javafx.application.Platform;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Circle;

public class LoadImageUtil {

    public static ImageView ImageTime(){
        ImageView image=new ImageView(new Image(App.class.getResourceAsStream("assets/loader.gif")));        
        image.setFitHeight(200);
        image.setFitWidth(100);
        image.setPreserveRatio(true);
        return image;
    }

    public static ImageView ImageTimeRedound(double w,double h){
        ImageView image=new ImageView(new Image(App.class.getResourceAsStream("assets/loader.gif")));        
        image.setFitHeight(h);
        image.setFitWidth(w);
        image.setPreserveRatio(true);
        image.setClip(new javafx.scene.shape.Circle(100, 100, 100));
        return image;
    }

    public static  void preocessarBackground(StackPane url ,String urls,int tamanho,int altura,boolean circle){
        url.setPrefSize(tamanho, altura);
        Platform.runLater(() -> {
            url.setClip(circle?new Circle(altura/2,altura/2,altura/2):RedoundImageUtil.AddRedoundImage(tamanho, altura,10));
            url.getChildren().clear();
            url.setStyle("-fx-background-size:cover;-fx-background-image:url("+urls+")");
            url.setPrefSize(tamanho, altura);
        });  
    }


}


