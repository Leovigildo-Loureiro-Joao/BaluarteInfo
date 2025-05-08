package com.example.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.App;
import com.example.utils.LoadImageUtil;
import com.example.utils.RedoundImageUtil;
import com.jfoenix.controls.JFXButton;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ActividadeModel extends VBox{
      
    private Label titulo;
    private Label tema;
    private Label tipoEvento;
    private Label organizador;
    private Label publicoAlvo;
    private Label descricao;
    private Label telefone;
    private Label email;
    private Label endereco;
    private String imagemUrl;
    private Label data;
    private Label hora;
    private StackPane url=new StackPane();
    private VBox bloco;
    private JFXButton addAtributos;
    
    public ActividadeModel(String titulo,String tema,String tipoEvento,String organizador,String publicoAlvo,
            String descricao,String telefone,String email,String endereco,String imagemUrl,LocalDateTime data){
        this.titulo=new Label(titulo);
        this.tema=new Label(tema);
        this.tipoEvento=new Label(tipoEvento);
        this.organizador=new Label(organizador);
        this.publicoAlvo=new Label(publicoAlvo);
        this.descricao=new Label(descricao);
        this.telefone=new Label(telefone);
        this.email=new Label(email);
        this.endereco=new Label(endereco);
        this.imagemUrl=imagemUrl;
        this.data=new Label(data.toLocalDate().toString());
        this.hora=new Label(data.toLocalTime().toString());
        this.url.getChildren().add(LoadImageUtil.ImageTime());
        addAtributos=new JFXButton("Adicionar atributos");
        OrdenarModel(imagemUrl);
        AddStyleClass();
        preocessarBackground(imagemUrl, 180, 240);
    }

    private void OrdenarModel(String url){
        Region spacer = new Region();
        HBox moreBox=new HBox(spacer,new FontAwesomeIconView(FontAwesomeIcon.ELLIPSIS_H,"25"));
        moreBox.setMargin(titulo, new javafx.geometry.Insets(0, 0, -20, 0));
        moreBox.setHgrow(spacer, Priority.ALWAYS);
        bloco=new VBox(moreBox,this.titulo,
            new HBox(new Text("Tema: "),this.tema),
            new HBox(new Text("Tipo de evento: "),this.tipoEvento),
            new HBox(new Text("Organizador: "),this.organizador),
            new HBox(new Text("Público alvo: "),this.publicoAlvo),
            new HBox(data,hora));
        HBox blocTopBox=new HBox(this.url,bloco);
        this.getChildren().addAll(blocTopBox,
            new VBox(new Text("Descrição: "),this.descricao),
            new HBox(new FontAwesomeIconView(FontAwesomeIcon.WHATSAPP,"20"),this.telefone,this.email),
            new HBox(new FontAwesomeIconView(FontAwesomeIcon.MAP_MARKER,"20"),this.endereco)
            ,addAtributos);    
    }

    public void AddStyleClass(){
        
        this.getStyleClass().add("card");
        this.getStyleClass().add("actividade-model");
        this.titulo.getStyleClass().add("titleModel");
        this.descricao.getStyleClass().add("text-descricao");
        bloco.getStyleClass().add("bloco");
        addAtributos.getStyleClass().add("buttonColor");
        url.getStyleClass().add("actividade-img");
    }

    public  void preocessarBackground(String urls,int tamanho,int altura){
        this.url.setPrefSize(tamanho, altura);
        ScheduledExecutorService service=Executors.newSingleThreadScheduledExecutor();
        service.schedule(() -> {
           Platform.runLater(() -> {
            this.url.getChildren().clear();
            this.url.setClip(RedoundImageUtil.AddRedoundImage(tamanho, altura,10));
            this.url.setStyle(this.getStyle().concat("-fx-background-image:url("+urls+")"));
            this.url.setPrefSize(tamanho, altura);
           });
           service.shutdown();
        }, 2, TimeUnit.SECONDS);
    }

    public void Buttons(){

    }


}
