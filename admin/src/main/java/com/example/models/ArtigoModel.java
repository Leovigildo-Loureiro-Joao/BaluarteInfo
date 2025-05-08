package com.example.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.App;
import com.example.utils.LoadImageUtil;
import com.example.utils.RedoundImageUtil;
import com.jfoenix.controls.JFXButton;

import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Rectangle;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ArtigoModel extends HBox{
      
    private Label titulo;
    private Label descricao;
    private Label escritor;
    private Label data;
    private Label hora;
    private VBox bloco;
    private HBox rown_1;
    private HBox rown_2;
    private VBox vb;
    private StackPane url=new StackPane();
    private JFXButton editButton;
    private JFXButton trushButton;

    public ArtigoModel(String titulo,String descricao,String escritor,String url,LocalDateTime data){
        this.titulo=new Label(titulo);
        this.descricao=new Label(descricao);
        this.escritor=new Label(escritor);
        this.data=new Label(data.toLocalDate().toString());
        this.hora=new Label(data.toLocalTime().toString());
        this.url.getChildren().add(LoadImageUtil.ImageTime());
        OrdenarModel(url);
    }

    private void OrdenarModel(String url){
        rown_1=new HBox(new Text("Escritor: "),this.escritor);
        vb=new VBox(new Text("Descrição: "),this.descricao);
        rown_2=new HBox(data,hora);
        trushButton=new JFXButton("Apagar");
        editButton=new JFXButton("Editar");
        HBox bt=new HBox(editButton,trushButton);
        bt.setSpacing(5);
        bloco=new VBox(this.titulo,rown_1,rown_2,vb,bt);
        bloco.setSpacing(10);
        AddStyleClass();
        preocessarBackground("file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/pexels-felixmittermeier-2832052.jpg",200,400);
        this.setSpacing(20);
        this.getChildren().addAll(this.url,bloco);
    }

    public void AddStyleClass(){
        this.titulo.getStyleClass().add("titleModel");
        this.getStyleClass().add("artigo-model");
        this.rown_2.getStyleClass().add("rown-blur-model");
        this.vb.getStyleClass().add("col-bold-model");
        this.rown_1.getStyleClass().add("rown-bold-model");
        this.url.getStyleClass().add("artigo-img");
        trushButton.getStyleClass().add("buttonColor");
        editButton.getStyleClass().add("buttonWhite");
    }

    public  void preocessarBackground(String urls,int tamanho,int altura){
        this.url.setPrefSize(tamanho, altura);
        ScheduledExecutorService service=Executors.newSingleThreadScheduledExecutor();
        service.schedule(() -> {
            
           Platform.runLater(() -> {
            this.url.setClip(RedoundImageUtil.AddRedoundImage(tamanho, altura,10));
            this.url.getChildren().clear();
            this.url.setStyle(this.getStyle().concat("-fx-background-image:url("+urls+")"));
            this.url.setPrefSize(tamanho, altura);
           });
           service.shutdown();
        }, 2, TimeUnit.SECONDS);
    }


    public void Buttons(){

    }


}
