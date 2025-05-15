package com.example.models;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.utils.LoadImageUtil;

import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

public class UserModel extends HBox{

    private StackPane img=new StackPane();
    private Text name;
    private Label descricao;
    private VBox blocBox;

    public UserModel(String src,String name,String descricao) {
        LoadImageUtil.preocessarBackground(this.img, src, 50, 50,true);
        this.name=new Text(name);
        this.descricao=new Label(descricao);
        blocBox=new VBox(this.name,this.descricao);
        this.getChildren().addAll(img,blocBox);
        this.getStyleClass().addAll("card","user-card");
        this.setSpacing(10);
    }




    
    
}