package com.example.models.user;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.example.configs.ApiCache;
import com.example.controllers.pages.MainController;
import com.example.enums.UserDataType;
import com.example.utils.LoadImageUtil;
import com.example.utils.ModalUtil;

import javafx.application.Platform;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserModel extends HBox{

    private StackPane img=new StackPane();
    private Text name;
    private Label descricao;
    private VBox blocBox;
    private UserDataType userDataType;


    public UserModel(String src,String name,String descricao,UserDataType type,int id,int idC) {
        int tamanho=type==UserDataType.Comentarios?50:20;
        LoadImageUtil.preocessarBackground(this.img, src, tamanho, tamanho,true);
        SwType(type, name, descricao);
        this.setSpacing(10);
        userDataType=type;
        setOnMouseClicked(event -> {
             MainController controller=(MainController) ApiCache.getTelaCache("main")[0];
            if (userDataType.equals(UserDataType.Comentarios)) {
                ModalUtil.ShowComentario(controller.conteinerModal,idC, "modalUserComent",this,()->{ModalUtil.Show("modalActividadeDetalhes",(AnchorPane)controller.getBox().getContent(),id);});
            }
        });
    }

    public void SwType(UserDataType type,String name,String descricao){
        switch (type) {
            case Comentarios:
                this.name=new Text(name);
                this.descricao=new Label(descricao);
                blocBox=new VBox(this.name,this.descricao);
                this.getChildren().addAll(img,blocBox);
                this.getStyleClass().addAll("card","user-card");
                break;
        
            default:
                this.name=new Text(name);
                blocBox=new VBox(img,this.name);
                this.getStyleClass().addAll("card","user-card-min");
                this.getChildren().add(blocBox);
                break;
        }
    }

    

    
    
    




    
    
}