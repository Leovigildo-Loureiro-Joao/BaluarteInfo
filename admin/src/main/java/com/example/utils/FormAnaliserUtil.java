package com.example.utils;

import javafx.scene.Node;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;

public class FormAnaliserUtil {
    

    public static void CleanForm(VBox form){
        for (Node node : form.getChildren()) {
            if (node.getClass().equals(TextField.class)) {
                TextField input=(TextField) node ;
                input.setText(null);
            }else{
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
            }else{
                TextArea input=(TextArea) node ;
                hasError=input.getText().trim().isEmpty();
                if (hasError) input.getStyleClass().add("error");
            }
            if (hasError) return hasError;
        }
        return hasError;
    }

}
