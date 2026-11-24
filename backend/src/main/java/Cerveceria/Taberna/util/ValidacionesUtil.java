package Cerveceria.Taberna.util;

import java.time.LocalDate;
import java.time.Period;
import java.util.regex.Pattern;

/**
 * Utilidades de validación para la Taberna de Snorlax.
 * Métodos estáticos para poder probarlos sin depender de Spring.
 */
public class ValidacionesUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private ValidacionesUtil() {
        // Clase de utilidad, no se instancia
    }

    /**
     * Valida que el email tenga un formato válido.
     */
    public static boolean esEmailValido(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Valida que la edad esté entre 18 y 120 años.
     * Lanza IllegalArgumentException si la edad no es válida.
     */
    public static void validarEdad(LocalDate fechaNacimiento) {
        if (fechaNacimiento == null) {
            throw new IllegalArgumentException("La fecha de nacimiento es obligatoria");
        }

        // Usamos Period (no solo restar años) para respetar día y mes:
        // si todavía no cumplió este año, la edad no cuenta completo.
        LocalDate hoy = LocalDate.now();
        int edad = Period.between(fechaNacimiento, hoy).getYears();

        // Si es menor de 18, entonces no puede registrarse (venta +18).
        if (edad < 18) {
            throw new IllegalArgumentException("Debes ser mayor de 18 años para registrarte");
        }
        // Si pasa de 120, entonces la fecha es inválida (probablemente un typo).
        if (edad > 120) {
            throw new IllegalArgumentException("La edad no puede ser mayor a 120 años");
        }
    }
}
