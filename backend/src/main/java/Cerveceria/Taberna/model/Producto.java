package Cerveceria.Taberna.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String estilo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Integer precio;

    private String imagenUrl;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private Integer descuento;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoriaEntidad;
}
