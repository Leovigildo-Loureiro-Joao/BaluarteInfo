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

import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.control.ListView;
import javafx.scene.control.ScrollPane;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;

public class MainController implements Initializable{

    @FXML
    private ScrollPane box;

    @FXML
    private ListView<ItemDash> lista;

 

    private Initializable lod;

     private void loadFXMLAsync(String fxmlFile) {
        ScheduledExecutorService sheduler = Executors.newSingleThreadScheduledExecutor();
        CompletableFuture.runAsync(() -> {
            Platform.runLater(() -> {
                AnchorPane loadedPane=null;
                if(!ApiCache.isTela(fxmlFile)){
                    FXMLLoader loader = new FXMLLoader(App.class.getResource("pages/components/" +fxmlFile + ".fxml"));
                    try {
                        loadedPane = loader.load();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    ApiCache.addTelaCache(fxmlFile,  loader.getController(), loadedPane);
                }else
                loadedPane= (AnchorPane)ApiCache.getTelaCache(fxmlFile)[1];
                if (loadedPane != null) {
                    lod= (Initializable)ApiCache.getTelaCache(fxmlFile)[0];
                    loadedPane.setVisible(true);
                     // Limpa o contentPane antes de adicionar novo conteúdo
                     box.setContent(loadedPane);

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
        
        lista.getItems().add(new ItemDash("Home","home"));
        lista.getItems().add(new ItemDash("Actividades","actividade"));
        lista.getItems().add(new ItemDash("Artigos","artigo"));
        lista.getItems().add(new ItemDash("Videos","video"));
        lista.getItems().add(new ItemDash("Audios","audio"));
        lista.getItems().add(new ItemDash("Editar site","edit"));
        lista.getItems().add(new ItemDash("Configurações","config"));
        loadFXMLAsync("home");
     }
}
