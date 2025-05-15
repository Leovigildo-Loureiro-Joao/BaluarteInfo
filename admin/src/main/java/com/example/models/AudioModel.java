package com.example.models;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

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
public class AudioModel extends VBox{
    
    private Label titulo;
    private Label descricao;
    private ImageView imageView;
    private MediaPlayer mediaPlayer;
    private HBox header;
    private HBox containerMidiaController;
    private FontAwesomeIconView more=new FontAwesomeIconView(FontAwesomeIcon.ELLIPSIS_H,"25");
    private JFXButton play=new JFXButton();
    private JFXButton after=new JFXButton();
    private JFXButton before=new JFXButton();
   
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



    private void OrdenarModel(String url) {
        Region spacer = new Region();
        header=new HBox(titulo,spacer,more);
        header.setHgrow(spacer, Priority.ALWAYS);
        AddControlsMidia();
        AddStyleClass();
        this.getChildren().addAll(header,OverFlowHideen(),containerMidiaController,new Text("Descrição"),descricao);
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
        this.getStyleClass().addAll("audio-model","card");
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
