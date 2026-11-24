package Cerveceria.Taberna.controller;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(SaludController.class)
class SaludControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthDebeRetornarEstadoOk() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/health"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentTypeCompatibleWith(MediaType.valueOf("application/hal+json")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.estado").value("ok"));
    }
}