package com.example.utils;

import javafx.animation.FadeTransition;
import javafx.scene.Node;
import javafx.util.Duration;

public class FadeTrasitionUtil {
    
    public static void Fade (double seg,Node node,int to,int from){
        FadeTransition fadeTransition = new FadeTransition(Duration.seconds(seg), node);
        fadeTransition.setFromValue(from);
        fadeTransition.setToValue(to);
        fadeTransition.play();
    }

}