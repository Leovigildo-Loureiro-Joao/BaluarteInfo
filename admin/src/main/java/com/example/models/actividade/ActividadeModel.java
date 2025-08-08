package com.example.models.actividade;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.App;
import com.example.configs.ApiCache;
import com.example.controllers.pages.MainController;
import com.example.dto.actividade.ActividadeDtoSimple;
import com.example.enums.ActividadeType;
import com.example.enums.DuracaoActividade;
import com.example.utils.FadeTrasitionUtil;
import com.example.utils.LoadImageUtil;
import com.example.utils.ModalUtil;
import com.example.utils.RedoundImageUtil;
import com.example.controllers.pages.*;
import com.jfoenix.controls.JFXButton;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import de.jensd.fx.glyphs.fontawesome.FontAwesomeIconView;
import javafx.application.Platform;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressIndicator;
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
public class ActividadeModel extends StackPane{
    private ActividadeDtoSimple dados;
    private Label titulo;
    private Label tema;
    private Label tipoEvento;
    private ProgressIndicator imagemAtual = new ProgressIndicator();  
    private Label organizador;
    private Label publicoAlvo;
    private DuracaoActividade duracao;
    private Label descricao;
    private Label telefone;
    private Label endereco;
    private String imagemUrl;
    private Label data;
    private Label hora;
    private VBox url=new VBox();
    private StackPane control=new StackPane();
    private StackPane block=new StackPane();
    private VBox bloco;
    HBox blocTopBox;
    VBox blocVBox;
    private VBox inputBloco=new VBox();
    private JFXButton addAtributos;
    private JFXButton expandir=new JFXButton("Expandir");
    private JFXButton more=new JFXButton("", new FontAwesomeIconView(FontAwesomeIcon.ELLIPSIS_H,"25"));
    private JFXButton edit=new JFXButton("", new FontAwesomeIconView(FontAwesomeIcon.EDIT,"20"));
    private JFXButton trash=new JFXButton("", new FontAwesomeIconView(FontAwesomeIcon.TRASH,"20"));
    private ActividadesController aController;

    public ActividadeModel(ActividadeDtoSimple data,ActividadesController aController) {
        dados=data;
        this.titulo=new Label(data.titulo());
        this.tema=new Label(data.tema());
        this.tipoEvento=new Label(data.tipoEvento().name());
        this.organizador=new Label(data.organizador());
        this.publicoAlvo=new Label(data.publicoAlvo().name());
        this.descricao=new Label(data.descricao());
        this.telefone=new Label(data.contactos());
        this.endereco=new Label(data.endereco());
        this.imagemUrl=data.img();
        this.duracao=data.duracao();
        this.data=new Label("Marcado para "+data.dataEvento().toLocalDate().toString());
        this.hora=new Label("Às  "+data.dataEvento().toLocalTime().getHour()+":"+
        data.dataEvento().toLocalTime().getMinute());
        this.aController=aController;
        imagemAtual.setPrefSize(50, 50);
        imagemAtual.getStyleClass().add("custom-progress");
        this.url.getChildren().add(imagemAtual);
        addAtributos=new JFXButton("Adicionar atributos");  
        OrdenarModel(imagemUrl);
        AddStyleClass();
        preocessarBackground(imagemUrl, 300, 130);
        Buttons();
        CriarControl();
    }

    private void OrdenarModel(String url){
        Region spacer = new Region();
        HBox moreBox=new HBox(spacer,more);
        HBox box=new HBox(data,hora);
        box.getStyleClass().add("seg-text");
        moreBox.setMargin(titulo, new javafx.geometry.Insets(0, 0, -20, 0));
        moreBox.setHgrow(spacer, Priority.ALWAYS);
        block.getChildren().addAll(moreBox,this.titulo);
        this.url.getChildren().addAll(block);
         VBox vb=new VBox(new Text("Descrição: "),this.descricao);
       
         HBox hb=new HBox(addAtributos,expandir);
         hb.getStyleClass().add("botao-box");
        bloco=new VBox(
            new HBox(new FontAwesomeIconView(FontAwesomeIcon.LINK,"20"),new Text("Tema: "),this.tema),
            new HBox(new FontAwesomeIconView(FontAwesomeIcon.TICKET,"20"),new Text("Tipo de evento: "),this.tipoEvento),
            new HBox(new FontAwesomeIconView(FontAwesomeIcon.USER,"20"),new Text("Organizador: "),this.organizador),
            new HBox(new FontAwesomeIconView(FontAwesomeIcon.GROUP,"20"),new Text("Público alvo: "),this.publicoAlvo),
           box);
         blocTopBox=new HBox(bloco);
         blocVBox=new VBox(
            vb,
            new HBox(new FontAwesomeIconView(FontAwesomeIcon.WHATSAPP,"20"),this.telefone),
            new HBox(new FontAwesomeIconView(FontAwesomeIcon.MAP_MARKER,"20"),this.endereco)
        );
        blocVBox.setOpacity(0);
         inputBloco.getChildren().addAll(new StackPane(this.url),new StackPane(blocTopBox,blocVBox),hb
           );   
        this.getChildren().add(inputBloco);
        this.getChildren().add(control);
        inputBloco.getStyleClass().add("mini");

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

    public void AddStyleClass(){
        control.getStyleClass().add("control-model");
        this.getStyleClass().addAll("card","actividade-model-block");
        inputBloco.getStyleClass().add("actividade-model");
        this.titulo.getStyleClass().add("titleModel");
        this.descricao.getStyleClass().add("text-descricao");
        blocVBox.getStyleClass().add("desc");
        bloco.getStyleClass().add("bloco");
        addAtributos.getStyleClass().add("buttonColor");
        expandir.getStyleClass().add("buttonWhite");
        url.getStyleClass().add("actividade-img");
        more.getStyleClass().add("more");
        block.getStyleClass().add("actividade-img-block");
    }

    public  void preocessarBackground(String urls,int tamanho,int altura){
        Platform.runLater(() -> {
            this.url.getChildren().remove(imagemAtual);
            this.url.setClip(RedoundImageUtil.AddRedoundImage(tamanho, altura,10));
            this.url.setStyle(this.getStyle().concat("-fx-background-image:  url("+urls+")"));
        });
 
    }

    public void Buttons(){
        addAtributos.setOnAction(event -> {
            ModalUtil.Show( "modalActividadeDetalhes");
        });
        
        
        expandir.setOnAction(event ->{
            if(blocTopBox.getOpacity()==0){
                FadeTrasitionUtil.Fade(.3, blocVBox, 0, 1);        
                FadeTrasitionUtil.Fade(.3, blocTopBox, 1, 0);
            }else{
                FadeTrasitionUtil.Fade(.3, blocTopBox, 0, 1);        
                FadeTrasitionUtil.Fade(.3, blocVBox, 1, 0);
            }
        });
       
        edit.setOnAction(event -> {
            ModalUtil.ShowEdit("modalActividade",aController,aController.content,dados);
            FadeTrasitionUtil.Fade(0.3, control, , 1);
            control.setMouseTransparent(true);
        });

        trash.setOnAction(event -> {
           ModalUtil.ShowDelete("modalActividade", aController, aController.content, dados.id(), dados.titulo(), () -> {
                aController.getActividades().remove(dados);
                aController.getActividadesTable().getItems().remove(dados);
                aController.getActividadesTable().refresh();
            });
            FadeTrasitionUtil.Fade(0.3, control, 0, 1);
            control.setMouseTransparent(true);
        });
        
    }


}
