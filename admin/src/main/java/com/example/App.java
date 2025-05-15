package com.example;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.DialogPane;
import javafx.scene.image.Image;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import lombok.Getter;
import lombok.Setter;

import java.io.IOException;

import com.example.configs.ApiCache;

/**
 * JavaFX App
 */
@Getter @Setter
public class App extends Application {

    public static Scene scene;
    private static Stage stage;
    @Override
    public void start(Stage stage) throws IOException {
        App.stage= stage;
        App.stage.setTitle("BaluarteAdmin");
        App.stage.setMinWidth(1100);
        App.stage.setMinHeight(600);
        App.stage.getIcons().add(new Image(App.class.getResourceAsStream("assets/logoP.png")));
        stage.setMaximized(true);
      
        scene = new Scene(loadFXML("main"), 640, 480);
        stage.setScene(scene);
        stage.show();
    }

    public static void setRoot(String fxml) throws IOException {
        scene.setRoot(loadFXML(fxml));
    }

    private static  AnchorPane loadFXML(String fxml) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(App.class.getResource("pages/" +fxml + ".fxml"));
        AnchorPane loadPane=fxmlLoader.load();
        ApiCache.addTelaCache(fxml,  fxmlLoader.getController(), loadPane);
        return loadPane;
    }

    public static  DialogPane loadFXMLDialog(String fxml) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(App.class.getResource("components/dialogs/" +fxml + ".fxml"));
        return fxmlLoader.load();
    }

    public static  Node loadFXMLModal(String fxml) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(App.class.getResource("components/modals/" +fxml + ".fxml"));
        return fxmlLoader.load();
    }


    

    public static void main(String[] args) {
        launch();
    }

}