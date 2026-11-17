package Cerveceria.Taberna.util;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ValidacionesUtilTest {

    // -----------------------------------------------------------
    // Pruebas para esEmailValido
    // -----------------------------------------------------------

    @Test
    @DisplayName("Email válido debe retornar true")
    void esEmailValido_conEmailValido_retornaTrue() {
        assertTrue(ValidacionesUtil.esEmailValido("usuario@correo.com"));
        assertTrue(ValidacionesUtil.esEmailValido("usuario.nombre@dominio.co"));
        assertTrue(ValidacionesUtil.esEmailValido("usuario+etiqueta@sub.dominio.org"));
    }

    @Test
    @DisplayName("Email nulo debe retornar false")
    void esEmailValido_conNulo_retornaFalse() {
        assertFalse(ValidacionesUtil.esEmailValido(null));
    }

    @Test
    @DisplayName("Email vacío debe retornar false")
    void esEmailValido_conVacio_retornaFalse() {
        assertFalse(ValidacionesUtil.esEmailValido(""));
    }

    @Test
    @DisplayName("Email sin arroba debe retornar false")
    void esEmailValido_sinArroba_retornaFalse() {
        assertFalse(ValidacionesUtil.esEmailValido("usuariodominio.com"));
    }

    @Test
    @DisplayName("Email sin punto en dominio debe retornar false")
    void esEmailValido_sinPuntoEnDominio_retornaFalse() {
        assertFalse(ValidacionesUtil.esEmailValido("usuario@dominiocom"));
    }

    @Test
    @DisplayName("Email con espacios debe retornar false")
    void esEmailValido_conEspacios_retornaFalse() {
        assertFalse(ValidacionesUtil.esEmailValido("usuario @dominio.com"));
    }

    // -----------------------------------------------------------
    // Pruebas para validarEdad
    // -----------------------------------------------------------

    @Test
    @DisplayName("Edad exactamente 18 años es válida")
    void validarEdad_con18Anios_noLanzaExcepcion() {
        LocalDate fecha18AniosAtras = LocalDate.now().minusYears(18);
        assertDoesNotThrow(() -> ValidacionesUtil.validarEdad(fecha18AniosAtras));
    }

    @Test
    @DisplayName("Edad 19 años es válida")
    void validarEdad_con19Anios_noLanzaExcepcion() {
        LocalDate fecha19AniosAtras = LocalDate.now().minusYears(19);
        assertDoesNotThrow(() -> ValidacionesUtil.validarEdad(fecha19AniosAtras));
    }

    @Test
    @DisplayName("Edad 120 años es válida")
    void validarEdad_con120Anios_noLanzaExcepcion() {
        LocalDate fecha120AniosAtras = LocalDate.now().minusYears(120);
        assertDoesNotThrow(() -> ValidacionesUtil.validarEdad(fecha120AniosAtras));
    }

    @Test
    @DisplayName("Edad 17 años lanza excepcion")
    void validarEdad_con17Anios_lanzaExcepcion() {
        LocalDate fecha17AniosAtras = LocalDate.now().minusYears(17);
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidacionesUtil.validarEdad(fecha17AniosAtras));
        assertEquals("Debes ser mayor de 18 años para registrarte", ex.getMessage());
    }

    @Test
    @DisplayName("Edad 1 año lanza excepcion")
    void validarEdad_con1Anio_lanzaExcepcion() {
        LocalDate fecha1AnioAtras = LocalDate.now().minusYears(1);
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidacionesUtil.validarEdad(fecha1AnioAtras));
        assertEquals("Debes ser mayor de 18 años para registrarte", ex.getMessage());
    }

    @Test
    @DisplayName("Edad 121 años lanza excepcion")
    void validarEdad_con121Anios_lanzaExcepcion() {
        LocalDate fecha121AniosAtras = LocalDate.now().minusYears(121);
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidacionesUtil.validarEdad(fecha121AniosAtras));
        assertEquals("La edad no puede ser mayor a 120 años", ex.getMessage());
    }

    @Test
    @DisplayName("Fecha nula lanza excepcion")
    void validarEdad_conNulo_lanzaExcepcion() {
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidacionesUtil.validarEdad(null));
        assertEquals("La fecha de nacimiento es obligatoria", ex.getMessage());
    }

    @Test
    @DisplayName("Fecha futura lanza excepcion (edad negativa)")
    void validarEdad_conFechaFutura_lanzaExcepcion() {
        LocalDate fechaFutura = LocalDate.now().plusYears(1);
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidacionesUtil.validarEdad(fechaFutura));
        assertEquals("Debes ser mayor de 18 años para registrarte", ex.getMessage());
    }
}
