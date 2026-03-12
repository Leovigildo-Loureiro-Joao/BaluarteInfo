package com.example.utils;

import javafx.scene.Node;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.jfoenix.controls.*;

import javafx.scene.control.DatePicker;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import jfxtras.scene.control.LocalDateTimeTextField;
import lombok.*;

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
        UploadFiles.artigoFile=null;
        UploadFiles.audioFile=null;
        UploadFiles.imgFile=null;
    }

    public static ResultAnalitic isEmpty(VBox form){
        boolean hasError=false;
        String error="";
        ResultAnalitic foo=new ResultAnalitic();
         DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy, HH:mm:ss");
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
                hasError=input.getValue() == null||input.getValue().getDayOfYear()>LocalDate.now().getDayOfYear();
                if (hasError) input.getStyleClass().add("error");
            }else if(node.getClass().equals(JFXComboBox.class)){
                JFXComboBox input=(JFXComboBox) node ;
                hasError=input.getSelectionModel().isEmpty();
                if (hasError) input.getStyleClass().add("error");
            }else if(node.getClass().equals(LocalDateTimeTextField.class)){
                LocalDateTimeTextField input=(LocalDateTimeTextField) node ;
                hasError=input.getText().isEmpty();
                if (hasError) input.getStyleClass().add("error");
                else {
                    LocalDateTime time=LocalDateTime.parse(input.getText(),formatter);
                    hasError=time.isBefore(LocalDateTime.now());
                    if (hasError){
                        input.getStyleClass().add("error");
                        error="O tempo de publicação não pode ser anterior ao tempo atual";
                    } 
                    

                }
            }
            foo = new ResultAnalitic(hasError,error);
            if (hasError) return foo;

        }
        return foo;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    public static class ResultAnalitic {
      
        private boolean hasError=false;
        private String error="";
        
    }

}
