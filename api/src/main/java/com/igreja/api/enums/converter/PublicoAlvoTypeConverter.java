package com.igreja.api.enums.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import com.igreja.api.enums.PublicoAlvoType;

@Converter(autoApply = true)
public class PublicoAlvoTypeConverter implements AttributeConverter<PublicoAlvoType, String> {

    @Override
    public String convertToDatabaseColumn(PublicoAlvoType attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public PublicoAlvoType convertToEntityAttribute(String dbData) {
        return PublicoAlvoType.fromValue(dbData);
    }
}
