package com.igreja.api.enums.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import com.igreja.api.enums.ActividadeType;

@Converter(autoApply = true)
public class ActividadeTypeConverter implements AttributeConverter<ActividadeType, String> {

    @Override
    public String convertToDatabaseColumn(ActividadeType attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public ActividadeType convertToEntityAttribute(String dbData) {
        return ActividadeType.fromValue(dbData);
    }
}
