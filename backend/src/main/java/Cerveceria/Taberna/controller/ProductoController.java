package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.ProductoRequest;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import Cerveceria.Taberna.model.Producto;
import Cerveceria.Taberna.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@Tag(name = "Productos", description = "Gestión de catálogo de productos (cervezas, shooters, aperitivos)")
@Validated
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @Operation(
        summary = "Listar productos",
        description = "Obtiene todos los productos, opcionalmente filtrados por categoría o búsqueda por nombre",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de productos obtenida exitosamente")
        }
    )
    @GetMapping
    public CollectionModel<EntityModel<Producto>> listarProductos(
            @Parameter(description = "Filtrar por categoría (Cervezas, Shooters, Aperitivos)")
            @RequestParam(required = false) String categoria,
            @Parameter(description = "Buscar productos por nombre (coincidencia parcial)")
            @RequestParam(required = false) String nombre) {
        List<Producto> productos;
        if (categoria != null && !categoria.isEmpty()) {
            productos = productoRepository.findByCategoria(categoria);
        } else if (nombre != null && !nombre.isEmpty()) {
            productos = productoRepository.findByNombreContainingIgnoreCase(nombre);
        } else {
            productos = productoRepository.findAll();
        }

        List<EntityModel<Producto>> productoModels = productos.stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(productoModels,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductoController.class).listarProductos(null, null)).withSelfRel());
    }

    @Operation(
        summary = "Obtener producto por ID",
        description = "Obtiene un producto específico por su identificador",
        responses = {
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
        }
    )
    @GetMapping("/{id}")
    public EntityModel<Producto> obtenerProducto(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe"));
        return toModel(producto);
    }

    @Operation(
        summary = "Crear producto",
        description = "Crea un nuevo producto (solo administradores)",
        responses = {
            @ApiResponse(responseCode = "201", description = "Producto creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
        }
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EntityModel<Producto> crearProducto(@Valid @RequestBody ProductoRequest datos) {
        Producto producto = new Producto();
        producto.setNombre(datos.getNombre());
        producto.setEstilo(datos.getEstilo());
        producto.setDescripcion(datos.getDescripcion());
        producto.setPrecio(datos.getPrecio());
        producto.setImagenUrl(datos.getImagenUrl());
        producto.setCategoria(datos.getCategoria());
        producto.setDescuento(datos.getDescuento());
        Producto guardado = productoRepository.save(producto);
        return toModel(guardado);
    }

    @Operation(
        summary = "Actualizar producto",
        description = "Actualiza un producto existente (solo administradores)",
        responses = {
            @ApiResponse(responseCode = "200", description = "Producto actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
        }
    )
    @PutMapping("/{id}")
    public EntityModel<Producto> actualizarProducto(@PathVariable Long id, @Valid @RequestBody ProductoRequest datos) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe"));
        producto.setNombre(datos.getNombre());
        producto.setEstilo(datos.getEstilo());
        producto.setDescripcion(datos.getDescripcion());
        producto.setPrecio(datos.getPrecio());
        producto.setImagenUrl(datos.getImagenUrl());
        producto.setCategoria(datos.getCategoria());
        producto.setDescuento(datos.getDescuento());
        Producto guardado = productoRepository.save(producto);
        return toModel(guardado);
    }

    @Operation(
        summary = "Eliminar producto",
        description = "Elimina un producto por su ID (solo administradores)",
        responses = {
            @ApiResponse(responseCode = "204", description = "Producto eliminado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
        }
    )
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarProducto(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe");
        }
        productoRepository.deleteById(id);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> manejarErroresValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errores.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Datos inválidos", "campos", errores));
    }

    private EntityModel<Producto> toModel(Producto producto) {
        EntityModel<Producto> model = EntityModel.of(producto);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductoController.class).obtenerProducto(producto.getId())).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductoController.class).listarProductos(null, null)).withRel("productos"));
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductoController.class).crearProducto(null)).withRel("crear-producto"));
        return model;
    }
}
