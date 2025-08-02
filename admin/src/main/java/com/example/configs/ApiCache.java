/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.configs;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import com.example.App;

import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.image.Image;
import javafx.scene.layout.AnchorPane;

public class ApiCache {
    private static Map<String, Object> cache = new HashMap<>();
    private static final Map<String, Image> cachei = new HashMap<>();
    private static final Map<String, Object[]> Telas = new HashMap<>();
   

    public static Image getImage(Object url) {
        if (cachei.containsKey(url)) 
            return cachei.get(url);
        if (addImage(url)) 
            return  cachei.get(url);
        return  new Image(App.class.getResourceAsStream(url.toString()));
    }


    public static boolean addImage(Object url) {
        ScheduledExecutorService sheduler=Executors.newSingleThreadScheduledExecutor();
       return CompletableFuture.supplyAsync(() -> {
            if (!cachei.containsKey(url)) {
                try {
                    if (url instanceof byte[]) {
                       cachei.put(url.toString(), new Image(new File(url.toString()).getPath()));
                    }else{
                       cachei.put(url.toString(), new Image(url.toString()));
                    }
                    return true;
                } catch (Exception e) {
                    CompletableFuture.runAsync(() -> {
                         cachei.put(url.toString(), new Image(App.class.getResourceAsStream(url.toString())));
                         sheduler.shutdown();
                    },sheduler);
                }
            }
            return false;
        },sheduler).whenComplete((t, u) -> sheduler.shutdown()).join();
      
    }

    public static void clearCache() {
        cache.clear();
    }

    public static Object getFromCache(String key) {
        return cache.get(key);
    }
    
    public static boolean isCache(Object data) {
        return cache.containsValue(data);
    }

    public static boolean isCacheKey(String key) {
        return cache.containsKey(key);
    }

    public static void addToCache(String key, Object data) {
        cache.put(key, data);
    }
    
    public static void removeToCache(String key) {
        cache.remove(key);
    } 
    

    public static void addTelaCache(String key, Initializable control,Parent tela) {
        Object []ob={control,tela}; 
        Telas.put(key, ob);
    }

    public static Object [] getTelaCache(String key) {
       return Telas.get(key);
    }

    public static boolean isTela(String key) {
        return Telas.containsKey(key);
     }
}