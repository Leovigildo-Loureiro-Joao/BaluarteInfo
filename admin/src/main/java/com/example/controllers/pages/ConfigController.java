package com.example.controllers.pages;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.controllers.Controller;

import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;

public class ConfigController implements Controller{
    private StackPane fundo;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        
    }

    @Override
    public void Show() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'Show'");
    }

          @Override
      public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
      }
   
}
