package com.igreja.api.controllers;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;

import com.igreja.api.components.JwUtil;
import com.igreja.api.dto.user.GoogleAuthDto;
import com.igreja.api.dto.user.UserDto;
import com.igreja.api.dto.user.UserAdminUpdateDto;
import com.igreja.api.dto.user.UserProfileDto;
import com.igreja.api.dto.user.UserBlockDto;
import com.igreja.api.dto.user.UserRoleDto;
import com.igreja.api.enums.UserStatus;
import com.igreja.api.dto.user.UserDtoData;
import com.igreja.api.dto.user.UserLoginDto;
import com.igreja.api.dto.mensage.MensagemUserDto;
import com.igreja.api.dto.user.UserComentarioData;
import com.igreja.api.dto.user.UserActividadeInscritaDto;
import com.igreja.api.dto.user.UserDownloadDto;
import com.igreja.api.dto.PageResponse;
import com.igreja.api.enums.MensagemType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.models.UserModel;
import com.igreja.api.services.UserService;
import com.igreja.api.services.AdminAuditLogService;
import com.igreja.api.enums.AdminAuditType;
import com.igreja.api.services.GoogleOAuthService;
import com.igreja.api.services.MensagemService;
import com.igreja.api.services.ComentarioService;
import com.igreja.api.services.InscritosService;
import com.igreja.api.services.UserDownloadService;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.time.LocalDateTime;
import java.util.UUID;

import io.jsonwebtoken.Claims;

import javax.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpServletRequest;


