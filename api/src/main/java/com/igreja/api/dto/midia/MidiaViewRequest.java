package com.igreja.api.dto.midia;

import jakarta.validation.constraints.Min;

public record MidiaViewRequest(@Min(0) Integer watchedSeconds) {
}
