package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;

import com.example.configs.ApiCache;
import com.example.controllers.pages.MainController;
import com.example.dto.InscritoDto;
import com.example.dto.comentario.ComentarioDto;
import com.example.enums.UserDataType;
import com.example.models.user.UserDtoData;
import com.example.models.user.UserModel;
import com.example.services.ActividadeService;
import com.example.services.LoginService;
import com.example.utils.ModalUtil;
import com.jfoenix.controls.JFXButton;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.RotateTransition;
import javafx.animation.Timeline;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
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
    
    @FXML
    private Label comment;

    @FXML
    private Label inscrit;
    RotateTransition rTransition;
    private StackPane fundo;
    private int id;

    private double startValue;
    private List<ComentarioDto> comments=new ArrayList<>();
    private List<InscritoDto> inscritos=new ArrayList<>();

    @FXML
    void AddTrailer(ActionEvent event) {
        ModalUtil.Show("modalVideo",() ->  ModalUtil.Show("modalActividadeDetalhes",id));
    }

    @FXML
    void AddimageGaleria(MouseEvent event) {
        ModalUtil.Show("modalImagemAdd",() ->  ModalUtil.Show("modalActividadeDetalhes",id));
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
        MainController controller=(MainController) ApiCache.getTelaCache("main")[0];
        fundo=controller.conteinerModal;
    }

    @FXML
    public void Select1(MouseEvent event) throws IOException, InterruptedException {
        Actualizar();
        RemoveSelectCard();
        comentCard.getStyleClass().add("select");
        titleUser.setText("Comentarios da actividade");
        
        for (ComentarioDto comment : comments) {
            use_box.getChildren().add(new UserModel(comment.imagem(),comment.name(),comment.descricao(),UserDataType.Comentarios,id,comment.id()));    
        }
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
    
    public void Actualizar(){
       try {
           comments=ActividadeService.getComentarios(id);
           inscritos=ActividadeService.getInscritos(id);
           comment.setText( comments.size()+"");
            inscrit.setText(inscritos.size()+"");
       } catch (IOException ex) {
           Logger.getLogger(ModalActividadeDetalhesController.class.getName()).log(Level.SEVERE, null, ex);
       } catch (InterruptedException ex) {
           Logger.getLogger(ModalActividadeDetalhesController.class.getName()).log(Level.SEVERE, null, ex);
       }
       

    }

    @FXML
    public void Select2(MouseEvent event) throws IOException, InterruptedException {
         Actualizar();
        RemoveSelectCard();
        for (InscritoDto inscrito : inscritos) {
            UserDtoData user=LoginService.FindUser(inscrito.idUser());
            use_box.getChildren().add(new UserModel(user.img(),user.nome(),user.email(),UserDataType.Perfil,id,0));    
        }
        titleUser.setText("Pessoas inscritas para actividade");
        inscricaoCard.getStyleClass().add("select");
        //System.out.println(ActividadeService.getInscritos(id));
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
        try {
            Select1(null);
        } catch (IOException | InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
    
    
}