@RestController
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AdminAuditLogService adminAuditLogService;
    private final MensagemService mensagemService;
    private final ComentarioService comentarioService;
    private final InscritosService inscritosService;
    private final UserDownloadService userDownloadService;
    private final GoogleOAuthService googleOAuthService;

    @Value("${jwt.refresh-max-age-ms:604800000}")
    private long refreshMaxAgeMs;

    public UserController(
            UserService userService,
            AuthenticationManager authenticationManager,
            JwUtil jwtUtil,
            PasswordEncoder passwordEncoder,
            AdminAuditLogService adminAuditLogService,
            MensagemService mensagemService,
            ComentarioService comentarioService,
            InscritosService inscritosService,
            UserDownloadService userDownloadService,
            GoogleOAuthService googleOAuthService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.adminAuditLogService = adminAuditLogService;
        this.mensagemService = mensagemService;
        this.comentarioService = comentarioService;
        this.inscritosService = inscritosService;
        this.userDownloadService = userDownloadService;
        this.googleOAuthService = googleOAuthService;
    }
  

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginDto userDto, HttpServletRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.email(), userDto.password()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        UserModel user = userService.loadUserByEmail(userDto.email());
        if (user.getStatus() == UserStatus.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Conta pendente de aprovação do administrador.");
        }
        if (user.getStatus() == UserStatus.BLOQUEADO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Conta bloqueada pelo administrador.");
        }
        String token = jwtUtil.generateToken(userDetails);
        UserDtoData userData = userService.markLogin(user);
        if (user.getRoles() != null && user.getRoles().toUpperCase().contains("ADMIN")) {
            adminAuditLogService.log(user.getEmail(), "Login realizado",
                    "Acesso ao painel administrativo", resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(Map.of("token", token, "user", userData)); 
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refreshToken(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token ausente.");
        }

        String rawToken = authorization.substring("Bearer ".length()).trim();
        Claims claims = jwtUtil.parseClaimsAllowExpired(rawToken);
        if (claims == null || claims.getSubject() == null || claims.getSubject().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido.");
        }

        if (claims.getIssuedAt() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido.");
        }

        long now = System.currentTimeMillis();
        long issuedAt = claims.getIssuedAt().getTime();
        if (now - issuedAt > refreshMaxAgeMs) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão expirada. Faça login novamente.");
        }

        UserModel user = userService.loadUserByEmail(claims.getSubject());
        if (user.getStatus() == UserStatus.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Conta pendente de aprovação do administrador.");
        }
        if (user.getStatus() == UserStatus.BLOQUEADO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Conta bloqueada pelo administrador.");
        }

        String token = jwtUtil.generateToken(userService.buildUserDetails(user));
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/auth/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody @Valid GoogleAuthDto authDto, HttpServletRequest request) {
        var tokenInfo = googleOAuthService.verify(authDto.credential());
        UserModel user;

        try {
            user = userService.loadUserByEmail(tokenInfo.email());
        } catch (UsernameNotFoundException ex) {
            UserModel novoUser = new UserModel();
            novoUser.setNome(tokenInfo.nome());
            novoUser.setEmail(tokenInfo.email());
            novoUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            novoUser.setRoles("USER");
            novoUser.setStatus(UserStatus.PENDENTE);
            novoUser.setDataCadastro(LocalDateTime.now());
            if (tokenInfo.foto() != null && !tokenInfo.foto().isBlank()) {
                novoUser.setImg(tokenInfo.foto());
            }
            userService.save(novoUser);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Conta criada. Aguarde aprovação do administrador.");
        }

        userService.maybeUpdateAvatarFromGoogle(user.getEmail(), tokenInfo.foto());

        if (user.getStatus() == UserStatus.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Conta pendente de aprovação do administrador.");
        }
        if (user.getStatus() == UserStatus.BLOQUEADO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Conta bloqueada pelo administrador.");
        }

        String token = jwtUtil.generateToken(userService.buildUserDetails(user));
        UserDtoData userData = userService.markLogin(user);
        if (user.getRoles() != null && user.getRoles().toUpperCase().contains("ADMIN")) {
            adminAuditLogService.log(user.getEmail(), "Login Google realizado",
                    "Acesso ao painel administrativo", resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(Map.of("token", token, "user", userData));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto) {
        UserModel user = new UserModel();
        BeanUtils.copyProperties(userDto, user);
        user.setRoles("USER");
        user.setStatus(UserStatus.PENDENTE);
        user.setDataCadastro(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(userDto.password()));
        UserModel saved = userService.save(user);
        return ResponseEntity.ok(userService.findByIdData(saved.getId()));
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.markLogout(userDetails.getUsername()));
    }


    @GetMapping("/user/me")
    public ResponseEntity<?> currentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.findByIdData(userDetails.getUsername()));
    }

    @PutMapping("/user/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid UserProfileDto profileDto) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), profileDto));
    }

    @PutMapping(value = "/user/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("img") MultipartFile img) throws Exception {
        return ResponseEntity.ok(userService.updateAvatar(userDetails.getUsername(), img));
    }

     @GetMapping("/admin/user")
    public ResponseEntity<?> AllUser() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/admin/user/{id}")
    public ResponseEntity<?> findUserById(@PathVariable("id") long user) {
        return ResponseEntity.ok(userService.findByIdData(user));
    }

    @PutMapping("/admin/user/{id}/aprovar")
    public ResponseEntity<?> approveUser(
            @PathVariable("id") long userId,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = userService.approveUser(userId, adminDetails.getUsername());
        adminAuditLogService.log(adminDetails.getUsername(), "Usuário aprovado",
                "Usuário ID " + userId + " aprovado", resolveIp(request), AdminAuditType.SUCESSO);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/admin/user/{id}/bloquear")
    public ResponseEntity<?> blockUser(
            @PathVariable("id") long userId,
            @RequestBody UserBlockDto blockDto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        String motivo = blockDto == null ? null : blockDto.motivo();
        var result = userService.blockUser(userId, motivo);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Usuário bloqueado",
                    "Usuário ID " + userId + " bloqueado", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/admin/user/{id}")
    public ResponseEntity<?> updateAdmin(
            @PathVariable("id") long userId,
            @RequestBody UserAdminUpdateDto dto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = userService.updateAdmin(userId, dto);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Usuário atualizado",
                    "Usuário ID " + userId + " atualizado", resolveIp(request), AdminAuditType.INFO);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/admin/user/{id}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable("id") long userId,
            @RequestBody @Valid UserRoleDto dto,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = userService.updateRoles(userId, dto.roles());
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Role atualizado",
                    "Usuário ID " + userId + " roles: " + dto.roles(), resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/admin/user/{id}/reativar")
    public ResponseEntity<?> reactivate(
            @PathVariable("id") long userId,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = userService.reactivateUser(userId);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Usuário reativado",
                    "Usuário ID " + userId + " reativado", resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/admin/user/{id}/desbloquear")
    public ResponseEntity<?> unblock(
            @PathVariable("id") long userId,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        var result = userService.reactivateUser(userId);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Usuário desbloqueado",
                    "Usuário ID " + userId + " desbloqueado", resolveIp(request), AdminAuditType.SUCESSO);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/admin/user/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable("id") long userId,
            @AuthenticationPrincipal UserDetails adminDetails,
            HttpServletRequest request) {
        userService.deleteUser(userId);
        if (adminDetails != null) {
            adminAuditLogService.log(adminDetails.getUsername(), "Usuário removido",
                    "Usuário ID " + userId + " removido", resolveIp(request), AdminAuditType.ALERTA);
        }
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    @GetMapping("/admin/profile")
    public ResponseEntity<?> adminProfile(@AuthenticationPrincipal UserDetails adminDetails) {
        return ResponseEntity.ok(userService.adminProfile(adminDetails.getUsername()));
    }

    @PutMapping("/admin/profile")
    public ResponseEntity<?> updateAdminProfile(
            @AuthenticationPrincipal UserDetails adminDetails,
            @RequestBody @Valid UserProfileDto profileDto,
            HttpServletRequest request) {
        var result = userService.updateAdminProfile(adminDetails.getUsername(), profileDto);
        adminAuditLogService.log(adminDetails.getUsername(), "Perfil atualizado",
                "Informações pessoais atualizadas", resolveIp(request), AdminAuditType.INFO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/admin/profile/audit")
    public ResponseEntity<?> auditLogs(
            @AuthenticationPrincipal UserDetails adminDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) AdminAuditType tipo) {
        var result = adminAuditLogService.pageForUser(adminDetails.getUsername(), page, size, tipo);
        return ResponseEntity.ok(
                new com.igreja.api.dto.PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                        result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping("/user/me/mensagens")
    public ResponseEntity<?> myMessages(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) MensagemType tipo,
            @RequestParam(required = false) Boolean lido) {
        var pageable = org.springframework.data.domain.PageRequest.of(page, size);
        var result = mensagemService.pageForUser(userDetails.getUsername(), tipo, lido, pageable)
                .map(msg -> new MensagemUserDto(
                        msg.getId(),
                        msg.getDescricao(),
                        msg.getAssunto(),
                        msg.getEmail(),
                        msg.getDestino(),
                        msg.isLido(),
                        msg.getTipo(),
                        msg.getStatus(),
                        msg.getDataPublicacao()));
        return ResponseEntity.ok(new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping("/user/me/inscricoes")
    public ResponseEntity<?> myInscricoes(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(page, size);
        var result = inscritosService.listByUser(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(new PageResponse<>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping("/user/me/actividades")
    public ResponseEntity<?> myActividades(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(page, size);
        var result = inscritosService.listActivitiesByUser(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(new PageResponse<UserActividadeInscritaDto>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping("/user/me/comentarios")
    public ResponseEntity<?> myComentarios(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var result = comentarioService.pageForUser(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(new PageResponse<UserComentarioData>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @PostMapping("/user/me/download/artigo/{id}")
    public ResponseEntity<?> downloadArtigo(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") int artigoId) {
        if (userDetails == null) {
            return ResponseEntity.ok(Map.of("registered", false));
        }
        return ResponseEntity.ok(userDownloadService.registerArtigoDownload(userDetails.getUsername(), artigoId));
    }

    @PostMapping("/user/me/download/midia/{id}")
    public ResponseEntity<?> downloadMidia(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") int midiaId) {
        if (userDetails == null) {
            return ResponseEntity.ok(Map.of("registered", false));
        }
        return ResponseEntity.ok(userDownloadService.registerMidiaDownload(userDetails.getUsername(), midiaId));
    }

    @GetMapping("/user/me/downloads/artigos")
    public ResponseEntity<?> myDownloadsArtigos(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var result = userDownloadService.listArtigoDownloads(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(new PageResponse<UserDownloadDto>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    @GetMapping("/user/me/downloads/midias")
    public ResponseEntity<?> myDownloadsMidias(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) MidiaType midiaType) {
        var result = userDownloadService.listMidiaDownloads(userDetails.getUsername(), page, size, midiaType);
        return ResponseEntity.ok(new PageResponse<UserDownloadDto>(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()));
    }

    private String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp;
        }
        return request.getRemoteAddr();
    }
    
    
}
