package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.OrdenItemRequest;
import Cerveceria.Taberna.model.Orden;
import Cerveceria.Taberna.model.Producto;
import Cerveceria.Taberna.model.Usuario;
import Cerveceria.Taberna.repository.DetalleOrdenRepository;
import Cerveceria.Taberna.repository.OrdenRepository;
import Cerveceria.Taberna.repository.ProductoRepository;
import Cerveceria.Taberna.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrdenController.class)
class OrdenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrdenRepository ordenRepository;

    @MockitoBean
    private DetalleOrdenRepository detalleOrdenRepository;

    @MockitoBean
    private ProductoRepository productoRepository;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @Test
    void listarOrdenesDebeRetornarLista() throws Exception {
        Orden o1 = new Orden();
        o1.setId(1L);
        o1.setUsuarioId(1L);
        o1.setNroOrden("ORDER-000001");
        o1.setSubtotal(5000);
        o1.setDescuento(0);
        o1.setTotal(5000);
        o1.setFecha(LocalDateTime.now());
        o1.setEstado("pendiente");

        Orden o2 = new Orden();
        o2.setId(2L);
        o2.setUsuarioId(2L);
        o2.setNroOrden("ORDER-000002");
        o2.setSubtotal(3000);
        o2.setDescuento(0);
        o2.setTotal(3000);
        o2.setFecha(LocalDateTime.now());
        o2.setEstado("entregada");

        List<Orden> ordenes = Arrays.asList(o1, o2);
        Mockito.when(ordenRepository.findAllByOrderByIdDesc()).thenReturn(ordenes);

        mockMvc.perform(get("/api/ordenes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].total").value(5000))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].total").value(3000));
    }

    @Test
    void crearOrdenDebeRetornar201() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan");
        usuario.setEmail("juan@email.com");
        Mockito.when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Producto producto = new Producto();
        producto.setId(10L);
        producto.setNombre("Cerveza test");
        producto.setPrecio(5000);
        producto.setDescuento(0);
        producto.setStock(100);
        Mockito.when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));

        Mockito.when(ordenRepository.save(ArgumentMatchers.any(Orden.class))).thenAnswer(invocation -> {
            Orden o = invocation.getArgument(0);
            o.setId(100L);
            o.setNroOrden("ORDER-000100");
            return o;
        });

        String json = "{ \"usuarioId\": 1, \"estado\": \"pendiente\", " +
                "\"items\": [ { \"productoId\": 10, \"cantidad\": 2 } ] }";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.total").value(10000));
    }

    @Test
    void crearOrdenConUsuarioInexistenteDebeRetornar400() throws Exception {
        String json = "{ \"usuarioId\": 999, \"estado\": \"pendiente\", \"items\": [] }";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void crearOrdenSinItemsDebeRetornar400() throws Exception {
        Mockito.when(usuarioRepository.findById(1L)).thenReturn(Optional.of(new Usuario()));

        String json = "{ \"usuarioId\": 1, \"estado\": \"pendiente\", \"items\": [] }";

        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }
}
