package com.example.models.config;


public class Statics_Mapper {
      public static Statics_dto toDto(Statics_value model) {
        return new Statics_dto(
            model.getValue(),
            model.getTot()
        );
    }

    public static Statics_value toEntity(Statics_dto dto) {
        Statics_value model = new Statics_value();
        model.setTot(dto.tot());
        model.setValue(dto.value());
        return model;
    }
}
