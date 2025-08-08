package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

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
import javafx.scene.Node;
import javafx.scene.control.ComboBox;
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
    public AnchorPane content;

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

    public  StackPane fundo;

    public  ImageView img;

    public  Label info;

    private List<ActividadeDtoSimple> actividades;


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
                return ActividadeService.postActividade(act);
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
                listActividade.getChildren().add(0,new ActividadeModel(actividade,this));
                FormAnaliserUtil.CleanForm(form);
                img.setImage(new Image(App.class.getResourceAsStream("assets/audio.png")));
                ReacaoFormUtil.Reagir("corret","A Actividade foi adicionada com sucesso" , img, info);
            });
        });
    }

    public void EditActividade(JFXButton actionButton,ActividadeDtoRegister act,int id,VBox form){
        
        CompletableFuture.supplyAsync(() -> {
            if (UploadFiles.imgFile == null || UploadFiles.imgFile.getPath() == null) {
                ReacaoFormUtil.Reagir("error", "Erro! A imagem nao foi carregada", img, info);
                return null;
            }
            try {
                return ActividadeService.putActividade(act,id);
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
                    ReacaoFormUtil.Reagir("error","Erro! A actividade não foi editada na base de dados" , img, info);
                    return;
                }
                if(listActividade.getChildren().contains(card))
                    listActividade.getChildren().remove(card);
                List<Node> filteredList = listActividade.getChildren().stream()
                    .filter(node -> node instanceof ActividadeModel)
                    .map(node -> (ActividadeModel) node)
                    .filter(model -> model.getDados().id() == id)
                    .collect(Collectors.toList());
                if (!filteredList.isEmpty()) {
                    listActividade.getChildren().removeAll(filteredList);
                }                    
                listActividade.getChildren().add(0,new ActividadeModel(actividade,this));
                FormAnaliserUtil.CleanForm(form);
                img.setImage(new Image(App.class.getResourceAsStream("assets/audio.png")));
                ReacaoFormUtil.Reagir("corret","A Actividade foi editada com sucesso" , img, info);
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
            if (model.getDados().titulo().toLowerCase().contains(search.toLowerCase())) {
                filteredList.add(model);
            }else if (model.getDados().descricao().toLowerCase().contains(search.toLowerCase())) {
                filteredList.add(model);
            } else if (model.getDados().tema().toLowerCase().contains(search.toLowerCase())) {
                filteredList.add(model);
            } else if (model.getDados().endereco().toLowerCase().contains(search.toLowerCase())) {
                filteredList.add(model);
            } else if (model.getDados().organizador().toLowerCase().contains(search.toLowerCase())) {
                filteredList.add(model);
            }
        }
        listActividade.getChildren().setAll(filteredList);
        if (filteredList.isEmpty()) {
           listActividade.getChildren().clear();
            card.Vazio("Nenhuma actividade encontrada", () -> SelecionarSeccao(event));
            listActividade.getChildren().add(card);
        } else {
            listActividade.getChildren().setAll(filteredList);
        }
    }


    @FXML
    void SelecionarSeccao(ActionEvent event) {
    Platform.runLater(() -> {
          listActividade.getChildren().clear();
        for (ActividadeDtoSimple actividadeDtoSimple : actividades) {
            listActividade.getChildren().addAll(new ActividadeModel(actividadeDtoSimple, this));
        }
        String duracaoValue = Optional.ofNullable(duracao.getSelectionModel().getSelectedItem()).orElse("Todos");
        String tipoValue = Optional.ofNullable(tipo.getSelectionModel().getSelectedItem()).orElse("Todos");
        String publicoAlvoValue = Optional.ofNullable(publico_alvo.getSelectionModel().getSelectedItem()).orElse("Todos");

        List<Node> filteredList = listActividade.getChildren().stream()
                .filter(node -> node instanceof ActividadeModel)
                .map(node -> (ActividadeModel) node)
                .filter(model -> correspondeAFiltros(model, duracaoValue, tipoValue, publicoAlvoValue))
                .collect(Collectors.toList());

        if (filteredList.isEmpty()) {
            listActividade.getChildren().clear();
            card.Vazio("Nenhuma actividade encontrada", () -> SelecionarSeccao(event));
            listActividade.getChildren().add(card);
        } else {
            listActividade.getChildren().setAll(filteredList);
        }
    });
}

private boolean correspondeAFiltros(ActividadeModel model, String duracaoValue, String tipoValue, String publicoAlvoValue) {
    return (duracaoValue.equals("Todos") || model.getDados().duracao().name().equals(duracaoValue)) &&
           (tipoValue.equals("Todos") || model.getDados().tipoEvento().name().equals(tipoValue)) &&
           (publicoAlvoValue.equals("Todos") || model.getDados().publicoAlvo().name().equals(publicoAlvoValue));
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
                return ActividadeService.allActividades();    
            } catch (Exception e) {
                return null;
            }
        },App.getExecutorService()).thenAccept(t -> {
            actividades=t;
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
                        listActividade.getChildren().addAll(new ActividadeModel(actividadeDtoSimple, this));
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
         ),this));
        }
    }

    private void AddDetails(){
        publico_alvo.getItems().add(0,"Todos");
        tipo.getItems().add(0,"Todos");
        duracao.getItems().add(0,"Todos");
        publico_alvo.getItems().addAll(PublicoAlvoType.Lista());
        duracao.getItems().addAll(DuracaoActividade.Lista());
        tipo.getItems().addAll(ActividadeType.Lista());

        publico_alvo.getSelectionModel().select("Todos");
        tipo.getSelectionModel().select("Todos");
        duracao.getSelectionModel().select("Todos");

    }

    @Override
    public void Show() {
        if (listActividade.getChildren().isEmpty()) {
          LoadActividades();  
        }
    }
 
    
}
