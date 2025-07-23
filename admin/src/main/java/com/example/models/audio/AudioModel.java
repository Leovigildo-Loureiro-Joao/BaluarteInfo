package com.example.models.audio;

import java.lang.ModuleLayer.Controller;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.dto.audio.AudioDto;
import com.example.dto.artigo.ArtigoDto;
import com.example.utils.AudioMidiaUtil;
import com.example.utils.FadeTrasitionUtil;
import com.example.utils.LoadImageUtil;
import com.example.utils.RedoundImageUtil;
import com.example.utils.ShimmerUtil;
import com.jfoenix.controls.JFXButton;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.animation.FadeTransition;
import javafx.application.Platform;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressIndicator;
import javafx.scene.control.ScrollPane;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.media.Media;
import javafx.scene.text.Text;
import javafx.util.Duration;
import lombok.Getter;
import lombok.Setter;
import uk.co.caprica.vlcj.player.base.MediaPlayer;

@Getter @Setter
public class AudioModel extends StackPane{
    
    private Label titulo;
    private Label descricao;
    private ImageView imageView;
    private AudioMidiaUtil mediaPlayer;
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
    
   
    public AudioModel(AudioDto audioDto){
        this.titulo=new Label(audioDto.titulo());
        this.descricao=new Label(audioDto.descricao());
        this.imageView=new ImageView();
        // Carregar o áudio
        play.setDisable(true);
        after.setDisable(true);
        before.setDisable(true);
        CompletableFuture.runAsync(() -> Platform.runLater(() -> {
            try {
                this.mediaPlayer = new AudioMidiaUtil(audioDto.url());
                play.setDisable(false);
                after.setDisable(false);
                before.setDisable(false);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }));
        OrdenarModel();
        carregarImagem(audioDto.imagem());
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


    private void OrdenarModel() {
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
            mediaPlayer.forward();
        });
        before.setOnAction(event -> {
            mediaPlayer.backward();
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

    public void carregarImagem(String urls){
        double width = 318, height = 204;
        StackPane stack = (StackPane) ((ScrollPane) boxElements.getChildren().get(1)).getContent();
        StackPane shimmerPane = ShimmerUtil.createShimmerPane(width, height);
        stack.getChildren().add(shimmerPane);

        ScheduledExecutorService service = Executors.newSingleThreadScheduledExecutor();
        service.schedule(() -> {
            Platform.runLater(() -> {
                imageView.setPreserveRatio(false);
                imageView.setImage(new Image(urls));
                imageView.setClip(new javafx.scene.shape.Circle(100, 100, 100));
                imageView.setFitWidth(200);
                imageView.setFitHeight(200);
                // Fade out shimmer, fade in image
                FadeTransition fadeOut = new FadeTransition(Duration.seconds(0.5), shimmerPane);
                fadeOut.setToValue(0);
                fadeOut.setOnFinished(e -> stack.getChildren().remove(shimmerPane));
                fadeOut.play();

                FadeTransition fadeIn = new FadeTransition(Duration.seconds(0.5), imageView);
                fadeIn.setFromValue(0);
                fadeIn.setToValue(1);
                fadeIn.play();
            });
            service.shutdown();
        },1 , TimeUnit.SECONDS);
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
        Platform.runLater(() -> {
            mediaPlayer.toggle();
            if (mediaPlayer.getMediaPlayer().status().isPlaying()) {
                play.setGraphic(new FontAwesomeIconView(FontAwesomeIcon.PLAY,"15"));
            } else {
                play.setGraphic(new FontAwesomeIconView(FontAwesomeIcon.PAUSE,"15"));
            }
        });
    }

    public void stop(){
        mediaPlayer.stop();    
    }


    @Override
    public void finalize() throws Throwable {
        if (mediaPlayer != null) mediaPlayer.release();
        super.finalize();
    }

}
