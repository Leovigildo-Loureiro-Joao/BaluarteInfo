package com.example.controllers;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.models.UserModel;
import com.jfoenix.controls.JFXButton;

import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.Timeline;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.ScrollPane;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.util.Duration;

public class ModalActividadeDetalhesController implements Initializable{

   
    @FXML
    private JFXButton cancel;

    @FXML
    private VBox modal;

    @FXML
    private VBox use_box;

    @FXML
    private Text titleUser;


    @FXML
    private HBox boxSlideControl;

    private double startValue=0;

    @FXML
    private AnchorPane comentCard;

    @FXML
    private AnchorPane inscricaoCard;

    @FXML
    private ScrollPane overflowScroll;



    @FXML
    public void Deslisa(MouseEvent event) {
        AnimationScrollOverflow(0);
    }

    public void AnimationScrollOverflow(double value){
        Timeline time = new Timeline( new KeyFrame(Duration.ZERO,new KeyValue(overflowScroll.hvalueProperty(),startValue)),
        new KeyFrame(Duration.seconds(0.3),new KeyValue(overflowScroll.hvalueProperty(),value)));
        boxSlideControl.getChildren().forEach(t -> {
            t.getStyleClass().remove("select");
        });
        boxSlideControl.getChildren().get((int)value).getStyleClass().add("select");
        time.setAutoReverse(false);
        time.play();
        time.setOnFinished(event -> startValue=value);
    }
    @FXML
    public void Deslisa1(MouseEvent event) {
        AnimationScrollOverflow(1);
    }

    @FXML
    public void Deslisa2(MouseEvent event) {
        AnimationScrollOverflow(2);
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // TODO Auto-generated method stub
        Select1(null);
    }

    @FXML
    public void Select1(MouseEvent event) {
        RemoveSelectCard();
        comentCard.getStyleClass().add("select");
        titleUser.setText("Comentarios da actividade");
        use_box.getChildren().add(new UserModel("file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/user1.png","fsdfsdf","sdfsdfsdfsdfsdf"));
    }

    public void RemoveSelectCard(){
        comentCard.getStyleClass().remove("select");
        inscricaoCard.getStyleClass().remove("select");
        use_box.getChildren().clear();

    }

    @FXML
    public void Select2(MouseEvent event) {
        RemoveSelectCard();
        titleUser.setText("Pessoas inscritas para actividade");
        inscricaoCard.getStyleClass().add("select");
        use_box.getChildren().add(new UserModel("file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/user2.png","fsdfsdf","d df dfsd sd fsdf sdfs dfs df sdfs dfs dfs dfs dfsdf sdf sdf sdf sdfs dfs"));

    }
}
