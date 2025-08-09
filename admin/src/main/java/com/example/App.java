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
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import com.example.configs.ApiCache;
import com.example.controllers.modal.ModalCorretErrorController;

/**
 * JavaFX App
 */
@Getter @Setter
public class App extends Application {

    public static Scene scene;
    private static Stage stage;
    public static boolean teste=false;
    @Override 
    public void start(Stage stage) throws IOException {
        App.stage= stage;
        App.stage.setTitle("BaluarteAdmin");
        App.stage.setMinWidth(1100);
        App.stage.setMinHeight(600);
        App.stage.getIcons().add(new Image(App.class.getResourceAsStream("assets/logoP.png")));
        stage.setMaximized(true);
        scene = new Scene(loadFXML("login"), 640, 480);
        stage.setScene(scene);
        stage.show();
    }

    public static void setRoot(String fxml) throws IOException {
        scene.setRoot(loadFXML(fxml));
    }

    private static Parent loadFXML(String fxml) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(App.class.getResource("pages/" +fxml + ".fxml"));
        Parent loadPane=fxmlLoader.load();
        ApiCache.addTelaCache(fxml,  fxmlLoader.getController(), loadPane);
        return loadPane;
    }

    public static  DialogPane loadFXMLDialog(String fxml) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(App.class.getResource("components/dialogs/" +fxml + ".fxml"));
        return fxmlLoader.load();
    }

    public static  Node loadFXMLModal(String fxml) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(App.class.getResource("modals/" +fxml + ".fxml"));
         Parent loadPane=fxmlLoader.load();
         ApiCache.addTelaCache(fxml,  fxmlLoader.getController(), loadPane);
        return loadPane;
    }

    public static  Node loadFXMLModalTempory(String fxml,String info,String info1) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(App.class.getResource("components/modals/" +fxml + ".fxml"));
        Parent loadPane=fxmlLoader.load();
        ModalCorretErrorController controller=((ModalCorretErrorController)fxmlLoader.getController());
        controller.getInfo().setText(info);
        controller.getInfo1().setText(info1);
        ApiCache.addTelaCache(fxml,  fxmlLoader.getController(), loadPane);
        return loadPane;
    }
    

    public static void main(String[] args) {
        launch();
    }

    public static Executor getExecutorService() {
       return Executors.newSingleThreadScheduledExecutor(
                runnable -> {
                    Thread thread = new Thread(runnable);
                    thread.setDaemon(true); // Set the thread as a daemon thread
                    return thread;
                }
        );
    }

}
