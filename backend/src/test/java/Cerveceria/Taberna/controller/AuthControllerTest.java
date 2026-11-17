package Cerveceria.Taberna.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import Cerveceria.Taberna.dto.LoginRequest;
import Cerveceria.Taberna.dto.RegistroRequest;
import Cerveceria.Taberna.model.Usuario;
import Cerveceria.Taberna.repository.UsuarioRepository;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        // Si tienes un endpoint /api/auth/logout, podrías llamarlo aquí
        // en caso de que algún test deje la sesión estática activa.
    }

    @Test
    void registroExitosoDebeRetornar201() throws Exception {
        RegistroRequest request = new RegistroRequest();
        request.setNombre("Juan Perez");
        request.setEmail("juan@email.com");
        request.setPassword("password123");
        request.setFechaNacimiento("2000-01-01");

        when(usuarioRepository.findByEmail("juan@email.com")).thenReturn(null);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        mockMvc.perform(post("/api/auth/registro")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ok").value(true));
    }

    @Test
    void registroConEmailDuplicadoDebeRetornar400() throws Exception {
        RegistroRequest request = new RegistroRequest();
        request.setNombre("Juan Perez");
        request.setEmail("juan@email.com");
        request.setPassword("password123");
        request.setFechaNacimiento("2000-01-01");

        Usuario existente = new Usuario();
        existente.setId(1L);
        existente.setEmail("juan@email.com");
        when(usuarioRepository.findByEmail("juan@email.com")).thenReturn(existente);

        mockMvc.perform(post("/api/auth/registro")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registroConEdadMenorA18DebeRetornar400() throws Exception {
        RegistroRequest request = new RegistroRequest();
        request.setNombre("Juan Perez");
        request.setEmail("juan@email.com");
        request.setPassword("password123");
        request.setFechaNacimiento("2020-01-01"); // 6 años aprox

        when(usuarioRepository.findByEmail("juan@email.com")).thenReturn(null);

        mockMvc.perform(post("/api/auth/registro")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginExitosoDebeRetornarToken() throws Exception {
        String passwordPlano = "password123";
        String passwordHasheada = passwordEncoder.encode(passwordPlano);

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan Perez");
        usuario.setEmail("juan@email.com");
        usuario.setPassword(passwordHasheada);
        usuario.setRol("cliente");
        usuario.setFechaNacimiento(LocalDate.of(2000, 1, 1));

        when(usuarioRepository.findByEmail("juan@email.com")).thenReturn(usuario);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("juan@email.com");
        loginRequest.setPassword(passwordPlano);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void loginConContrasenaIncorrectaDebeRetornar401() throws Exception {
        String passwordHasheada = passwordEncoder.encode("passwordCorrecto");

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("juan@email.com");
        usuario.setPassword(passwordHasheada);

        when(usuarioRepository.findByEmail("juan@email.com")).thenReturn(usuario);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("juan@email.com");
        loginRequest.setPassword("passwordIncorrecto");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginConEmailNoRegistradoDebeRetornar401() throws Exception {
        when(usuarioRepository.findByEmail("noexiste@email.com")).thenReturn(null);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("noexiste@email.com");
        loginRequest.setPassword("cualquiercosa");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}