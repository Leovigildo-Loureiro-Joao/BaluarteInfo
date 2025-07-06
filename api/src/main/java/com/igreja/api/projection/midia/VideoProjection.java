package com.igreja.api.projection.midia;

import javax.validation.constraints.NotBlank;

public interface VideoProjection {
    Integer getId();
    String getDescricao();
    String getUrl();
}
