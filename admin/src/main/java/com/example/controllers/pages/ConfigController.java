package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.controllers.Controller;
import com.example.enums.ConfigType;
import com.example.models.config.ConfigDto;
import com.example.services.ConfigService;
import com.jfoenix.controls.JFXButton;
import com.jfoenix.controls.JFXCheckBox;
import com.jfoenix.controls.JFXToggleButton;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class ConfigController implements Controller{

     @FXML
    private JFXButton button;

    @FXML
    private JFXCheckBox limpar;

    @FXML
    private TextField totAdIns;

    @FXML
    private TextField totComent;

    @FXML
    private TextField totInsc;

    @FXML
    private TextField totMemb;

    @FXML
    private TextField totNewL;

    @FXML
    private TextField totVist;

    public  StackPane fundo;

    public  ImageView img;

    public  Label info;

    public List<ConfigDto> configs;

    @FXML
    private VBox pai;

    @FXML
    void Submit(ActionEvent event) {
      
      try {
        ConfigService.put(new ConfigDto(Double.parseDouble(totInsc.getText()), ConfigType.ActividadeLimite));
        ConfigService.put(new ConfigDto(Double.parseDouble(totComent.getText()), ConfigType.ComentarioLimiteActividade));
        ConfigService.put(new ConfigDto(Double.parseDouble(totAdIns.getText()), ConfigType.IncritosLimiteActividade));
        ConfigService.put(new ConfigDto(Double.parseDouble( totMemb.getText()), ConfigType.MembrosLimite));
        ConfigService.put(new ConfigDto(Double.parseDouble(totNewL.getText()), ConfigType.NewlesterLimite));
        ConfigService.put(new ConfigDto(Double.parseDouble(totVist.getText()), ConfigType.VisitasLimite));
      } catch (NumberFormatException | IOException | InterruptedException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
     
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
      
    }

    @Override
    public void Show() {
      CompletableFuture.runAsync(() -> {
        try {
          configs=ConfigService.get();
        } catch (IOException | InterruptedException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }
        Actualizar();
      });
    }
    public void Actualizar(){
        for (ConfigDto configDto : configs) {
          switch (configDto.type()) {
            case ActividadeLimite:
              totInsc.setText(configDto.value()+"");;
              break;
            case ComentarioLimiteActividade:
                totComent.setText(configDto.value()+"");;
                break;
            case IncritosLimiteActividade:
                totAdIns.setText(configDto.value()+"");;
                break;
            case VisitasLimite:
                totVist.setText(configDto.value()+"");;
                break;
            case MembrosLimite:
                totMemb.setText(configDto.value()+"");;
                break;
            case NewlesterLimite:
                totNewL.setText(configDto.value()+"");;
                break;
          }
        }
    }

    @Override
    public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
        this.info=info;
        this.img=img;
      }

    @FXML
    public void Alterar(ActionEvent event) {
      JFXToggleButton button=(JFXToggleButton)event.getTarget();
      limpar.setDisable(!button.isVisible());
      totAdIns.setDisable(!button.isSelected());
      totComent.setDisable(!button.isSelected());
      totInsc.setDisable(!button.isSelected());
      totVist.setDisable(!button.isSelected());
      totMemb.setDisable(!button.isSelected());
      totNewL.setDisable(!button.isSelected());
      this.button.setDisable(!button.isSelected());
    }

}
