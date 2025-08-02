package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDate;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;

import com.example.components.calendario.Calendario;
import com.example.components.notificacao.ItemNotif;
import com.example.components.progress.Circle_progress;
import com.example.controllers.Controller;
import com.example.dto.Perct_Card;
import com.example.enums.ConfigType;

import com.example.services.HomeService;
import com.example.services.NotificacaoService;
import com.example.utils.FadeTrasitionUtil;
import com.google.gson.JsonSyntaxException;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

public class HomeController implements Controller{


    @FXML
    private HBox blocoBottom;

    @FXML
    private HBox blocoTop;
    @FXML
    private ListView<ItemNotif> notif;

    @FXML
    private Text activiCont;

    @FXML
    private VBox blocoDia;

    @FXML
    private AnchorPane circlePro_Ins;

    @FXML
    private AnchorPane circlePro_act_com;

    @FXML
    private AnchorPane circlePro_act_ins;

    @FXML
    private AnchorPane circlePro_visit;

    @FXML
    private AnchorPane container;

    @FXML
    private Text inscriCont;

    @FXML
    private Label mes;

    @FXML
    private Text userCont;

    @FXML
    private Text visitasCont;

    @FXML
    private AnchorPane circlePro_user;

    private HomeService homeService=new HomeService();

    public Calendario calendario;

    Circle_progress progressIns;
    Circle_progress progressUser;
    Circle_progress progressActCom;
    Circle_progress progressActIns;
    Circle_progress progressVisit;

    private StackPane fundo;


    @Override
    public void initialize(URL arg0, ResourceBundle arg1) {
        calendario=new Calendario(blocoDia,mes);
        StartProgress();
        AddNotificacao();
        calendario.GerarCalendario(LocalDate.now());
    }

    void AddNotificacao(){
      try {

        homeService.TodasNotificacoesLidas().forEach(t -> {
          notif.getItems().add(new ItemNotif(t));
        });;
      } catch (IOException | InterruptedException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
    }

    void StartProgress(){
      progressIns= new Circle_progress(30, 58,3.5,0);
      progressUser= new Circle_progress(30, 58,3.5,0);
      progressActCom= new Circle_progress(20, 39,2.8,0);
      progressActIns= new Circle_progress(20, 39,2.8,0);
      progressVisit= new Circle_progress(30, 58,3.5,0);
      circlePro_Ins.getChildren().add(progressIns);
      circlePro_user.getChildren().add(progressUser);
      circlePro_act_com.getChildren().add(progressActCom);
      circlePro_act_ins.getChildren().add(progressActIns);
      circlePro_visit.getChildren().add(progressVisit);
    }

    public void AnimationCards(){
     
        FadeTrasitionUtil.FadeTop( 1,blocoBottom,1,0);
        FadeTrasitionUtil.FadeTop( 1,blocoTop,1,0);
       
        CardsValues();
    }

    public void CardsValues(){
      CompletableFuture.runAsync(() -> {
        try {
          Perct_Card values=homeService.TotalValues();  
          progressIns.setValue(values.newlester());
          progressUser.setValue(values.membros());
          progressActCom.setValue(values.comentarios());
          progressActIns.setValue(values.actividades());
          progressVisit.setValue(values.visitas());
          /* Inserindo os values */
          activiCont.setText(homeService.getActividades().value()+"");
          visitasCont.setText(homeService.getVisitas().value()+"");
          inscriCont.setText(homeService.getNewlester().value()+"");
          userCont.setText(homeService.getMembros().value()+"");
        } catch (IOException e) {
          e.printStackTrace();
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
      });
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

    @Override
    public void Show() {
      AnimationCards();
    }

    @FXML
    public void cleanView(ActionEvent event) {
        notif.getItems().clear();
        AddNotificacao();
    }

    @FXML
    public void viewAll(ActionEvent event) {
      try {
        notif.getItems().clear();
        homeService.TodasNotificacoes().forEach(t -> {
          notif.getItems().add(new ItemNotif(t));
        });;
      } catch (IOException | InterruptedException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
    }
    
      @Override
      public void Fundo(StackPane fundo,Label info,ImageView img) {
        this.fundo=fundo;
      }
   
}
