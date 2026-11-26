package Cerveceria.Taberna.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "nro_orden", nullable = false, unique = true, length = 20)
    private String nroOrden;

    @Column(nullable = false)
    private Integer subtotal;

    @Column(nullable = false)
    private Integer descuento;

    @Column(nullable = false)
    private Integer total;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private String estado;

    @Column(name = "metodo_pago", length = 30)
    private String metodoPago;

    @Column(name = "entrega", length = 30)
    private String entrega;

    @Column(name = "calle", length = 150)
    private String calle;

    @Column(name = "numero", length = 30)
    private String numero;

    @Column(name = "complemento", length = 100)
    private String complemento;

    @Column(name = "comuna", length = 100)
    private String comuna;

    @Column(name = "region", length = 100)
    private String region;

    @OneToMany(mappedBy = "orden")
    private List<DetalleOrden> detalles = new ArrayList<>();
}
