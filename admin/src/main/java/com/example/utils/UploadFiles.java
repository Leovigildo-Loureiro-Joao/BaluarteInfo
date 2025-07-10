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
    public static  File artigoFile;
    public static  File audioFile;
    public static  File imgFile;
    public static void Uplaod(FileType tipo,Node node,Node parent){
        try {
            FileChooser f = new FileChooser();
            FileChooser.ExtensionFilter imageFilter =null;
            switch (tipo) {
                case Image:
                    f.setTitle("Buscar imagem");
                    imageFilter = new FileChooser.ExtensionFilter("Imagens", "*.png", "*.jpg", "*.gif", "*.bmp");
                    ImageView imageView=(ImageView)node;    
                    f.getExtensionFilters().add(imageFilter);
                    imgFile = f.showOpenDialog(parent.getScene().getWindow());        
                    imageView.setImage(new Image(imgFile.toURI().toURL().openStream()));
                    break;
                case Audio:
                f.setTitle("Buscar audio");
                    imageFilter = new FileChooser.ExtensionFilter("Audios", "*.mp3", "*.wav");
                    f.getExtensionFilters().add(imageFilter);
                    audioFile = f.showOpenDialog(parent.getScene().getWindow());
                    TextField textFields=(TextField)node;
                    textFields.setText(audioFile.getPath());
                    break;
                default:
                f.setTitle("Buscar artigo");
                    imageFilter = new FileChooser.ExtensionFilter("Documentos", "*.pdf");
                    f.getExtensionFilters().add(imageFilter);
                    artigoFile = f.showOpenDialog(parent.getScene().getWindow());
                    TextField textField=(TextField)node;
                    textField.setText(artigoFile.getPath());
                    break;
            }
           
            //buffer=select.getPath();
            //nomeImg=select.getName();
        } catch (Exception ex) {
        }
    }

}
