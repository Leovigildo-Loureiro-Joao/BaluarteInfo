package com.example.models.artigo;

import com.example.controllers.pages.ArtigoController;
import com.example.dto.artigo.ArtigoDto;
import com.example.enums.TableType;
import com.example.utils.LoadImageUtil;
import com.example.utils.ModalUtil;
import com.example.utils.ReacaoFormUtil;
import com.jfoenix.controls.JFXButton;

import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import lombok.Data;


@Data
@lombok.EqualsAndHashCode(callSuper = false)
public class ArtigoModel extends HBox{
      
    private Label titulo;
    private Label descricao;
    private Label escritor;
    private Label tipo;
    private Label data;
    private Label hora;
    private VBox bloco;
    private HBox rown_1;
    private HBox rown_2;
    private HBox rown_3;
    private VBox vb;
    private StackPane url=new StackPane();
    private JFXButton editButton;
    private JFXButton trushButton;
    private ArtigoDto dados;

    public ArtigoModel(ArtigoDto artigoDto,ArtigoController aController){
        this.titulo=new Label(artigoDto.titulo());
        this.descricao=new Label(artigoDto.descricao());
        this.escritor=new Label(artigoDto.escritor());
        this.tipo=new Label(artigoDto.tipo().name());
        this.data=new Label(artigoDto.dataPublicacao().toLocalDate().toString());
        this.hora=new Label(artigoDto.dataPublicacao().toLocalTime().toString());
        this.url.getChildren().add(LoadImageUtil.ImageTime());
        OrdenarModel(artigoDto.img());
        Fuctions(aController);
    }

    private void OrdenarModel(String url){
        rown_1=new HBox(new Text("Escritor: "),this.escritor);
        rown_3=new HBox(new Text("Tipo de Artigo: "),this.tipo);
        vb=new VBox(new Text("Descrição: "),this.descricao);
        rown_2=new HBox(data,hora);
        trushButton=new JFXButton("Apagar");
        editButton=new JFXButton("Editar");
        HBox bt=new HBox(editButton,trushButton);
        bt.setSpacing(5);
        bloco=new VBox(this.titulo,rown_1,rown_2,rown_3,vb,bt);
        bloco.setSpacing(10);
        AddStyleClass();
        LoadImageUtil.preocessarBackground(this.url,"file:///home/devpro/Documentos/GitHub/BaluarteInfo/admin/src/main/resources/com/example/assets/pexels-felixmittermeier-2832052.jpg",200,400,false);
        this.setSpacing(20);
        this.getChildren().addAll(this.url,bloco); 
    }

    public void AddStyleClass(){
        this.titulo.getStyleClass().add("titleModel");
        this.getStyleClass().add("artigo-model");
        this.rown_2.getStyleClass().add("rown-blur-model");
        this.vb.getStyleClass().add("col-bold-model");
        this.rown_1.getStyleClass().add("rown-bold-model");
        this.rown_3.getStyleClass().add("rown-bold-model");
        this.url.getStyleClass().add("artigo-img");
        trushButton.getStyleClass().add("buttonColor");
        editButton.getStyleClass().add("buttonWhite");
    }

    


    public void Fuctions(ArtigoController aController){
        trushButton.setOnAction((event) -> {
             ModalUtil.ShowComfirm(TableType.Actividade,dados.id(),()->{
                vController.listVideos.getChildren().remove(this);
                ReacaoFormUtil.Reagir("corret","O Video foi eliminado da base de dados com sucesso" , vController.img, vController.info);
           });
        });
        
        editButton.setOnAction((event) -> {
            
        });
    }


}
