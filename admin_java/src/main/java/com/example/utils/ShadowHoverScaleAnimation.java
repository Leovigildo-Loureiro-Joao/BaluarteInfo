package com.example.utils;

import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.ScaleTransition;
import javafx.animation.Timeline;
import javafx.scene.Node;
import javafx.scene.effect.Effect;
import javafx.util.Duration;

public class ShadowHoverScaleAnimation {

    public static void AnimationCard(Node card){
        ScaleTransition transition=new ScaleTransition(Duration.seconds(.5), card);
       transition.setByX(0);
        
    }
}