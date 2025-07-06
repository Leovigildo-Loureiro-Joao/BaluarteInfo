package com.example.controllers;

import com.example.components.item_list.CardProcess;

import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;

public interface Controller extends Initializable{

    public void Show();

    public void Fundo(StackPane fundo,Label info,ImageView img);

}
