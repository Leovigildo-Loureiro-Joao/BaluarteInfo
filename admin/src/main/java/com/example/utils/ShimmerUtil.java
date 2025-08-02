package com.example.utils;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javafx.animation.Animation;
import javafx.animation.FadeTransition;
import javafx.animation.TranslateTransition;
import javafx.application.Platform;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
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

    public static void carregarImagem(String urls,double width,double height,Node node,ImageView imageView){
        StackPane shimmerPane = createShimmerPane(width, height);
        StackPane stack = (StackPane) node;
        stack.getChildren().add(shimmerPane);
        ScheduledExecutorService service = Executors.newSingleThreadScheduledExecutor();
        service.schedule(() -> {
            Platform.runLater(() -> {
                imageView.setPreserveRatio(false);
                imageView.setImage(new Image(urls));
                imageView.setClip(new javafx.scene.shape.Circle(100, 100, 100));
                imageView.setFitWidth(200);
                imageView.setFitHeight(200);
                // Fade out shimmer, fade in image
                FadeTransition fadeOut = new FadeTransition(Duration.seconds(0.5), shimmerPane);
                fadeOut.setToValue(0);
                fadeOut.setOnFinished(e -> stack.getChildren().remove(shimmerPane));
                fadeOut.play();

                FadeTransition fadeIn = new FadeTransition(Duration.seconds(0.5), imageView);
                fadeIn.setFromValue(0);
                fadeIn.setToValue(1);
                fadeIn.play();
            });
            service.shutdown();
        },2 , TimeUnit.SECONDS);
    }
}