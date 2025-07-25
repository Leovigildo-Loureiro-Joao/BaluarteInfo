package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import com.example.App;
import com.example.components.item_list.CardProcess;
import com.example.configs.ApiCache;
import com.example.controllers.Controller;
import com.example.enums.ActividadeType;
import com.example.enums.DuracaoActividade;
import com.example.enums.FileType;
import com.example.enums.PublicoAlvoType;
import com.example.dto.actividade.*;
import com.example.models.actividade.ActividadeModel;
import com.example.services.ActividadeService;
import com.example.utils.FormAnaliserUtil;
import com.example.utils.ModalUtil;
import com.example.utils.ReacaoFormUtil;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXComboBox;

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.ToggleButton;
import javafx.scene.control.ToggleGroup;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import jfxtras.scene.control.LocalDateTimeTextField;

public class ActividadesController implements Controller{
    
    @FXML
    private AnchorPane content;

    @FXML
    private JFXComboBox<String> filtro;

    @FXML
    public FlowPane listActividade;

    @FXML
    private TextField pesqBloco;

    @FXML
    private JFXComboBox<String> publico_alvo;

    @FXML
    private JFXComboBox<String> duracao;

    @FXML
    private JFXComboBox<String> tipo;

    public CardProcess card = null;
    private ActividadeService actividadeService=new ActividadeService();

    public  StackPane fundo;

    public  ImageView img;

    public  Label info;


    @FXML
    void Add(){
        ModalUtil.Show("modalActividade",this,content);
    }


    public void AddActividade(JFXButton actionButton,ActividadeDtoRegister act,VBox form){
        
        CompletableFuture.supplyAsync(() -> {
            if (UploadFiles.imgFile == null || UploadFiles.imgFile.getPath() == null) {
                ReacaoFormUtil.Reagir("error", "Erro! A imagem nao foi carregada", img, info);
                return null;
            }
            try {
                return actividadeService.postActividade(act);
            } catch (IOException | InterruptedException e) {
                return null;
            }catch(Exception e){
                System.out.println(e.getMessage());
                return null;
            }
        }, App.getExecutorService()).thenAccept(actividade -> {
            Platform.runLater(() -> {
                actionButton.setDisable(false);
                if (actividade == null) {
                    ReacaoFormUtil.Reagir("error","Erro! A actividade não foi adicionada a base de dados" , img, info);
                    return;
                }
                if(listActividade.getChildren().contains(card))
                    listActividade.getChildren().remove(card);
                listActividade.getChildren().add(0,new ActividadeModel(actividade,true));
                FormAnaliserUtil.CleanForm(form);
                img.setImage(new Image(App.class.getResourceAsStream("assets/audio.png")));
                ReacaoFormUtil.Reagir("corret","A Actividade foi adicionada com sucesso" , img, info);
            });
        });
    }
     

    @FXML
    void pesquisar(ActionEvent event) {
        String search = pesqBloco.getText().trim();
        if (search.isEmpty()) {
            ReacaoFormUtil.Reagir("error", "Erro! O campo de pesquisa está vazio", img, info);
            return;
        }
        List<ActividadeModel> filteredList = new ArrayList<>();
        for (ActividadeModel model : listActividade.getChildren().stream()
                .filter(node -> node instanceof ActividadeModel)
                .map(node -> (ActividadeModel) node)
                .toList()) {
            if (model.getTitulo().getText().toLowerCase().contains(search.toLowerCase())) {
                filteredList.add(model);
            }
        }
        listActividade.getChildren().setAll(filteredList);
        if (filteredList.isEmpty()) {
            ReacaoFormUtil.Reagir("error", "Nenhuma actividade encontrada com o termo: " + search, img, info);
        } else {
            ReacaoFormUtil.Reagir("corret", "Actividades encontradas: " + filteredList.size(), img, info);
        }
    }

    @FXML
    void SelectSeccao(ActionEvent event) {
        ToggleButton toggleGroup = (ToggleButton) event.getSource();
        String selectedValue = toggleGroup.getText();
        if (selectedValue.equals("Todos")) {
            listActividade.getChildren().clear();
            LoadActividades();
        } else {
           Platform.runLater(() -> {
                List<ActividadeModel> filteredList = listActividade.getChildren().stream()
                        .filter(node -> node instanceof ActividadeModel)
                        .map(node -> (ActividadeModel) node)
                        .filter(model -> model.getDuracao().name().equals(selectedValue))
                        .toList();
                listActividade.getChildren().setAll(filteredList);
                if (filteredList.isEmpty()) {
                    listActividade.getChildren().clear();
                    card.Vazio("Nenhuma actividade encontrada para o tipo: " + selectedValue, () -> SelectSeccao(event));
                    listActividade.getChildren().add(card);
                } else {
                    ReacaoFormUtil.Reagir("corret", "Actividades filtradas por tipo: " + selectedValue, img, info);
                }
            });
        }
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        LoadActividades();
         AddDetails();
    }

    @Override
      public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
        this.info=info;
        this.img=img;
      }
   

    void LoadActividades(){
         listActividade.getChildren().clear();
        card=new CardProcess("Buscando as Actividades");
        listActividade.getChildren().add(card);
        CompletableFuture.supplyAsync(() -> {
            try {
                return actividadeService.allActividades();    
            } catch (Exception e) {
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            Platform.runLater(() -> {
                if(App.teste)
                    AddTestActividade();
                if (t == null) {
                    card.Error("Erro ao buscar actividades",() -> LoadActividades());
                    return;
                }
                if (t.isEmpty()) {
                    card.Vazio("Sem Actividades",() -> LoadActividades());
                }else{
                    listActividade.getChildren().remove(card);
                    for (ActividadeDtoSimple actividadeDtoSimple : t) {
                        listActividade.getChildren().addAll(new ActividadeModel(actividadeDtoSimple, true));
                    }
                }
            });
        });
        
    }

    private void AddTestActividade(){
         listActividade.getChildren().clear();
        for (int i = 0; i < 5; i++) {
                listActividade.getChildren().add(new ActividadeModel(new ActividadeDtoSimple(
            i,
    "sdsd fsdf sdf sdf sdf",
    "sdfsdfsdf",
    "asdasdasdasd",
"sdfsd sdddf dfdf",
    ActividadeType.Acampamento,
    DuracaoActividade.Anual,
    PublicoAlvoType.Criancas,
    "sdfsdfds",
    LocalDateTime.now(),
    LocalDateTime.now(),
    "955383237",
   "file:///home/devpro/Imagens/asd.jpeg"
         ),true));
        }
    }

    private void AddDetails(){
        publico_alvo.getItems().addAll(PublicoAlvoType.Lista());
        duracao.getItems().addAll(DuracaoActividade.Lista());
        tipo.getItems().addAll(ActividadeType.Lista());
    }

    @Override
    public void Show() {
        if (listActividade.getChildren().isEmpty()) {
          LoadActividades();  
        }
    }
 
    
}
