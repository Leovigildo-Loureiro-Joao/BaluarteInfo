package com.igreja.api.enums;

public enum VideoType {
    SERMON("Sermão"),
    DEVOTIONAL("Devocional"),
    TESTIMONY("Testemunho"),
    STUDY("Estudo"),
    DOCUMENTARY("Documentário"),
    EVENT("Evento"),
    INTERVIEW("Entrevista");

    public final String value;

    private VideoType(String descricao) {
        this.value = descricao;
    }
}
