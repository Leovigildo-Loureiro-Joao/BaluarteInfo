/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.igreja.api.dto.inscrito;


import java.time.LocalDateTime;

import com.igreja.api.enums.StatusIncritos;

public record InscritosData(
        long id,
        int actividadeId,
        String actividadeTitulo,
        String actividadeTema,
        LocalDateTime actividadeData,
        String usuarioNome,
        String usuarioEmail,
        String usuarioTelefone,
        LocalDateTime dataInscricao,
        LocalDateTime dataCheckin,
        StatusIncritos status) {
    
}
