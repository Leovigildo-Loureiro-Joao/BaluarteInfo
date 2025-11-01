package com.example.controllers.modal;

import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.configs.ApiCache;
import com.example.controllers.pages.MainController;
import com.example.dto.InscritoDto;
import com.example.dto.comentario.ComentarioDto;
import com.example.dto.midia.MidiaSimple;
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
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.GridPane;
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
    private StackPane commentAll;

    @FXML
    private StackPane commentNview;

    @FXML
    private StackPane commentView;

    @FXML
    private VBox use_box;
     @FXML
    private HBox use_box_min;
    
    @FXML
    private Label comment;

    @FXML
    private Label inscrit;
     @FXML
    private HBox contentComent;
    RotateTransition rTransition;
    private StackPane fundo;
    private int id;

    private double startValue;
    private List<ComentarioDto> comments=new ArrayList<>();
    private List<InscritoDto> inscritos=new ArrayList<>();
    private List<ComentarioDto> commentsUser;
    private List<MidiaSimple> midia=new ArrayList<>();
    @FXML
    private GridPane galeria;
    @FXML
    private GridPane traillers;

    public AnchorPane content;

    @FXML
    void AddTrailer(ActionEvent event) {
        ModalUtil.Show("modalVideo",() ->  ModalUtil.Show("modalActividadeDetalhes",content,id));
    }

    @FXML
    void AddimageGaleria(MouseEvent event) {
        ModalUtil.Show("modalImagemAdd",() ->  ModalUtil.Show("modalActividadeDetalhes",content,id),content,id);
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
    public void Deslisa1(MouseEvent event)  {
        AnimationScrollOverflow(1);
        galeria.getChildren().clear();
        CompletableFuture.supplyAsync(() -> {
             try {
                return ActividadeService.galeriaGet(id);
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            } 
           return null;
        }).thenAccept(arg0 -> {
            Platform.runLater(() -> {
                int l=0,c=0;
                for (MidiaSimple midiaSimple : arg0) {
                    galeria.add(midiaSimple.GaleriaImage(), l, c);
                    c++;
                    if (c==2) {
                        c=0;
                        l++;
                    }
                }
           });  
        });
    }

    @FXML
    public void Deslisa2(MouseEvent event) throws IOException, InterruptedException {
        AnimationScrollOverflow(2);
         traillers.getChildren().clear();
         CompletableFuture.supplyAsync(() -> {
            try {
                List<MidiaSimple> lista=ActividadeService.trailerGet(id);
                return lista;
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
            return null;
         }).thenAccept((list)->{
             Platform.runLater(() -> {
                int l=0,c=0;
                for (MidiaSimple midiaSimple : list) {
                    traillers.add(midiaSimple.Trailler(), l, c);
                    c++;
                    if (c==2) {
                        c=0;
                        l++;
                    }
                }
             });
         });
    }

 
    

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        MainController controller=(MainController) ApiCache.getTelaCache("main")[0];
        fundo=controller.conteinerModal;
        AnimationScrollOverflow(0);
    }

    @FXML
    public void Select1(MouseEvent event) throws IOException, InterruptedException {
        Actualizar();
        comentCard.getStyleClass().add("select");
    }

   
    
    public void Actualizar(){
        Platform.runLater(()->  SelectCommentView(1));
        CompletableFuture.runAsync(() -> {
            try {
                inscritos=ActividadeService.getInscritos(id);
                comment.setText( ActividadeService.getComentariosAll(id).size()+"");
                inscrit.setText(inscritos.size()+"");
                use_box_min.getChildren().clear();
                for (InscritoDto inscrito : inscritos) {
                    UserDtoData user=LoginService.FindUser(inscrito.idUser());
                    use_box_min.getChildren().add(new UserModel(user.img(),user.nome(),user.email(),UserDataType.Perfil,id,0));    
                }
            } catch (IOException ex) {
                Logger.getLogger(ModalActividadeDetalhesController.class.getName()).log(Level.SEVERE, null, ex);
            } catch (InterruptedException ex) {
                Logger.getLogger(ModalActividadeDetalhesController.class.getName()).log(Level.SEVERE, null, ex);
            }
        });
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
        try {
            Select1(null);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

       

    private void SelectCommentView(int i){
        contentComent.getChildren().forEach((node)-> node.getStyleClass().remove("select"));
        contentComent.getChildren().get(i).getStyleClass().add("select");
        use_box.getChildren().clear();
            try {
                switch (i) {
                    case 1:
                        commentsUser=ActividadeService.getComentariosAll(id);
                        break;
                    case 2:
                        commentsUser=ActividadeService.getComentarios(id,false);       
                        break;
                    case 3:
                        commentsUser=ActividadeService.getComentarios(id,true);       
                        break;
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }       
       CompletableFuture.runAsync(() -> {
         for (ComentarioDto comment : commentsUser) {
            UserModel userModel = new UserModel(comment.imagem(),comment.name(),comment.descricao(),UserDataType.Comentarios,id,comment.id());
            if (!comment.analise()) 
                userModel.getStyleClass().add("no_view");
            use_box.getChildren().add(userModel);    
        }
       });

    }

    @FXML
    void Todos(MouseEvent event) {
        SelectCommentView(1);
    }

    @FXML
    void Vistos(MouseEvent event) {
        SelectCommentView(3);
    }

    @FXML
    void NVistos(MouseEvent event) {
        SelectCommentView(2);
    }
    
    
}
