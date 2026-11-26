package Cerveceria.Taberna.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de errores para que TODOS los controladores devuelvan
 * el mismo formato: { error, status, campos? }.
 *
 * Los controladores que ya tienen @ExceptionHandler local (Auth, Producto)
 * siguen usándolo: Spring prefiere el handler local sobre este global.
 * Este cubre Orden, Blog, Regiones, Comunas y Categorías.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Si @Valid rechaza el body, entonces devolvemos campo -> mensaje.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> manejarValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> campos.put(error.getField(), error.getDefaultMessage()));

        Map<String, Object> body = new HashMap<>();
        body.put("error", "Datos inválidos");
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("campos", campos);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // Si un controlador lanza ResponseStatusException (404, 400, 409...),
    // entonces respetamos su status pero unificamos el cuerpo.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> manejarResponseStatus(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());

        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getReason());
        body.put("status", status.value());

        return ResponseEntity.status(status).body(body);
    }
}
