module com.example {
    requires javafx.controls;
    requires javafx.fxml;
    requires lombok;
    requires java.desktop;
    requires com.jfoenix;
    requires de.jensd.fx.glyphs.fontawesome;
    requires javafx.media;
    requires javafx.web;
    requires java.net.http;
    requires com.google.gson;
    requires com.fasterxml.jackson.databind;


    opens com.example to javafx.fxml;
    opens com.example.controllers.modal to javafx.fxml;
    opens com.example.controllers.pages to javafx.fxml;
    exports com.example;
    exports com.example.controllers.modal;
    exports com.example.controllers.pages;
}
