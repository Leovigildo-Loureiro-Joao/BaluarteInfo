package com.example.utils;

import javafx.scene.Node;
import com.jfoenix.controls.*;

import javafx.scene.control.DatePicker;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import jfxtras.scene.control.LocalDateTimeTextField;

public class FormAnaliserUtil {
    

    public static void CleanForm(VBox form){
        for (Node node : form.getChildren()) {
            if (node.getClass().equals(TextField.class)) {
                TextField input=(TextField) node ;
                input.setText(null);
            }else if(node.getClass().equals(JFXComboBox.class)){
                JFXComboBox input=(JFXComboBox) node ;
                input.getSelectionModel().clearSelection();
            }else if(node.getClass().equals(LocalDateTimeTextField.class)){
                LocalDateTimeTextField input=(LocalDateTimeTextField) node ;
                input.setText(null);
            }else if(node.getClass().equals(TextArea.class)){
                TextArea input=(TextArea) node ;
                input.setText(null);
            }
        }
    }

    public static boolean isEmpty(VBox form){
        boolean hasError=false;
        for (Node node : form.getChildren()) {
            if (node.getClass().equals(TextField.class)) {
                TextField input=(TextField) node ;
                hasError=input.getText().trim().isEmpty();
                if (hasError) input.getStyleClass().add("error");
            }else if(node.getClass().equals(TextArea.class)){
                TextArea input=(TextArea) node ;
                hasError=input.getText().trim().isEmpty();
                if (hasError) input.getStyleClass().add("error");
            }else if(node.getClass().equals(DatePicker.class)){
                DatePicker input=(DatePicker) node ;
                hasError=input.getValue() == null;
                if (hasError) input.getStyleClass().add("error");
            }else if(node.getClass().equals(JFXComboBox.class)){
                JFXComboBox input=(JFXComboBox) node ;
                hasError=input.getSelectionModel().isEmpty();
                if (hasError) input.getStyleClass().add("error");
            }
            if (hasError) return hasError;
        }
        return hasError;
    }

}
