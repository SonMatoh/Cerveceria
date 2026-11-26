package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.model.Categoria;
import Cerveceria.Taberna.repository.CategoriaRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@WebMvcTest(CategoriaController.class)
class CategoriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoriaRepository categoriaRepository;

    @Test
    void listarCategoriasDebeRetornarLista() throws Exception {
        Categoria c1 = new Categoria(1L, "Cervezas");
        Categoria c2 = new Categoria(2L, "Shooters");
        List<Categoria> categorias = Arrays.asList(c1, c2);

        Mockito.when(categoriaRepository.findAll()).thenReturn(categorias);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categorias"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$._embedded.categoriaList[0].nombre").value("Cervezas"))
                .andExpect(MockMvcResultMatchers.jsonPath("$._embedded.categoriaList[1].nombre").value("Shooters"));
    }

    @Test
    void obtenerCategoriaPorIdDebeRetornarCategoria() throws Exception {
        Categoria categoria = new Categoria(1L, "Cervezas");
        Mockito.when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categorias/1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nombre").value("Cervezas"));
    }

    @Test
    void obtenerCategoriaInexistenteDebeRetornar404() throws Exception {
        Mockito.when(categoriaRepository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categorias/999"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}
