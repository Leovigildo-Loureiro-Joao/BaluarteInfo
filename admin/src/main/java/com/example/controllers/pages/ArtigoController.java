package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.controllers.Controller;
import com.example.enums.ArtigoType;
import com.example.enums.FileType;
import com.example.dto.actividade.ActividadeDtoSimple;
import com.example.models.actividade.ActividadeModel;
import com.example.dto.artigo.ArtigoDto;
import com.example.dto.artigo.ArtigoRegister;
import com.example.models.artigo.ArtigoModel;
import com.example.services.ArtigoService;
import com.example.utils.FormAnaliserUtil;
import com.example.utils.ModalUtil;
import com.example.utils.ReacaoFormUtil;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXComboBox;
import com.jfoenix.controls.JFXButton;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class ArtigoController implements Controller{

   
    

    @FXML
    private AnchorPane content;

    @FXML
    private JFXComboBox<String> filtro;

    @FXML
    private FlowPane listArtigo;

    private ArtigoService artigoService = new ArtigoService();

    public CardProcess card = null;

    private StackPane fundo;

    private ImageView img;

    @FXML
    private VBox form;

    private Label info;


   
    @Override
    public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
        this.info=info;
        this.img=img;
    }
   

    public void AddArtigo(JFXButton actionButton,ArtigoRegister artigoRegister,VBox form){
        
        CompletableFuture.supplyAsync(() -> {
            try {
                return artigoService.postArtigo(artigoRegister);
            } catch (IOException | InterruptedException e) {
                return null;
            }catch(Exception e){
                System.out.println(e.getMessage());
                return null;
            }
        }, App.getExecutorService()).thenAccept(artigo -> {
            Platform.runLater(() -> {
                actionButton.setDisable(false);
                if (artigo == null) {
                    ReacaoFormUtil.Reagir("error","Erro! O artigo não foi adicionado a base de dados" , img, info);
                    return;
                }
                if(listArtigo.getChildren().contains(card))
                    listArtigo.getChildren().remove(card);
                listArtigo.getChildren().add(0,new ArtigoModel(artigo));
                FormAnaliserUtil.CleanForm(form);
                ReacaoFormUtil.Reagir("corret","O Artigo foi adicionado com sucesso" , img, info);
            });
        });
    }

    @FXML
    void Pesquisar(ActionEvent event) {

    }

     @FXML
    void Add(){
        ModalUtil.Show("modalArtigo",this,content);
    }



    @Override
    public void initialize(URL location, ResourceBundle resources) {
        AddDetails();
        loadArtigo();    
    }

    private void AddDetails(){
        filtro.getItems().addAll(ArtigoType.Lista());
    }

    @Override
    public void Show() {
     if (listArtigo.getChildren().isEmpty()) {
          loadArtigo();  
      }
    }

    private void loadArtigo(){
        listArtigo.getChildren().clear();
        card=new CardProcess("Buscando os Artigos");
        listArtigo.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return artigoService.allArtigos();
            } catch (Exception e) {
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if (t == null) {
                    card.Error("Erro ao buscar artigos", () -> loadArtigo());
                    return;
                }
                if (t.isEmpty()) {
                    card.Vazio("Sem artigos",() -> loadArtigo());
                }else{
                  
                    for (ArtigoDto artigoDto : t) {
                        listArtigo.getChildren().addAll(new ArtigoModel(artigoDto));
                    }
                }
            });
        });
        
    }

}
