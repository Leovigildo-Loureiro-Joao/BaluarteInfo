package com.example.utils;

import java.io.IOException;

import com.example.App;
import com.jfoenix.controls.JFXButton;

import javafx.application.Platform;
import javafx.scene.Node;
import javafx.scene.control.Dialog;
import javafx.scene.control.ScrollPane;
import javafx.stage.Modality;
import javafx.stage.StageStyle;
import javafx.stage.Window;

public class DialogUtil {

  public static void DialogShow (String name,Dialog dialog,Node parent) {
    try {
        dialog.setDialogPane(App.loadFXMLDialog(name));
        dialog.initModality(Modality.WINDOW_MODAL);
        JFXButton botao= (JFXButton) dialog.getDialogPane().lookup("#cancel");
        botao.setOnMouseClicked(event -> {
          Platform.runLater(() -> {
            dialog.hide();
          });
      });
        Platform.runLater(() -> {
            Window window = parent.getScene().getWindow();
            dialog.initOwner(window);
            dialog.show();
        });
    } catch (IOException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }


    
  }
}
