package com.example.models.user;

public class UserMapper {

    public static UserDtoData toDto(UsuarioModel model) {
        return new UserDtoData(
            model.getId(),
            model.getNome(),
            model.getEmail(),
            model.getImg(),
            model.getRoles()
        );
    }

    public static UsuarioModel toEntity(UserDtoData dto) {
        UsuarioModel model = new UsuarioModel();
        model.setId(dto.id());
        model.setNome(dto.nome());
        model.setEmail(dto.email());
        model.setImg(dto.img());
        model.setRoles(dto.roles());
        return model;
    }
}
