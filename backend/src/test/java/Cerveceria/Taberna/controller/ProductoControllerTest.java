package Cerveceria.Taberna.controller;

import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
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

    @MockitoBean
    private ProductoRepository productoRepository;

    @Test
    void listarProductosDebeRetornarLista() throws Exception {
        Producto p1 = new Producto();
        p1.setId(1L);
        p1.setNombre("Pika");
        p1.setEstilo("Estilo");
        p1.setDescripcion("Desc");
        p1.setPrecio(4600);
        p1.setImagenUrl("/img/pika.png");
        p1.setCategoria("Cervezas");
        p1.setDescuento(0);

        Producto p2 = new Producto();
        p2.setId(2L);
        p2.setNombre("Bulba");
        p2.setEstilo("Estilo");
        p2.setDescripcion("Desc");
        p2.setPrecio(3800);
        p2.setImagenUrl("/img/bulb.png");
        p2.setCategoria("Cervezas");
        p2.setDescuento(15);

        List<Producto> productos = Arrays.asList(p1, p2);
        Mockito.when(productoRepository.findAll()).thenReturn(productos);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/productos"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$._embedded.productoList[0].nombre").value("Pika"))
                .andExpect(MockMvcResultMatchers.jsonPath("$._embedded.productoList[1].nombre").value("Bulba"));
    }

    @Test
    void obtenerProductoPorIdDebeRetornarProducto() throws Exception {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Pika");
        producto.setEstilo("Estilo");
        producto.setDescripcion("Desc");
        producto.setPrecio(4600);
        producto.setImagenUrl("/img/pika.png");
        producto.setCategoria("Cervezas");
        producto.setDescuento(0);

        Mockito.when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/productos/1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.nombre").value("Pika"));
    }

    @Test
    void crearProductoDebeRetornarProductoCreado() throws Exception {
        ProductoRequest request = new ProductoRequest();
        request.setNombre("Nuevo Producto");
        request.setPrecio(5000);
        request.setCategoria("Cervezas");
        request.setDescuento(0);

        Producto productoGuardado = new Producto();
        productoGuardado.setId(1L);
        productoGuardado.setNombre("Nuevo Producto");
        productoGuardado.setPrecio(5000);
        productoGuardado.setCategoria("Cervezas");
        productoGuardado.setDescuento(0);

        Mockito.when(productoRepository.save(ArgumentMatchers.any(Producto.class))).thenReturn(productoGuardado);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nombre").value("Nuevo Producto"));
    }

    @Test
    void crearProductoConPrecioNegativoDebeRetornar400() throws Exception {
        ProductoRequest request = new ProductoRequest();
        request.setNombre("Producto");
        request.setPrecio(-100);
        request.setCategoria("Cervezas");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void eliminarProductoDebeRetornar204() throws Exception {
        Mockito.when(productoRepository.existsById(1L)).thenReturn(true);
        Mockito.doNothing().when(productoRepository).deleteById(1L);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/productos/1"))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    void eliminarProductoInexistenteDebeRetornar404() throws Exception {
        Mockito.when(productoRepository.existsById(999L)).thenReturn(false);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/productos/999"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}