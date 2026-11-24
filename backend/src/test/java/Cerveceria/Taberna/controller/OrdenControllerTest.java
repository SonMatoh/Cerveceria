package Cerveceria.Taberna.controller;

import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import Cerveceria.Taberna.model.Orden;
import Cerveceria.Taberna.model.Usuario;
import Cerveceria.Taberna.repository.OrdenRepository;
import Cerveceria.Taberna.repository.UsuarioRepository;

@WebMvcTest(OrdenController.class)
class OrdenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrdenRepository ordenRepository;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @Test
    void listarOrdenesDebeRetornarLista() throws Exception {
        List<Orden> ordenes = Arrays.asList(
                new Orden(1L, 1L, 5000, LocalDateTime.now(), "pendiente"),
                new Orden(2L, 2L, 3000, LocalDateTime.now(), "entregada")
        );
        Mockito.when(ordenRepository.findAll()).thenReturn(ordenes);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/ordenes"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$._embedded.ordenList[0].total").value(5000))
                .andExpect(MockMvcResultMatchers.jsonPath("$._embedded.ordenList[1].total").value(3000));
    }

    @Test
    void crearOrdenDebeRetornar201() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setEmail("juan@email.com");
        Mockito.when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Mockito.when(ordenRepository.save(ArgumentMatchers.any(Orden.class))).thenAnswer(invocation -> {
            Orden o = invocation.getArgument(0);
            o.setId(10L);
            return o;
        });

        String json = "{ \"usuarioId\": 1, \"total\": 5000, \"estado\": \"pendiente\" }";

        mockMvc.perform(MockMvcRequestBuilders.post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(10))
                .andExpect(MockMvcResultMatchers.jsonPath("$.total").value(5000));
    }

    @Test
    void crearOrdenConUsuarioInexistenteDebeRetornar404() throws Exception {
        Mockito.when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        String json = "{ \"usuarioId\": 999, \"total\": 5000 }";

        mockMvc.perform(MockMvcRequestBuilders.post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}