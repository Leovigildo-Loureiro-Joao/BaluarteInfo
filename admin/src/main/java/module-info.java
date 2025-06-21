module com.example {
    requires javafx.controls;
    requires javafx.fxml;
    requires java.base;
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

    opens com.example.models to com.fasterxml.jackson.databind;
    opens com.example.models.user to com.fasterxml.jackson.databind; // ✅ ESSENCIAL
    opens com.example.models.config to com.fasterxml.jackson.databind; // ✅ ESSENCIAL
    opens com.example.models.notification to com.fasterxml.jackson.databind; // ✅ ESSENCIAL
    opens com.example.models.actividade to com.fasterxml.jackson.databind; // ✅ ESSENCIAL

    exports com.example.enums to com.google.gson;
    exports com.example.models to com.google.gson;
    exports com.example.models.config to com.google.gson;
    exports com.example.models.notification to com.google.gson;
    exports com.example.models.actividade to com.google.gson;

    exports com.example.components.notificacao to de.jensd.fx.glyphs.fontawesome;
    
    exports com.example;
    exports com.example.controllers.modal;
    exports com.example.controllers.pages;
}
