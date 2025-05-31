package com.example.models;

import java.lang.ModuleLayer.Controller;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.utils.FadeTrasitionUtil;
import com.example.utils.LoadImageUtil;
import com.example.utils.RedoundImageUtil;
import com.jfoenix.controls.JFXButton;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.text.Text;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AudioModel extends StackPane{
    
    private Label titulo;
    private Label descricao;
    private ImageView imageView;
    private MediaPlayer mediaPlayer;
    private HBox header;
    private HBox containerMidiaController;
    private JFXButton more=new JFXButton("", new FontAwesomeIconView(FontAwesomeIcon.ELLIPSIS_H,"25"));
    private JFXButton play=new JFXButton();
    private JFXButton after=new JFXButton();
    private StackPane control=new StackPane();
    private VBox boxElements;
    private JFXButton before=new JFXButton();
    private JFXButton edit=new JFXButton("", new FontAwesomeIconView(FontAwesomeIcon.EDIT,"20"));
    private JFXButton trash=new JFXButton("", new FontAwesomeIconView(FontAwesomeIcon.TRASH,"20"));
    
   
    public AudioModel(String titulo,String descricao,String url,String imagem){
        this.titulo=new Label(titulo);
        this.descricao=new Label(descricao);
        this.imageView=LoadImageUtil.ImageTimeRedound(300,300);
        this.descricao = new Label(descricao);
        // Carregar o áudio
        URI uri = URI.create(url);
        Media media = new Media(uri.toString()); // URL do arquivo de áudio
        this.mediaPlayer = new MediaPlayer(media);
        OrdenarModel(url);
        carregarImagem(imagem);
    }

    public void CriarControl(){
        control.getChildren().add(new HBox(edit,trash));
        control.setOpacity(0);
        control.setMouseTransparent(true);
        more.setOnAction(event -> {
            FadeTrasitionUtil.Fade(0.3, control, 1, 0);
            control.setMouseTransparent(false);
        });
        control.setOnMouseClicked(event -> {
            if (event.getTarget().getClass().equals(StackPane.class)) {
                FadeTrasitionUtil.Fade(0.3, control, 0, 1);
                control.setMouseTransparent(true);
            }
        });
    }


    private void OrdenarModel(String url) {
        Region spacer = new Region();
        header=new HBox(titulo,spacer,more);
        AddControlsMidia();
        header.setHgrow(spacer, Priority.ALWAYS);
        boxElements= new VBox(header,OverFlowHideen(),containerMidiaController,new Text("Descrição"),descricao);
        this.getChildren().addAll(boxElements,control);
        AddStyleClass();
        CriarControl();
    }

    public void AddControlsMidia(){
        play.setGraphic(new FontAwesomeIconView(FontAwesomeIcon.PLAY,"15"));
        after.setGraphic(new FontAwesomeIconView(FontAwesomeIcon.FORWARD,"15"));
        before.setGraphic(new FontAwesomeIconView(FontAwesomeIcon.BACKWARD,"15"));
        containerMidiaController=new HBox(before,play,after);
        play.setOnAction(event -> start());
        after.setOnAction(event -> {
            mediaPlayer.seek(mediaPlayer.getCurrentTime().add(javafx.util.Duration.seconds(5)));
        });
        before.setOnAction(event -> {
            mediaPlayer.seek(mediaPlayer.getCurrentTime().subtract(javafx.util.Duration.seconds(5)));
        });
    }

    private ScrollPane OverFlowHideen (){
        ScrollPane scrollPane = new ScrollPane();
        StackPane stack=new StackPane(imageView);
        scrollPane.setContent(stack);
        scrollPane.setPrefSize(318, 204);
        stack.setPrefSize(318, 204);
        scrollPane.setVbarPolicy(ScrollPane.ScrollBarPolicy.NEVER);
        scrollPane.setHbarPolicy(ScrollPane.ScrollBarPolicy.NEVER);
        scrollPane.addEventFilter(javafx.scene.input.ScrollEvent.SCROLL, event -> event.consume());
        return scrollPane;
    }

    public  void carregarImagem(String urls){
        ScheduledExecutorService service=Executors.newSingleThreadScheduledExecutor();
        service.schedule(() -> {
           Platform.runLater(() -> {
            this.imageView.setImage(new Image(urls));    
           });
           service.shutdown();
        }, 2, TimeUnit.SECONDS);
    }



    public void AddStyleClass(){
        this.header.getStyleClass().add("head-audio");
        this.titulo.getStyleClass().add("titleModel");
        boxElements.getStyleClass().addAll("audio-model");
        this.getStyleClass().addAll("card","audio-model-block");
        control.getStyleClass().add("control-model");
        containerMidiaController.getStyleClass().add("midia-controller");
    }



    public void start(){
        if (mediaPlayer.getStatus() == MediaPlayer.Status.PLAYING) {
            mediaPlayer.pause();
            play.setGraphic(new FontAwesomeIconView(FontAwesomeIcon.PLAY,"15"));
        } else {
            mediaPlayer.play();
            play.setGraphic(new FontAwesomeIconView(FontAwesomeIcon.PAUSE,"15"));
        }
    }

    public void stop(){
        mediaPlayer.stop();    
    }

    public void pause(){
        mediaPlayer.pause();    
    }


}
