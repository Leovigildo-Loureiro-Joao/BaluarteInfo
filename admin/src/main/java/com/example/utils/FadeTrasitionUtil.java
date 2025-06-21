package com.example.utils;

import javafx.animation.FadeTransition;
import javafx.animation.TranslateTransition;
import javafx.scene.Node;
import javafx.util.Duration;

public class FadeTrasitionUtil {
    
    public static void Fade (double seg,Node node,int to,int from){
        FadeTransition fadeTransition = new FadeTransition(Duration.seconds(seg), node);
        fadeTransition.setFromValue(from);
        fadeTransition.setToValue(to);
        fadeTransition.play();
    }

        
    public static void FadeTop (double seg,Node node,int to,int from){
        TranslateTransition translateTransition = new TranslateTransition(Duration.seconds(seg), node);
        FadeTransition fadeTransition = new FadeTransition(Duration.seconds(seg), node);
        translateTransition.setFromY(-10);
        translateTransition.setToY(0);
        fadeTransition.setFromValue(from);
        fadeTransition.setToValue(to);
        translateTransition.play();
        fadeTransition.play();
    }

}