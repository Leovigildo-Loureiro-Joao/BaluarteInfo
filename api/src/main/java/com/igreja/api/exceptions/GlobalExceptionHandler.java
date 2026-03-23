package com.igreja.api.exceptions;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeoutException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.igreja.api.dto.error.ApiErrorResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {
        List<String> details = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::formatFieldError)
                .toList();

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Dados inválidos",
                "Verifique os campos enviados.",
                request,
                details);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatus(
            ResponseStatusException exception,
            HttpServletRequest request) {
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        return buildResponse(
                status,
                status.getReasonPhrase(),
                exception.getReason(),
                request,
                List.of());
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            NoSuchElementException.class,
            DateTimeParseException.class
    })
    public ResponseEntity<ApiErrorResponse> handleBadRequest(
            RuntimeException exception,
            HttpServletRequest request) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Requisição inválida",
                safeMessage(exception, "O pedido enviado é inválido."),
                request,
                List.of());
    }

    @ExceptionHandler({
            BadCredentialsException.class,
            UsernameNotFoundException.class
    })
    public ResponseEntity<ApiErrorResponse> handleAuthentication(
            RuntimeException exception,
            HttpServletRequest request) {
        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                "Não autenticado",
                "Email ou palavra-passe inválidos.",
                request,
                List.of());
    }

    @ExceptionHandler(TimeoutException.class)
    public ResponseEntity<ApiErrorResponse> handleTimeout(
            TimeoutException exception,
            HttpServletRequest request) {
        return buildResponse(
                HttpStatus.GATEWAY_TIMEOUT,
                "Tempo esgotado",
                safeMessage(exception, "A operação demorou mais do que o esperado."),
                request,
                List.of());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiErrorResponse> handleUploadSize(
            MaxUploadSizeExceededException exception,
            HttpServletRequest request) {
        return buildResponse(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "Ficheiro muito grande",
                "O ficheiro enviado ultrapassa o limite permitido.",
                request,
                List.of());
    }

    /**
     * Ajuda a diagnosticar loops de serialização (ex.: "Infinite recursion").
     * Loga a chain/path que o Jackson estava a serializar.
     */
    @ExceptionHandler(HttpMessageNotWritableException.class)
    public ResponseEntity<ApiErrorResponse> handleNotWritable(
            HttpMessageNotWritableException exception,
            HttpServletRequest request) {
        Throwable cause = exception.getMostSpecificCause();
        if (cause instanceof JsonMappingException mapping) {
            log.error("Serialization error on {} {}: {} | path={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    safeMessage(mapping, mapping.getOriginalMessage()),
                    mapping.getPathReference(),
                    exception);
        } else {
            log.error("Serialization error on {} {}", request.getMethod(), request.getRequestURI(), exception);
        }
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno",
                "Falha ao gerar a resposta (erro de serialização).",
                request,
                List.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(
            Exception exception,
            HttpServletRequest request) {
        log.error("Unhandled exception on {} {}", request.getMethod(), request.getRequestURI(), exception);
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno",
                "Ocorreu um erro inesperado. Tente novamente.",
                request,
                List.of());
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
            HttpStatus status,
            String error,
            String message,
            HttpServletRequest request,
            List<String> details) {
        ApiErrorResponse response = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                request.getRequestURI(),
                details);
        return ResponseEntity.status(status).body(response);
    }

    private String formatFieldError(FieldError error) {
        return error.getField() + ": " + error.getDefaultMessage();
    }

    private String safeMessage(Exception exception, String fallback) {
        return exception.getMessage() == null || exception.getMessage().isBlank()
                ? fallback
                : exception.getMessage();
    }
}
