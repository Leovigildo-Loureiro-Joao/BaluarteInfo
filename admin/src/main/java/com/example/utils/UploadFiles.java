package com.example.utils;

import java.io.File;

import com.example.enums.FileType;

import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.stage.FileChooser;

public class UploadFiles {

    public static void Uplaod(FileType tipo,Node node,Node parent){
        try {
            FileChooser f = new FileChooser();
            f.setTitle("Buscar imagem");
            FileChooser.ExtensionFilter imageFilter =null;
            File select = null;
            switch (tipo) {
                case Image:
                    imageFilter = new FileChooser.ExtensionFilter("Imagens", "*.png", "*.jpg", "*.gif", "*.bmp");
                    ImageView imageView=(ImageView)node;    
                    f.getExtensionFilters().add(imageFilter);
                    select = f.showOpenDialog(parent.getScene().getWindow());        
                    imageView.setImage(new Image(select.toURI().toURL().openStream()));
                    break;
                case Audio:
                    imageFilter = new FileChooser.ExtensionFilter("Audios", "*.mp3", "*.wav");
                    break;
                default:
                    imageFilter = new FileChooser.ExtensionFilter("Documentos", "*.pdf");
                    f.getExtensionFilters().add(imageFilter);
                    select = f.showOpenDialog(parent.getScene().getWindow());
                    TextField textField=(TextField)node;
                    textField.setText(select.getPath());
                    break;
            }
           
            //buffer=select.getPath();
            //nomeImg=select.getName();
        } catch (Exception ex) {
        }
    }

}
