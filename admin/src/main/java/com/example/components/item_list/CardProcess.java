package com.example.components.item_list;

import com.example.utils.LoadImageUtil;
import com.jfoenix.controls.JFXButton;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;

import javafx.scene.control.Label;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;

public class CardProcess extends VBox {

    private Label textos;

    public CardProcess(String texto){
        setWidth(300); // Definindo uma largura fixa para o card
       Process(texto);
    }

    public void Process(String texto) {
        textos = new Label(texto);
        ImageView imagemAtual = LoadImageUtil.ImageTime();  // Corrigido
        getStyleClass().setAll("inf-card","card", "wait");
        getChildren().setAll(textos, imagemAtual);
    }

    public void Error(String erro) {
        textos.setText(erro);
        FontAwesomeIconView erroIcone = new FontAwesomeIconView(FontAwesomeIcon.WARNING, "30");
        erroIcone.setStyle("-fx-fill: red;");
        getStyleClass().setAll("inf-card","card", "error"); // Adiciona classe diferente se quiser
        JFXButton botao = new JFXButton("Voltar a carregar");
        botao.setOnAction(e -> {
            Process("A processar ... ");
        });
        getChildren().setAll(textos, erroIcone,botao);
        Vazio(erro);
    }

    public void Vazio(String info) {
        textos.setText(info);
        JFXButton botao = new JFXButton("Voltar a carregar");
        botao.setOnAction(e -> {
            Process("A processar ... ");
        });
        getStyleClass().setAll("inf-card","card", "empty");
        getChildren().setAll(textos, botao);
    }

}
