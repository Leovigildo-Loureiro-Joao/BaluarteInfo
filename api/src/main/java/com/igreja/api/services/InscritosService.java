package com.igreja.api.services;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.igreja.api.dto.inscrito.InscritosData;
import com.igreja.api.dto.inscrito.InscritosDto;
import com.igreja.api.dto.inscrito.InscritosPublicDto;
import com.igreja.api.dto.user.UserActividadeInscritaDto;
import com.igreja.api.enums.StatusIncritos;
import com.igreja.api.models.ActividadeModel;
import com.igreja.api.models.InscritosModel;
import com.igreja.api.models.ProgramacaoActividadeModel;
import com.igreja.api.models.UserModel;
import com.igreja.api.repositories.InscritosRepository;
import com.igreja.api.repositories.ProgramacaoActividadeRepository;
import com.igreja.api.utils.QRCodeGeneratorUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class InscritosService {
    private static final Logger log = LoggerFactory.getLogger(InscritosService.class);

    @Autowired
    private InscritosRepository inscritosRepository;

    @Autowired
    private ActividadeService actividadeService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProgramacaoActividadeRepository programacaoRepository;

    @Autowired
    private InscritosPdfService inscritosPdfService;

    @Autowired
    private InscricaoEmailService inscricaoEmailService;

    public  byte[] save(InscritosDto inscritos) throws Exception{
        ActividadeModel actividade=actividadeService.Select(inscritos.idActividade());
        UserModel user=userService.findById(inscritos.idUser());
        InscritosModel inscritosModel=new InscritosModel();
        inscritosModel.setUser(user);
        inscritosModel.setActividade(actividade);
        inscritosModel.setNome(user.getNome());
        inscritosModel.setEmail(user.getEmail());
        inscritosModel.setTelefone(user.getTelefone());
        if (actividade.getDataEvento().isAfter(LocalDateTime.now())) {
            inscritosModel=inscritosRepository.save(inscritosModel);
            ObjectMapper mapper= new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
             String jsonData =mapper.writeValueAsString(Map.of(
                "Id", inscritosModel.getId(),
                "userId", user.getId(),
                "eventoId", actividade.getId(),
                "dataEvento", actividade.getDataEvento()
            ));
            return QRCodeGeneratorUtils.generateQRCodeImage(jsonData, 300 , 300);
        }
        throw new DateTimeException("Lamentamos mas esta actividade ja passou");
    }

    public byte[] savePublic(int idActividade, InscritosPublicDto inscritos) throws Exception {
        return savePublicWithId(idActividade, inscritos).qrPng();
    }

    public InscricaoQrResult savePublicWithId(int idActividade, InscritosPublicDto inscritos) throws Exception {
        ActividadeModel actividade = actividadeService.Select(idActividade);
        InscritosModel inscritosModel = new InscritosModel();
        inscritosModel.setActividade(actividade);
        inscritosModel.setNome(inscritos.nome());
        inscritosModel.setEmail(inscritos.email());
        inscritosModel.setTelefone(inscritos.telefone());

        if (actividade.getDataEvento().isAfter(LocalDateTime.now())) {
            inscritosModel = inscritosRepository.save(inscritosModel);
            String jsonData = buildQrPayload(inscritosModel.getId(), actividade, null);
            byte[] qrPng = QRCodeGeneratorUtils.generateQRCodeImage(jsonData, 300, 300);

            try {
                List<ProgramacaoActividadeModel> programacao = programacaoRepository.findByActividadeOrder(actividade.getId());
                byte[] pdf = inscritosPdfService.buildFichaPdf(inscritosModel, actividade, programacao, qrPng);
                inscricaoEmailService.sendFichaInscricao(inscritosModel, actividade, programacao, qrPng, pdf);
            } catch (Exception e) {
                // Não falha a inscrição se o e-mail/PDF falhar.
                log.warn("Falha ao enviar ficha por email (inscricaoId={}, actividadeId={}): {}",
                        inscritosModel.getId(), actividade.getId(), e.toString());
            }

            return new InscricaoQrResult(inscritosModel.getId(), qrPng);
        }
        throw new DateTimeException("Lamentamos mas esta actividade ja passou");
    }


    public InscritosModel MarcarPresenca (JSONObject presenca){
        long id=presenca.getLong("Id");
        String dateRaw = presenca.has("dataEvento")
                ? presenca.optString("dataEvento")
                : presenca.optString("datEvento");
        LocalDateTime dateTime=LocalDateTime.parse(dateRaw);
        if (dateTime.isBefore(LocalDateTime.now())){
            throw new DateTimeException("Lamentamos mas esta actividade ja passou");
            
        }
        InscritosModel inscritosModel=Select(id);
        inscritosModel.setStatus(StatusIncritos.PRESENTE);
        inscritosModel.setDataCheckin(LocalDateTime.now());
        return inscritosRepository.save(inscritosModel);
    }

    public InscritosModel Select (long id){
        return inscritosRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Houve um erro inexperado"));
    }

    public void Delete (long id){
        InscritosModel inscritosModel=Select(id);
        if (inscritosModel.getStatus().equals(StatusIncritos.PRESENTE)){
            throw new DateTimeException("Lamentamos mas esta actividade ja passou");
        }
        inscritosRepository.delete(inscritosModel); 
    }

    public Page<InscritosData> list(Pageable pageable, int actividadeId) {
        Page<InscritosModel> page;
        if (actividadeId != 0) {
            ActividadeModel actividade = actividadeService.Select(actividadeId);
            page = inscritosRepository.findByActividade(actividade, pageable);
        } else {
            page = inscritosRepository.findAll(pageable);
        }
        return page.map(this::toData);
    }

    public Page<InscritosData> listByUser(String email, Pageable pageable) {
        UserModel user = userService.loadUserByEmail(email);
        return inscritosRepository.findByUser(user, pageable)
                .map(this::toData);
    }

    public Page<UserActividadeInscritaDto> listActivitiesByUser(String email, Pageable pageable) {
        UserModel user = userService.loadUserByEmail(email);
        return inscritosRepository.findByUser(user, pageable)
                .map(inscrito -> {
                    ActividadeModel actividade = inscrito.getActividade();
                    return new UserActividadeInscritaDto(
                            actividade.getId(),
                            actividade.getTitulo(),
                            actividade.getTema(),
                            actividade.getEndereco(),
                            actividade.getTipoEvento(),
                            actividade.getPublicoAlvo(),
                            actividade.getDuracao(),
                            actividade.getDataEvento(),
                            actividade.getImg(),
                            inscrito.getDataInscricao(),
                            inscrito.getStatus());
                });
    }

    private InscritosData toData(InscritosModel inscrito) {
        var actividade = inscrito.getActividade();
        UserModel user = inscrito.getUser();
        String nome = user != null ? user.getNome() : inscrito.getNome();
        String email = user != null ? user.getEmail() : inscrito.getEmail();
        String telefone = user != null ? user.getTelefone() : inscrito.getTelefone();

        return new InscritosData(
                inscrito.getId(),
                actividade.getId(),
                actividade.getTitulo(),
                actividade.getTema(),
                actividade.getDataEvento(),
                nome,
                email,
                telefone,
                inscrito.getDataInscricao(),
                inscrito.getDataCheckin(),
                inscrito.getStatus());
    }

    public byte[] fichaPdfPublic(long inscricaoId, String email) throws Exception {
        InscritosModel inscrito = Select(inscricaoId);
        String stored = Optional.ofNullable(inscrito.getEmail()).orElse("").trim();
        String provided = Optional.ofNullable(email).orElse("").trim();
        if (stored.isBlank() || provided.isBlank() || !stored.equalsIgnoreCase(provided)) {
            throw new IllegalArgumentException("Email não confere com esta inscrição.");
        }

        ActividadeModel actividade = inscrito.getActividade();
        if (actividade == null) {
            throw new NoSuchElementException("Actividade não encontrada para esta inscrição.");
        }
        List<ProgramacaoActividadeModel> programacao = programacaoRepository.findByActividadeOrder(actividade.getId());
        String jsonData = buildQrPayload(inscrito.getId(), actividade, null);
        byte[] qrPng = QRCodeGeneratorUtils.generateQRCodeImage(jsonData, 300, 300);
        return inscritosPdfService.buildFichaPdf(inscrito, actividade, programacao, qrPng);
    }

    private String buildQrPayload(long inscricaoId, ActividadeModel actividade, Integer userId) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        if (userId != null) {
            return mapper.writeValueAsString(Map.of(
                    "Id", inscricaoId,
                    "userId", userId,
                    "eventoId", actividade.getId(),
                    "dataEvento", actividade.getDataEvento()
            ));
        }
        return mapper.writeValueAsString(Map.of(
                "Id", inscricaoId,
                "eventoId", actividade.getId(),
                "dataEvento", actividade.getDataEvento()
        ));
    }

    public record InscricaoQrResult(long id, byte[] qrPng) {}
}
