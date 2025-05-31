package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.configs.ApiCache;
import com.example.controllers.pages.MainController;
import com.example.enums.UserDataType;
import com.example.models.UserModel;
import com.example.utils.ModalUtil;
import com.jfoenix.controls.JFXButton;

import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.RotateTransition;
import javafx.animation.Timeline;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.ScrollPane;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.text.Text;
import javafx.util.Duration;

public class ModalActividadeDetalhesController implements Initializable{

   
   @FXML
    private HBox boxSlideControl;

    @FXML
    private JFXButton cancel;

    @FXML
    private AnchorPane comentCard;

    @FXML
    private AnchorPane inscricaoCard;

    @FXML
    private VBox modal;

    @FXML
    private ScrollPane overflowScroll;

    @FXML
    private Circle circle1;

    @FXML
    private Circle circle2;
    @FXML
    private AnchorPane title;

    @FXML
    private Text titleUser;

    @FXML
    private VBox use_box;
    RotateTransition rTransition;
    private StackPane fundo;

    private double startValue;

    @FXML
    void AddTrailer(ActionEvent event) {
        ModalUtil.Show("modalVideo");
    }

    @FXML
    void AddimageGaleria(MouseEvent event) {
        ModalUtil.Show("modal");
    }



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
        MainController controller=(MainController) ApiCache.getTelaCache("main")[0];
        fundo=controller.conteinerModal;
    }

    @FXML
    public void Select1(MouseEvent event) {
        RemoveSelectCard();
        comentCard.getStyleClass().add("select");
        titleUser.setText("Comentarios da actividade");
        use_box.getChildren().add(new UserModel("file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/user2.png","Carla dos Samtos","Mas que lixo e esse nao faz sentido nada escrito neste artigo ",UserDataType.Comentarios));
        
        CircleRotate(circle1);
    }

    public void RemoveSelectCard(){
        comentCard.getStyleClass().remove("select");
        inscricaoCard.getStyleClass().remove("select");
        use_box.getChildren().clear();
        if (rTransition!=null) {
            rTransition.stop();
        }
        
    }

    @FXML
    public void Select2(MouseEvent event) {
        RemoveSelectCard();
        use_box.getChildren().add(new UserModel("file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/user1.png","Tomas Tomshon","tomastomshon@gmail.com",UserDataType.Perfil));
        titleUser.setText("Pessoas inscritas para actividade");
        inscricaoCard.getStyleClass().add("select");
        
        CircleRotate(circle2);
    }


    private void CircleRotate(Circle circle){
        rTransition = new RotateTransition(Duration.seconds(2),circle);
        rTransition.setFromAngle(0);
        rTransition.setToAngle(360);
        rTransition.setCycleCount(RotateTransition.INDEFINITE); // repetir pra sempre
        rTransition.setInterpolator(javafx.animation.Interpolator.LINEAR); // rotação constante
        rTransition.play();


    }
}
