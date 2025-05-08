package com.example.utils;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.App;

import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class LoadImageUtil {

    public static ImageView ImageTime(){
        ImageView image=new ImageView(new Image(App.class.getResourceAsStream("assets/loader.gif")));        
        image.setFitHeight(200);
        image.setFitWidth(100);
        image.setPreserveRatio(true);
        return image;
    }

    public static ImageView ImageTimeRedound(){
        ImageView image=new ImageView(new Image(App.class.getResourceAsStream("assets/loader.gif")));        
        image.setFitHeight(300);
        image.setFitWidth(300);
        image.setPreserveRatio(true);
        image.setClip(new javafx.scene.shape.Circle(100, 100, 100));
        return image;
    }
}
