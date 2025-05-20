package com.example.controllers.pages;

import java.net.URL;
import java.time.LocalDate;
import java.util.ResourceBundle;

import com.example.components.calendario.Calendario;
import com.example.components.item_list.ItemNotif;
import com.example.components.progress.Circle_progress;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class HomeController implements Initializable{

    @FXML
    private ListView<ItemNotif> notif;

    @FXML
    private AnchorPane container;

    @FXML
    private VBox blocoDia;

    @FXML
    private Label mes;
    
    @FXML
    private AnchorPane circlePro_Ins;

    @FXML
    private AnchorPane circlePro_act_com;

    @FXML
    private AnchorPane circlePro_act_ins;

    @FXML
    private AnchorPane circlePro_visit;
    

    public Calendario calendario;


    @Override
    public void initialize(URL arg0, ResourceBundle arg1) {
        notif.getItems().add(new ItemNotif("Mas de 5 pessoas enviaram se inscreveram para o projecto actulize a galeria", "Luanda aos 18,09 de 2024"));
        notif.getItems().add(new ItemNotif("Mas de 5 pessoas enviaram se inscreveram para o projecto actulize a galeria", "Luanda aos 18,09 de 2024"));
        notif.getItems().add(new ItemNotif("Mas de 5 pessoas enviaram se inscreveram para o projecto actulize a galeria", "Luanda aos 18,09 de 2024"));
        calendario=new Calendario(blocoDia,mes);
        calendario.GerarCalendario(LocalDate.now());
        circlePro_Ins.getChildren().add(new Circle_progress(30, 58,3.5,70));
        circlePro_act_com.getChildren().add(new Circle_progress(20, 39,2.8,40));
        circlePro_act_ins.getChildren().add(new Circle_progress(20, 39,2.8,20));
        circlePro_visit.getChildren().add(new Circle_progress(30, 58,3.5,45));
    }

    @FXML
    public void Back(MouseEvent event) {
      calendario.Voltar();
    }

    @FXML
    public void Go(MouseEvent event) {
      calendario.Ir();
    }

    @FXML
    public void Select(MouseEvent event) {
      for (int i = 0; i < notif.getItems().size(); i++) {
        notif.getItems().get(i).deselectNow();
      }
      notif.getSelectionModel().getSelectedItem().selectNow();
    }
    
}
