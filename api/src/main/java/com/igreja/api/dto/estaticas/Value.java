package com.igreja.api.dto.estaticas;

import com.igreja.api.enums.ConfigType;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public record Value(float value,float tot,@Enumerated(EnumType.STRING)ConfigType type) {
    
}
