package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.OrdenItemResponse;
import Cerveceria.Taberna.dto.OrdenRequest;
import Cerveceria.Taberna.dto.OrdenResponse;
import Cerveceria.Taberna.model.DetalleOrden;
import Cerveceria.Taberna.model.Orden;
import Cerveceria.Taberna.model.Producto;
import Cerveceria.Taberna.repository.DetalleOrdenRepository;
import Cerveceria.Taberna.repository.OrdenRepository;
import Cerveceria.Taberna.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "*")
@Tag(name = "Órdenes", description = "Checkout real: calcula total, descuenta stock y guarda ítems")
public class OrdenController {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private DetalleOrdenRepository detalleOrdenRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Operation(summary = "Listar órdenes", description = "Devuelve todas las órdenes, más recientes primero",
        responses = { @ApiResponse(responseCode = "200", description = "Lista de órdenes") })
    @GetMapping
    public List<OrdenResponse> listar() {
        return ordenRepository.findAllByOrderByIdDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Operation(summary = "Orden por ID", description = "Obtiene una orden con sus ítems",
        responses = { @ApiResponse(responseCode = "200", description = "Orden encontrada"),
                      @ApiResponse(responseCode = "404", description = "Orden no existe") })
    @GetMapping("/{id}")
    public OrdenResponse obtener(@PathVariable Long id) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden " + id + " no existe"));
        return toResponse(orden);
    }

    @Operation(summary = "Crear orden (checkout)", description = "Valida stock, calcula precios, descuenta unidades y guarda el detalle",
        responses = { @ApiResponse(responseCode = "201", description = "Orden creada"),
                      @ApiResponse(responseCode = "400", description = "Stock insuficiente o datos inválidos") })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public OrdenResponse crear(@RequestBody OrdenRequest datos) {
        if (datos.getUsuarioId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario es obligatorio");
        }
        if (datos.getItems() == null || datos.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La orden debe tener al menos un ítem");
        }

        Integer[] subtotal = {0};
        Integer[] descuentoTotal = {0};

        Orden orden = new Orden();
        orden.setUsuarioId(datos.getUsuarioId());
        orden.setNroOrden(null); // El trigger de BD lo genera: ORDER-000001, ...
        orden.setFecha(LocalDateTime.now());
        orden.setEstado(datos.getEstado() != null ? datos.getEstado() : "pendiente");
        orden.setMetodoPago(datos.getMetodoPago());
        orden.setEntrega(datos.getEntrega());
        orden.setCalle(datos.getCalle());
        orden.setNumero(datos.getNumero());
        orden.setComplemento(datos.getComplemento());
        orden.setComuna(datos.getComuna());
        orden.setRegion(datos.getRegion());

        List<OrdenItemResponse> itemsResponse = datos.getItems().stream().map(item -> {
            if (item.getProductoId() == null || item.getCantidad() == null || item.getCantidad() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ítem inválido: producto y cantidad requeridos");
            }
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Producto " + item.getProductoId() + " no existe"));
            if (producto.getStock() == null || producto.getStock() < item.getCantidad()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Stock insuficiente para " + producto.getNombre());
            }

            Integer precioUnitario = producto.getPrecio();
            Integer subtotalItem = precioUnitario * item.getCantidad();
            Integer descuentoItem = (producto.getDescuento() != null ? producto.getDescuento() : 0)
                    * subtotalItem / 100;

            subtotal[0] += subtotalItem;
            descuentoTotal[0] += descuentoItem;

            // Descontar stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            DetalleOrden detalle = new DetalleOrden();
            detalle.setOrden(orden);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(precioUnitario);
            detalleOrdenRepository.save(detalle);

            return new OrdenItemResponse(
                    producto.getId(),
                    producto.getNombre(),
                    item.getCantidad(),
                    precioUnitario
            );
        }).collect(Collectors.toList());

        Integer total = subtotal[0] - descuentoTotal[0];
        orden.setSubtotal(subtotal[0]);
        orden.setDescuento(descuentoTotal[0]);
        orden.setTotal(total);

        Orden saved = ordenRepository.save(orden);

        return new OrdenResponse(
                saved.getId(),
                saved.getNroOrden(),
                saved.getSubtotal(),
                saved.getDescuento(),
                saved.getTotal(),
                saved.getEstado(),
                itemsResponse
        );
    }

    private OrdenResponse toResponse(Orden orden) {
        List<OrdenItemResponse> items = orden.getDetalles() == null ? List.of()
                : orden.getDetalles().stream()
                        .map(d -> new OrdenItemResponse(
                                d.getProducto().getId(),
                                d.getProducto().getNombre(),
                                d.getCantidad(),
                                d.getPrecioUnitario()))
                        .collect(Collectors.toList());
        return new OrdenResponse(
                orden.getId(),
                orden.getNroOrden(),
                orden.getSubtotal(),
                orden.getDescuento(),
                orden.getTotal(),
                orden.getEstado(),
                items
        );
    }
}
