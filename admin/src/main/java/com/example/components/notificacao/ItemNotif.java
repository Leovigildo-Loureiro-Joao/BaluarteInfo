package com.example.components.notificacao;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.enums.NotificacaoType;
import com.example.models.notification.NotificacaoModel;
import com.example.services.NotificacaoService;
import com.example.utils.DataFormater;
import com.jfoenix.controls.JFXComboBox;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.shape.Circle;
import javafx.scene.text.Text;

public class ItemNotif extends VBox{

    private final NotificacaoService notificacaoService=new NotificacaoService();
    private NotificacaoModel notificacao;

    public ItemNotif(NotificacaoModel notificacaoModel){
        this.setPadding(new Insets(10, 0, 10, 25));
        this.setAlignment(Pos.CENTER_RIGHT);
        notificacao=notificacaoModel;
        FontAwesomeIconView icone= new FontAwesomeIconView(Icones(notificacaoModel.type()));
        icone.setGlyphSize(20);
        icone.setTranslateY(5);
        this.setSpacing(15);
        Text textos=new Text(notificacaoModel.descricao());
        textos.setWrappingWidth(350);
        HBox hb= new HBox(icone,textos,new Circle(5));
        hb.setSpacing(10);
        Label lab=new Label(DataFormater.Formater(notificacaoModel.dataNotificacao()));
        lab.setTranslateX(-30);
        this.getChildren().addAll(hb,lab);
        this.setHeight(50);
        if (notificacaoModel.lido()) {
            this.getStyleClass().add("notif-read");
        } else {
            this.getStyleClass().add("notif-unread");
            
        }
    }

    public FontAwesomeIcon Icones(NotificacaoType tipo){
        switch (tipo) {
            case LEMBRETE:
                return FontAwesomeIcon.BELL;
            case GALERIA:
                return FontAwesomeIcon.PICTURE_ALT;
            default:
                return FontAwesomeIcon.SUBSCRIPT;
        }
    }

    public void selectNow() {
        this.getStyleClass().add("select");
        CompletableFuture.runAsync(() -> {
            try {
                notificacaoService.Ler(notificacao.id());
                this.getStyleClass().remove("notif-unread");
                this.getStyleClass().add("notif-read");
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }, App.getExecutorService());
      
        
    }

    public void deselectNow() {
        this.getStyleClass().remove("select");
        if (notificacao.lido()) {
            this.getStyleClass().remove("notif-unread");
            this.getStyleClass().add("notif-read");
        } else {
            this.getStyleClass().remove("notif-read");
            this.getStyleClass().add("notif-unread");
            
        }
    }
    
}