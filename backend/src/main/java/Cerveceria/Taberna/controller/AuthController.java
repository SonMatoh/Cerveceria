package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.LoginRequest;
import Cerveceria.Taberna.dto.RegistroRequest;
import Cerveceria.Taberna.model.Usuario;
import Cerveceria.Taberna.repository.UsuarioRepository;
import Cerveceria.Taberna.util.ValidacionesUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación", description = "Endpoints de inicio de sesión, registro y gestión de sesión")
@Validated
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Sesión en memoria simple (para desarrollo)
    private static String sesionEmail = null;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Operation(
        summary = "Iniciar sesión",
        description = "Autentica un usuario con email y contraseña",
        responses = {
            @ApiResponse(responseCode = "200", description = "Autenticación exitosa"),
            @ApiResponse(responseCode = "400", description = "Email inválido"),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
        }
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest credenciales) {
        String email = credenciales.getEmail().trim().toLowerCase();
        String password = credenciales.getPassword();

        if (!ValidacionesUtil.esEmailValido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El formato del email es inválido"));
        }

        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        // Comparar contraseña hasheada con BCrypt
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        sesionEmail = email;

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("token", "token-simulado-" + email);
        respuesta.put("usuario", usuario);
        return ResponseEntity.ok(respuesta);
    }

    @Operation(
        summary = "Registrar usuario",
        description = "Crea una nueva cuenta de usuario (verifica edad 18-120 años)",
        responses = {
            @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o email duplicado")
        }
    )
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest datos) {
        String nombre = datos.getNombre().trim();
        String email = datos.getEmail().trim().toLowerCase();
        String password = datos.getPassword();
        String fechaNacimientoStr = datos.getFechaNacimiento();

        // Validar formato de email
        if (!ValidacionesUtil.esEmailValido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El formato del email es inválido"));
        }

        // Validar email duplicado
        if (usuarioRepository.findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El email ya está registrado"));
        }

        // Parsear fecha de nacimiento
        LocalDate fechaNacimiento;
        try {
            fechaNacimiento = LocalDate.parse(fechaNacimientoStr);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Formato de fecha inválido. Use YYYY-MM-DD"));
        }

        // Validar edad entre 18 y 120 años
        ValidacionesUtil.validarEdad(fechaNacimiento);

        Usuario nuevo = new Usuario();
        nuevo.setNombre(nombre);
        nuevo.setEmail(email);
        // Hashear contraseña con BCrypt
        nuevo.setPassword(passwordEncoder.encode(password));
        nuevo.setRol("cliente");
        nuevo.setFechaNacimiento(fechaNacimiento);

        usuarioRepository.save(nuevo);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("ok", true);
        respuesta.put("mensaje", "Usuario registrado exitosamente");
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @Operation(
        summary = "Obtener sesión activa",
        description = "Devuelve el usuario actualmente autenticado",
        responses = {
            @ApiResponse(responseCode = "200", description = "Sesión activa"),
            @ApiResponse(responseCode = "401", description = "No hay sesión activa")
        }
    )
    @GetMapping("/sesion")
    public ResponseEntity<?> sesion() {
        if (sesionEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No hay sesión activa"));
        }

        Usuario usuario = usuarioRepository.findByEmail(sesionEmail);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Sesión inválida"));
        }

        return ResponseEntity.ok(usuario);
    }

    @Operation(
        summary = "Cerrar sesión",
        description = "Elimina la sesión activa del usuario",
        responses = {
            @ApiResponse(responseCode = "200", description = "Sesión cerrada exitosamente")
        }
    )
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        sesionEmail = null;
        return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada"));
    }

    @Operation(
        summary = "Verificar rol de administrador",
        description = "Indica si el usuario autenticado tiene rol de administrador",
        responses = {
            @ApiResponse(responseCode = "200", description = "Estado del rol administrador"),
            @ApiResponse(responseCode = "401", description = "No hay sesión activa")
        }
    )
    @GetMapping("/es-admin")
    public ResponseEntity<?> esAdmin() {
        if (sesionEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("esAdmin", false));
        }

        Usuario usuario = usuarioRepository.findByEmail(sesionEmail);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("esAdmin", false));
        }

        boolean esAdmin = "admin".equals(usuario.getRol());
        return ResponseEntity.ok(Map.of("esAdmin", esAdmin));
    }

    /**
     * Manejador de errores de validación @Valid
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> manejarErroresValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errores.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Datos inválidos", "campos", errores));
    }
}
