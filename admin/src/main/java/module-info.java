module com.example {
    requires javafx.controls;
    requires javafx.fxml;
    requires lombok;
    requires java.desktop;
    requires com.jfoenix;
    requires de.jensd.fx.glyphs.fontawesome;
    requires javafx.media;
    requires javafx.web;


    opens com.example to javafx.fxml;
    opens com.example.controllers to javafx.fxml;
    exports com.example;
    exports com.example.controllers;
}
