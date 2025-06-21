package com.example.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class DataFormater {
    public static String[] MESES={"Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"};
    
    public static String Formater(LocalDateTime local){
        return Formater(local.toLocalDate())+" | "+Formater(local.toLocalTime());
    }

    public static String Formater(LocalDate local){
        String dias=local.getDayOfMonth()+"";
        String mes=MESES[local.getMonthValue()-1];
        String ano = local.getYear()+"";
        return dias+","+mes+" "+ano;
    }

    public static String Formater(LocalTime local){
        return local.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}
