package com.example.components.calendario;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

import com.example.services.ActividadeService;
import com.example.utils.DiaUtilAnimation;
import com.example.utils.ModalUtil;

import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Calendario {

    private ArrayList<Label> list=new ArrayList<>();
    private ArrayList<LocalDateTime> datas=new ArrayList<>();
    
    private VBox listTr;
    private Label mes;
 
 
    private LocalDate data=LocalDate.now();
    String[] meses={"Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"};
    public Calendario(VBox list,Label mes){
        data=LocalDate.now();
        listTr=list;
        this.mes=mes;
    }

    public void SelectActividade(Label dia,LocalDate date){
       for (LocalDateTime localDateTime : datas) {
            if (localDateTime.getDayOfMonth()==date.getDayOfMonth()) {
                dia.getStyleClass().add("event");
            }
       } 
    }

    public void AddDatas(LocalDate data){
        datas.clear();
        ActividadeService actividadeService=new ActividadeService();
        try {
            for (LocalDateTime t : actividadeService.DataActividade()) {
                 if (t.getMonth().equals(data.getMonth())) {
                    datas.add(t);
                }
            }
        } catch (IOException | InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void GerarCalendario(LocalDate dat){
        AddDatas(dat);
        for (var i = 0; i < listTr.getChildren().size(); i++) {
            for (var b = 0; b < ((HBox) listTr.getChildren().get(i)).getChildren().size(); b++) {
                ((HBox) listTr.getChildren().get(i)).getChildren().clear();
            }
        }

        var initMonth=dat.getMonthValue();
        var initYear=dat.getYear();
        
        var i=0;
        var terminou=true;
        for (var index = 1; terminou; index++) {
            for (var p = 1; p <= 7; p++) {
                var dia=LocalDate.of(initYear,initMonth,index);
                Label text=new Label(" ");
                text.getStyleClass().add("calerdarItem");
                if (dia.getDayOfWeek().getValue()==p) {
                    SelectActividade(text, dia);
                    text.getStyleClass().add("use");
                    ((HBox) listTr.getChildren().get(i)).getChildren().add(EstruturarDia(text, dia));
                    index++;
                    
                    if (dia.plusDays(1).getMonthValue()!=initMonth) {
                        terminou=false;
                        break;
                    }
                }else{
                    ((HBox) listTr.getChildren().get(i)).getChildren().add(text);
                }
            }
            index--;
            i++;
        }
        data=dat;
        mes.setText(meses[data.getMonthValue()-1]+"/"+data.getYear());
    }
    
    public void Voltar() {
        var newMonth=data.getMonthValue()-1;
        if (newMonth==0) {
            data=LocalDate.of(data.getYear()-1,12,1);
        }else{
            data=LocalDate.of(data.getYear(),newMonth,1); 
        }
        GerarCalendario(data);
    }
    
    public void Ir() {
        var newMonth=data.getMonthValue()+1;
        if (newMonth==12) {
            data=LocalDate.of(data.getYear()+1,1,1)   ; 
        }else{
            data=LocalDate.of(data.getYear(),newMonth,1)    ;
        }
        GerarCalendario(data);
    }
    

    public Label EstruturarDia(Label text,LocalDate dia){
        text.setText(dia.getDayOfMonth()+"");
        text.setOnMouseClicked(event -> {
            ModalUtil.Show("modalEventoActividade");
            if (!text.getStyleClass().contains("select")) {
                text.getStyleClass().add("select");
            }else text.getStyleClass().remove("select");
            
        });
        return text;
    }


    public void AddFuncion(Label text){
       
    }
   

    

}
