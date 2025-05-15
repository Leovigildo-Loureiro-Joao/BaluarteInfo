package com.example.controllers;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import com.example.App;
import com.example.components.item_list.ItemDash;
import com.example.components.item_list.ItemNotif;
import com.example.configs.ApiCache;
import com.example.utils.DialogUtil;
import com.example.utils.ModalUtil;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.control.Dialog;
import javafx.scene.control.ListView;
import javafx.scene.control.ScrollPane;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.stage.Modality;
import javafx.stage.StageStyle;

public class MainController implements Initializable{

    @FXML
    private ScrollPane box;

    @FXML
    private ListView<ItemDash> lista;
    private Initializable controller;
    private final Dialog dialog=new Dialog();
    @FXML
    public StackPane conteinerModal;
    

     private void loadFXMLAsync(String fxmlFile) {
      
        ScheduledExecutorService sheduler = Executors.newSingleThreadScheduledExecutor();
        CompletableFuture.runAsync(() -> {
                AnchorPane loadedPane=null;
                if(!ApiCache.isTela(fxmlFile)){
                    FXMLLoader loader = new FXMLLoader(App.class.getResource("pages/sub-pages/" +fxmlFile + ".fxml"));
                    try {
                        loadedPane = loader.load();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    ApiCache.addTelaCache(fxmlFile,  loader.getController(), loadedPane);
                }else{
                    Object[] cached = ApiCache.getTelaCache(fxmlFile);
                    controller = (Initializable) cached[0];
                    loadedPane = (AnchorPane) cached[1];
                }
                AnchorPane finalPane= (AnchorPane)ApiCache.getTelaCache(fxmlFile)[1];
                Platform.runLater(() -> {
                    if (finalPane != null) {
                        controller= (Initializable)ApiCache.getTelaCache(fxmlFile)[0];
                        finalPane.setVisible(true);
                        box.setContent(finalPane);
                    }
                });
                
        },sheduler).whenComplete((t, u) -> sheduler.shutdown());     
    }

 
    @FXML
    public void Select(MouseEvent event) {
      for (int i = 0; i < lista.getItems().size(); i++) {
        lista.getItems().get(i).deselectNow();
      }
      loadFXMLAsync(lista.getSelectionModel().getSelectedItem().selectNow());
    }


     @Override
     public void initialize(URL arg0, ResourceBundle arg1) {
        lista.getItems().add(new ItemDash("Home",FontAwesomeIcon.HOME));
        lista.getItems().add(new ItemDash("Actividades",FontAwesomeIcon.GROUP));
        lista.getItems().add(new ItemDash("Artigos",FontAwesomeIcon.BOOK));
        lista.getItems().add(new ItemDash("Videos",FontAwesomeIcon.FILM));
        lista.getItems().add(new ItemDash("Audios",FontAwesomeIcon.MUSIC));
        lista.getItems().add(new ItemDash("Editar site",FontAwesomeIcon.EDIT));
        lista.getItems().add(new ItemDash("Configurações",FontAwesomeIcon.COGS));
        loadFXMLAsync("home");
     }
}
