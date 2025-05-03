package com.example.components.progress;

import static javafx.scene.control.ProgressIndicator.INDETERMINATE_PROGRESS;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.App;

import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.Timeline;
import javafx.beans.property.DoubleProperty;
import javafx.beans.property.DoublePropertyBase;
import javafx.beans.property.ReadOnlyBooleanWrapper;
import javafx.css.PseudoClass;
import javafx.scene.Group;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.shape.Arc;
import javafx.util.Duration;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Circle_progress  extends Group{

    private Arc ar;
    private Label value;
    private double progressValue;
    private DoubleProperty progress ;
    private ReadOnlyBooleanWrapper indeterminate;

    private static final PseudoClass PSEUDO_CLASS_DETERMINATE =
          PseudoClass.getPseudoClass("determinate");
    private static final PseudoClass PSEUDO_CLASS_INDETERMINATE =
            PseudoClass.getPseudoClass("indeterminate");
    

    public Circle_progress(int radius,int size,double translate,int values){
        ar = Arco(radius,0);
        value = new Label("0%");
        value.setPrefWidth(size);
        value.setPrefHeight(size);
        value.setTranslateX(translate);
        value.setTranslateY(translate);
        Pane pt = new Pane( Arco(radius,360),ar,value);
        ar.getStyleClass().add("arc_progress");
        value.getStyleClass().add("text_progress");
        value.setStyle("-fx-background-color:white;-fx-background-radius:60;-fx-alignment:center;");
        this.getChildren().add(pt);
        this.setId("pgranima");
        this.getStylesheets().add("file:"+App.class.getResource("styles/home.css").getFile());
        pt.setPrefHeight(90);
        setValue(values);
    }

    public Arc Arco(int radius,int length){
        Arc ar=new Arc(radius,radius,radius,radius,90,length);
        ar.setStrokeWidth(3.5);
        ar.setLayoutX(2.5);
        ar.setLayoutY(2.5);
        ar.getStyleClass().add("arc_percent");
        return ar;
    }

    public void setValue(double perc){
        progressValue=perc; 
       Thread.startVirtualThread(() -> {
            Timeline l = new Timeline(
                    new KeyFrame(Duration.millis(0),new KeyValue(progressProperty(), 0)),
                    new KeyFrame(Duration.millis(5000), new KeyValue(progressProperty(), perc*360))
            );
            l.play();
       });
       
      
    }

     public final DoubleProperty progressProperty() {
        if (progress == null) {
            progress = new DoublePropertyBase(-1.0) {
                @Override protected void invalidated() {
                    setIndeterminate(getProgress() < 0.0);
                }

                @Override
                public Object getBean() {
                    return Circle_progress.this;
                }

                @Override
                public String getName() {
                    return "progress";
                }
            };
            
            
        }
        float num=(float) (progress.get()*progressValue/(progressValue*100));
        if (progress.get()>0){
            ar.setLength(num);
            this.value.setText((int)(num/360*100)+"%");
        }
        return progress;
    }

    public final double getProgress() {
        float num=(float) (progress.get()*progressValue/(progressValue*100));
        this.value.setText((int)(num/360*100)+"%");
        ar.setLength(num);
        return progress == null ? INDETERMINATE_PROGRESS : progress.get();
    }
    
    private void setIndeterminate(boolean value) {
        indeterminatePropertyImpl().set(value);
    }
    
    private ReadOnlyBooleanWrapper indeterminatePropertyImpl() {
        if (indeterminate == null) {
            indeterminate = new ReadOnlyBooleanWrapper(true) {
                @Override protected void invalidated() {
                    final boolean active = get();
                    pseudoClassStateChanged(PSEUDO_CLASS_INDETERMINATE, active);
                    pseudoClassStateChanged(PSEUDO_CLASS_DETERMINATE,  !active);
                }

                @Override
                public Object getBean() {
                    return Circle_progress.this;
                }

                @Override
                public String getName() {
                    return "indeterminate";
                }
            };
        }
        return indeterminate;
    }

}