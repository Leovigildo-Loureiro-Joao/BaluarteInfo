package com.igreja.api.enums.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import com.igreja.api.enums.DuracaoActividade;

@Converter(autoApply = true)
public class DuracaoActividadeConverter implements AttributeConverter<DuracaoActividade, String> {

    @Override
    public String convertToDatabaseColumn(DuracaoActividade attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public DuracaoActividade convertToEntityAttribute(String dbData) {
        return DuracaoActividade.fromValue(dbData);
    }
}
