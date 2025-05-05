package com.example.models;

import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AudioModel extends VBox{
    
    private Label titulo;
    private Label descricao;
    private ImageView url;

   
    public AudioModel(String titulo,String descricao,String url){
        this.titulo=new Label(titulo);
        this.descricao=new Label(descricao);
       // this.url=;
    }


}
