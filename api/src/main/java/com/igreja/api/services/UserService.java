package com.igreja.api.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.igreja.api.dto.admin.AdminProfileDto;
import com.igreja.api.dto.user.UserAdminUpdateDto;
import com.igreja.api.dto.user.UserDtoData;
import com.igreja.api.dto.user.UserProfileDto;
import com.igreja.api.enums.UserStatus;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.UserRepository;
import com.igreja.api.utils.GravatarUtils;

@Service
public class UserService implements UserDetailsService{

    private static final String DEFAULT_ROLE = "USER";

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel user = loadUserByEmail(username);
        return buildUserDetails(user);
    }

    public UserModel loadUserByEmail(String username) {
        UserModel user=userRepository.findByEmail(username).orElseThrow(()->new UsernameNotFoundException("User not found"));
        return user;
    }

    public String[] Roles(UserModel user){
        String roles = normalizeRoles(user.getRoles());
        return roles.split(",");
    }

    public List<UserDtoData> findAll(){
        List<UserDtoData> userDtoDatas=new ArrayList<>();
        for (UserModel user : userRepository.findAll()) {
            userDtoDatas.add(toDto(user));
        }
        return userDtoDatas;
    }


    public UserModel findById(long id){
        return userRepository.findById(id).orElseThrow(()->new NoSuchElementException("It is user not exists"));
    }

       public UserDtoData findByIdData(long id){
        UserModel user=findById(id);
        return toDto(user);
    }


    public UserDtoData findByIdData(String username){
        UserModel user=loadUserByEmail(username);
        return toDto(user);
    }


    public boolean ExistsUser(UserModel user){
        return userRepository.findByEmail(user.getUsername()).isPresent();
    }

    public UserModel save(UserModel user){
        if (ExistsUser(user)) {
            throw new NoSuchElementException("Já existe um utilizador com este email.");
        }
        if (user.getStatus() == null) {
            user.setStatus(UserStatus.PENDENTE);
        }
        if (user.getDataCadastro() == null) {
            user.setDataCadastro(LocalDateTime.now());
        }
        user.setRoles(normalizeRoles(user.getRoles()));
        user.setImg( GravatarUtils.getGravatarUrl(user.getEmail()));
        return userRepository.save(user);
    }

    public UserDtoData updateProfile(String username, UserProfileDto profile) {
        UserModel user = loadUserByEmail(username);

        if (profile.nome() != null) {
            user.setNome(profile.nome());
        }

        if (profile.email() != null && !profile.email().isBlank()
                && !profile.email().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.findByEmail(profile.email()).isPresent()) {
                throw new NoSuchElementException("Já existe um utilizador com este email.");
            }
            user.setEmail(profile.email());
            user.setImg(GravatarUtils.getGravatarUrl(profile.email()));
        }

        if (profile.telefone() != null) {
            user.setTelefone(profile.telefone());
        }
        if (profile.dataNascimento() != null) {
            user.setDataNascimento(profile.dataNascimento());
        }
        if (profile.cidade() != null) {
            user.setCidade(profile.cidade());
        }
        if (profile.estado() != null) {
            user.setEstado(profile.estado());
        }
        if (profile.igreja() != null) {
            user.setIgreja(profile.igreja());
        }
        if (profile.dataBatismo() != null) {
            user.setDataBatismo(profile.dataBatismo());
        }
        if (profile.ministerio() != null) {
            user.setMinisterio(profile.ministerio());
        }
        if (profile.cargo() != null) {
            user.setCargo(profile.cargo());
        }
        if (profile.observacoes() != null) {
            user.setObservacoes(profile.observacoes());
        }

        return toDto(userRepository.save(user));
    }

    public AdminProfileDto adminProfile(String username) {
        UserModel user = loadUserByEmail(username);
        return toAdminProfile(user);
    }

    public AdminProfileDto updateAdminProfile(String username, UserProfileDto profile) {
        UserDtoData updated = updateProfile(username, profile);
        UserModel user = loadUserByEmail(updated.email());
        return toAdminProfile(user);
    }

    public UserDtoData updateAdmin(long id, UserAdminUpdateDto dto) {
        UserModel user = findById(id);

        if (dto.nome() != null) {
            user.setNome(dto.nome());
        }

        if (dto.email() != null && !dto.email().isBlank()
                && !dto.email().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.findByEmail(dto.email()).isPresent()) {
                throw new NoSuchElementException("Já existe um utilizador com este email.");
            }
            user.setEmail(dto.email());
            user.setImg(GravatarUtils.getGravatarUrl(dto.email()));
        }

        if (dto.telefone() != null) {
            user.setTelefone(dto.telefone());
        }
        if (dto.dataNascimento() != null) {
            user.setDataNascimento(dto.dataNascimento());
        }
        if (dto.cidade() != null) {
            user.setCidade(dto.cidade());
        }
        if (dto.estado() != null) {
            user.setEstado(dto.estado());
        }
        if (dto.igreja() != null) {
            user.setIgreja(dto.igreja());
        }
        if (dto.dataBatismo() != null) {
            user.setDataBatismo(dto.dataBatismo());
        }
        if (dto.ministerio() != null) {
            user.setMinisterio(dto.ministerio());
        }
        if (dto.cargo() != null) {
            user.setCargo(dto.cargo());
        }
        if (dto.observacoes() != null) {
            user.setObservacoes(dto.observacoes());
        }
        if (dto.roles() != null) {
            user.setRoles(normalizeRoles(dto.roles()));
        }
        if (dto.status() != null) {
            user.setStatus(dto.status());
            if (dto.status() != UserStatus.BLOQUEADO) {
                user.setMotivoBloqueio(null);
            }
            if (dto.status() == UserStatus.ATIVO && user.getDataAprovacao() == null) {
                user.setDataAprovacao(LocalDateTime.now());
            }
        }

        return toDto(userRepository.save(user));
    }

    public UserDtoData approveUser(long id, String aprovadoPor) {
        UserModel user = findById(id);
        user.setStatus(UserStatus.ATIVO);
        user.setDataAprovacao(LocalDateTime.now());
        user.setAprovadoPor(aprovadoPor);
        user.setMotivoBloqueio(null);
        return toDto(userRepository.save(user));
    }

    public UserDtoData blockUser(long id, String motivo) {
        UserModel user = findById(id);
        user.setStatus(UserStatus.BLOQUEADO);
        user.setMotivoBloqueio(motivo);
        return toDto(userRepository.save(user));
    }

    public UserDtoData reactivateUser(long id) {
        UserModel user = findById(id);
        user.setStatus(UserStatus.ATIVO);
        user.setMotivoBloqueio(null);
        if (user.getDataAprovacao() == null) {
            user.setDataAprovacao(LocalDateTime.now());
        }
        return toDto(userRepository.save(user));
    }

    public UserDtoData updateRoles(long id, String roles) {
        UserModel user = findById(id);
        user.setRoles(normalizeRoles(roles));
        return toDto(userRepository.save(user));
    }

    public void deleteUser(long id) {
        UserModel user = findById(id);
        userRepository.delete(user);
    }

    public UserDtoData markLogin(UserModel user) {
        user.setStatus(UserStatus.ATIVO);
        user.setUltimoAcesso(LocalDateTime.now());
        return toDto(userRepository.save(user));
    }

    public UserDtoData markLogout(String username) {
        UserModel user = loadUserByEmail(username);
        user.setStatus(UserStatus.INATIVO);
        user.setUltimoAcesso(LocalDateTime.now());
        return toDto(userRepository.save(user));
    }

    public boolean isActiveForAccess(UserModel user) {
        return user.getStatus() == UserStatus.ATIVO;
    }

    public UserDetails buildUserDetails(UserModel user) {
        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(Roles(user))
                .build();
    }

    private UserDtoData toDto(UserModel user) {
        return new UserDtoData(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getImg(),
                user.getRoles(),
                user.getStatus(),
                user.getTelefone(),
                user.getDataNascimento(),
                user.getCidade(),
                user.getEstado(),
                user.getIgreja(),
                user.getDataBatismo(),
                user.getMinisterio(),
                user.getCargo(),
                user.getDataCadastro(),
                user.getDataAprovacao(),
                user.getAprovadoPor(),
                user.getUltimoAcesso(),
                user.getObservacoes(),
                user.getMotivoBloqueio());
    }

    private String normalizeRoles(String roles) {
        if (roles == null || roles.isBlank()) {
            return DEFAULT_ROLE;
        }

        return java.util.Arrays.stream(roles.split(","))
                .map(String::trim)
                .filter(role -> !role.isBlank())
                .map(role -> role.startsWith("ROLE_") ? role.substring(5) : role)
                .map(String::toUpperCase)
                .distinct()
                .reduce((left, right) -> left + "," + right)
                .orElse(DEFAULT_ROLE);
    }

    private AdminProfileDto toAdminProfile(UserModel user) {
        String cargo;
        String roles = user.getRoles() == null ? "" : user.getRoles();
        if (roles.toUpperCase().contains("ADMIN")) {
            cargo = "Administrador";
        } else if (roles.toUpperCase().contains("PRESBITERO")) {
            cargo = "Presbítero";
        } else {
            cargo = "Secretário";
        }

        return new AdminProfileDto(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getTelefone(),
                cargo,
                user.getImg(),
                user.getDataCadastro(),
                user.getUltimoAcesso(),
                false,
                user.getCidade(),
                user.getEstado(),
                user.getDataNascimento(),
                user.getRoles());
    }
}
