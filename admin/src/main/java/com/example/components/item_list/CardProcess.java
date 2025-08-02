package com.example.components.item_list;

import com.example.utils.LoadImageUtil;
import com.jfoenix.controls.JFXButton;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.image.ImageView;
import javafx.scene.control.ProgressIndicator;
import javafx.scene.layout.VBox;

public class CardProcess extends VBox {

    private Label textos;

    public CardProcess(String texto){
        setWidth(300); // Definindo uma largura fixa para o card
       Process(texto);
    }

    public void Process(String texto) {
        textos = new Label(texto);
        ProgressIndicator imagemAtual = new ProgressIndicator();  
        imagemAtual.setPrefSize(50, 50);
        imagemAtual.getStyleClass().add("custom-progress");
        getStyleClass().setAll("inf-card","card", "wait");
        getChildren().setAll(textos, imagemAtual);
    }

    public void Error(String erro,Runnable acao) {
        Platform.runLater(() -> {
              textos.setText(erro);
            FontAwesomeIconView erroIcone = new FontAwesomeIconView(FontAwesomeIcon.WARNING, "15");
            getStyleClass().setAll("inf-card","card", "error"); // Adiciona classe diferente se quiser
            JFXButton botao = new JFXButton("Voltar a carregar");
            botao.setOnAction(e -> {
                acao.run();
            });
            botao.setGraphic(erroIcone);
            getChildren().setAll(textos,botao);
        });
      
    }

    public void Vazio(String info,Runnable acao) {
        textos.setText(info);
        JFXButton botao = new JFXButton("Voltar a carregar");
        botao.setOnAction(e -> {
            acao.run();
        });
        getStyleClass().setAll("inf-card","card", "empty");
        getChildren().setAll(textos, botao);
    }

}
