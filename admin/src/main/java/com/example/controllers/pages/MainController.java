package com.example.controllers.pages;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import com.example.App;
import com.example.components.item_list.ItemDash;
import com.example.configs.ApiCache;
import com.example.controllers.Controller;
import com.example.utils.ModalUtil;
import com.example.utils.TokenSeccao;

import de.jensd.fx.glyphs.fontawesome.FontAwesomeIcon;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.control.Dialog;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.PasswordField;
import javafx.scene.control.ScrollPane;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Circle;
import javafx.scene.text.Text;
import javafx.stage.Modality;
import javafx.stage.StageStyle;

public class MainController implements Initializable{

    @FXML
    private ScrollPane box;

    @FXML
    private ImageView img;

    @FXML
    private Label info;

    @FXML
    private ListView<ItemDash> lista;
    private Controller controller;
    private final Dialog dialog=new Dialog();
    @FXML
    public StackPane conteinerModal;

    @FXML
    private ImageView imagem;

    @FXML
    private Text nome;

    @FXML
    private Label role;
    

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
                    controller= (Controller)ApiCache.getTelaCache(fxmlFile)[0];
                    controller.Fundo(conteinerModal,info,img);
                }else{
                    Object[] cached = ApiCache.getTelaCache(fxmlFile);
                    controller = (Controller) cached[0];
                    loadedPane = (AnchorPane) cached[1];
                }
                AnchorPane finalPane= (AnchorPane)ApiCache.getTelaCache(fxmlFile)[1];
                Platform.runLater(() -> {
                    if (finalPane != null) {
                        finalPane.setVisible(true);
                        box.setContent(finalPane);
                        controller.Show();
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

    @FXML
    public void Sair(ActionEvent event) throws IOException {
        App.setRoot("login");
    }

    @FXML
    public void MudarSenha(ActionEvent event) {
        ModalUtil.Show("modalSenha");
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
        nome.setText(TokenSeccao.getUsuarioLogado().nome());
        role.setText(TokenSeccao.getUsuarioLogado().roles());
        if(!App.teste)imagem.setImage(new Image(TokenSeccao.getUsuarioLogado().img()));
        imagem.setClip(new Circle(imagem.getFitWidth()/2,imagem.getFitWidth()/2,imagem.getFitWidth()/2));
        loadFXMLAsync("home");
     }
}
