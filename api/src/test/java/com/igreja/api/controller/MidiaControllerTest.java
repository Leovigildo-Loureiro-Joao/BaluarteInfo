package com.igreja.api.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;

import com.igreja.api.controllers.MidiaController;
import com.igreja.api.dto.comentario.ComentarioResult;
import com.igreja.api.dto.midia.MidiaFile;
import com.igreja.api.enums.AudioType;
import com.igreja.api.enums.MidiaType;
import com.igreja.api.enums.VideoType;
import com.igreja.api.exceptions.GlobalExceptionHandler;
import com.igreja.api.models.MidiaModel;
import com.igreja.api.services.MidiaService;

@WebMvcTest(MidiaController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@ContextConfiguration(classes = {MidiaController.class, GlobalExceptionHandler.class})
class MidiaControllerTest {

    @Autowired
    private org.springframework.test.web.servlet.MockMvc mockMvc;

    @MockBean
    private MidiaService midiaService;

    @Test
    void shouldCreateVideoMedia() throws Exception {
        MidiaModel midia = new MidiaModel();
        midia.setId(1);
        midia.setTitulo("Trailer");
        midia.setDescricao("Vídeo do evento");
        midia.setType(MidiaType.VIDEO);
        midia.setVideoType(VideoType.SERMON);
        midia.setUrl("https://res.cloudinary.com/demo/video/upload/v123/trailer.mp4");
        midia.setImagem("https://res.cloudinary.com/demo/image/upload/v123/capa.jpg");
        midia.setDataPublicacao(LocalDate.now());

        when(midiaService.save(any(MidiaFile.class))).thenReturn(midia);

        MockMultipartFile video = new MockMultipartFile("url", "video.mp4", "video/mp4", "fake-video".getBytes());
        MockMultipartFile imagem = new MockMultipartFile("imagem", "capa.jpg", MediaType.IMAGE_JPEG_VALUE, "img".getBytes());

        mockMvc.perform(multipart("/admin/midia/video")
                        .file(video)
                        .file(imagem)
                        .param("titulo", "Trailer")
                        .param("descricao", "Vídeo do evento")
                        .param("type", "VIDEO")
                        .param("videoType", "SERMON")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.type").value("VIDEO"));
    }

    @Test
    void shouldCreateAudioMediaWithMultipart() throws Exception {
        MidiaModel midia = new MidiaModel();
        midia.setId(2);
        midia.setTitulo("Áudio");
        midia.setDescricao("Pregação");
        midia.setType(MidiaType.AUDIO);

        MockMultipartFile audio = new MockMultipartFile("url", "audio.mp3", "audio/mpeg", "fake-audio".getBytes());
        MockMultipartFile imagem = new MockMultipartFile("imagem", "capa.jpg", MediaType.IMAGE_JPEG_VALUE, "img".getBytes());

        when(midiaService.save(any(MidiaFile.class))).thenReturn(midia);

        mockMvc.perform(multipart("/admin/midia/audio")
                        .file(audio)
                        .file(imagem)
                        .param("titulo", "Áudio")
                        .param("descricao", "Pregação")
                        .param("type", "AUDIO")
                        .param("audioType", AudioType.SERMON.name())
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    void shouldReturnValidationErrorForBlankTitle() throws Exception {
        MockMultipartFile video = new MockMultipartFile("url", "video.mp4", "video/mp4", "fake-video".getBytes());
        MockMultipartFile imagem = new MockMultipartFile("imagem", "capa.jpg", MediaType.IMAGE_JPEG_VALUE, "img".getBytes());

        mockMvc.perform(multipart("/admin/midia/video")
                        .file(video)
                        .file(imagem)
                        .param("titulo", "")
                        .param("descricao", "Vídeo do evento")
                        .param("type", "VIDEO")
                        .param("videoType", "SERMON")
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Dados inválidos"));
    }

    @Test
    void shouldListVideoMedia() throws Exception {
        when(midiaService.AllVideo(0, 10)).thenReturn(List.of());

        mockMvc.perform(get("/user/midia/video"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldListMediaComments() throws Exception {
        when(midiaService.ComentariosAll(1)).thenReturn(List.of(
                new ComentarioResult(1, "https://cdn/avatar.jpg", "Ana", "Gostei", true,LocalDate.now(),0)));

        mockMvc.perform(get("/user/midia/1/comentarioAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Ana"));
    }
}
