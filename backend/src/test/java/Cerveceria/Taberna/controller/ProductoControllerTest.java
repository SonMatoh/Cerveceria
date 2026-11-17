package Cerveceria.Taberna.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import Cerveceria.Taberna.dto.ProductoRequest;
import Cerveceria.Taberna.model.Producto;
import Cerveceria.Taberna.repository.ProductoRepository;

@WebMvcTest(ProductoController.class)
class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private ProductoRepository productoRepository;

    @Test
    void listarProductosDebeRetornarLista() throws Exception {
        List<Producto> productos = Arrays.asList(
                new Producto(1L, "Pika", "Estilo", "Desc", 4600, "/img/pika.png", "Cervezas", 0),
                new Producto(2L, "Bulba", "Estilo", "Desc", 3800, "/img/bulb.png", "Cervezas", 15)
        );
        when(productoRepository.findAll()).thenReturn(productos);

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Pika"))
                .andExpect(jsonPath("$[1].nombre").value("Bulba"));
    }

    @Test
    void obtenerProductoPorIdDebeRetornarProducto() throws Exception {
        Producto producto = new Producto(1L, "Pika", "Estilo", "Desc", 4600, "/img/pika.png", "Cervezas", 0);
        when(productoRepository.findById(1L)).thenReturn(java.util.Optional.of(producto));

        mockMvc.perform(get("/api/productos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Pika"));
    }

    @Test
    void crearProductoDebeRetornarProductoCreado() throws Exception {
        ProductoRequest request = new ProductoRequest();
        request.setNombre("Nuevo Producto");
        request.setPrecio(5000);
        request.setCategoria("Cervezas");
        request.setDescuento(0);

        Producto productoGuardado = new Producto(1L, "Nuevo Producto", null, null, 5000, null, "Cervezas", 0);
        when(productoRepository.save(any(Producto.class))).thenReturn(productoGuardado);

        mockMvc.perform(post("/api/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Nuevo Producto"));
    }

    @Test
    void crearProductoConPrecioNegativoDebeRetornar400() throws Exception {
        ProductoRequest request = new ProductoRequest();
        request.setNombre("Producto");
        request.setPrecio(-100);
        request.setCategoria("Cervezas");

        mockMvc.perform(post("/api/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void eliminarProductoDebeRetornar204() throws Exception {
        when(productoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productoRepository).deleteById(1L);

        mockMvc.perform(delete("/api/productos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void eliminarProductoInexistenteDebeRetornar404() throws Exception {
        when(productoRepository.existsById(999L)).thenReturn(false);

        mockMvc.perform(delete("/api/productos/999"))
                .andExpect(status().isNotFound());
    }
}
