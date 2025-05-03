package com.example;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
import lombok.Getter;
import lombok.Setter;

import java.io.IOException;

/**
 * JavaFX App
 */
@Getter @Setter
public class App extends Application {

    private static Scene scene;
    private Stage stage;
    @Override
    public void start(Stage stage) throws IOException {
        setStage(stage);
        this.stage.setTitle("BaluarteAdmin");
        this.stage.setMinWidth(1100);
        this.stage.setMinHeight(600);
        System.out.println(App.class.getResourceAsStream("assets/logoP.png"));
        this.stage.getIcons().add(new Image(App.class.getResourceAsStream("assets/logoP.png")));
        scene = new Scene(loadFXML("main"), 640, 480);
        stage.setScene(scene);
        stage.show();
    }

    public static void setRoot(String fxml) throws IOException {
        scene.setRoot(loadFXML(fxml));
    }

    private static  BorderPane loadFXML(String fxml) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(App.class.getResource("pages/" +fxml + ".fxml"));
        return fxmlLoader.load();
    }


    

    public static void main(String[] args) {
        launch();
    }

}