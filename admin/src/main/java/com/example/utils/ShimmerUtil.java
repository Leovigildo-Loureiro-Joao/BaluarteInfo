package com.example.utils;

import javafx.animation.Animation;
import javafx.animation.TranslateTransition;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.util.Duration;

public class ShimmerUtil {

    public static StackPane createShimmerPane(double width, double height) {
        Rectangle shimmer = new Rectangle(width, height);
        shimmer.setArcWidth(10);
        shimmer.setArcHeight(10);
        shimmer.setFill(Color.web("#e0e0e0"));

        Rectangle light = new Rectangle(width, height);
        light.getStyleClass().add("shimmer-light");
        light.setArcWidth(10);
        light.setArcHeight(10);
        StackPane shimmerPane = new StackPane(shimmer, light);

        TranslateTransition shimmerAnim = new TranslateTransition(Duration.seconds(1.2), light);
        shimmerAnim.setFromX(-width);
        shimmerAnim.setToX(width);
        shimmerAnim.setCycleCount(Animation.INDEFINITE);
        shimmerAnim.play();

        shimmerPane.setPrefSize(width, height);
        return shimmerPane;
    }
}