package com.igreja.api.enums;

import java.util.List;
import java.util.ArrayList;

public enum AudioType {
    SERMON("Sermão"),
    DEVOTIONAL("Devocional"),
    TESTIMONY("Testemunho"),
    MUSIC("Louvor"),
    PRAYER("Oração"),
    STUDY("Estudo"),
    PODCAST("Podcast"),
    ANNOUNCEMENT("Aviso");

    public final String value;

    private AudioType(String descricao) {
        this.value = descricao;
    }

}