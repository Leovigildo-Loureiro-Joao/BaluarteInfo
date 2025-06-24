package com.example.models.audio;

import java.lang.ModuleLayer.Controller;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.models.artigo.ArtigoDto;
import com.example.utils.AudioMidiaUtil;
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
import javafx.scene.text.Text;
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
        this.imageView=LoadImageUtil.ImageTimeRedound(200,200);
        imageView.setPreserveRatio(false);
        // Carregar o áudio
        try {
            this.mediaPlayer = new AudioMidiaUtil(audioDto.url());
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        
        OrdenarModel(audioDto.url());
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
        mediaPlayer.toggle();  
    }

    public void stop(){
        mediaPlayer.stop();    
    }

    public void pause(){
        mediaPlayer.toggle();    
    }

    @Override
    public void finalize() throws Throwable {
        if (mediaPlayer != null) mediaPlayer.release();
        super.finalize();
    }

}
