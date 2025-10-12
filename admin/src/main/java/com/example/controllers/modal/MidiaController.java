
package com.example.controllers.modal;

import com.example.enums.FileType;
import com.example.utils.UploadFiles;
import com.jfoenix.controls.JFXButton;
import java.net.URL;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextField;
import javafx.scene.image.ImageView;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.AnchorPane;

/**
 * FXML Controller class
 *
 * @author devpro
 */
public class MidiaController implements Initializable {

    @FXML
    private JFXButton back;
    @FXML
    private JFXButton cancel;
    @FXML
    private TextField titulo;
    @FXML
    private ImageView imgSrc;
    @FXML
    private TextField url_youtube;
    private int id;
    public AnchorPane content;

    /**
     * Initializes the controller class.
     */
    @Override
    public void initialize(URL url, ResourceBundle rb) {
       
    }    

    @FXML
    private void AddTrailler(ActionEvent event) {
        
    }    

    @FXML
    private void Back(ActionEvent event) {
    }

    @FXML
    private void UploadImg(MouseEvent event) {
         UploadFiles.Uplaod(FileType.Image, imgSrc,  content); 
    }

    @FXML
    private void AddImagem(ActionEvent event) {
        
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    

    
}
