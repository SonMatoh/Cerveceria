package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.ProductoRequest;
import Cerveceria.Taberna.model.Producto;
import Cerveceria.Taberna.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@Validated
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public CollectionModel<EntityModel<Producto>> listarProductos(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String nombre) {
        // Si el front manda una categoría, entonces filtramos por ella;
        // si manda un nombre, buscamos ignorando mayúsculas;
        // si no manda nada, entonces devolvemos todo el inventario.
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

    @GetMapping("/{id}")
    public EntityModel<Producto> obtenerProducto(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe"));
        return toModel(producto);
    }

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
        Producto saved = productoRepository.save(producto);
        return toModel(saved);
    }

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
        Producto saved = productoRepository.save(producto);
        return toModel(saved);
    }

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

    // Envolvemos cada producto en EntityModel y le agregamos sus links HATEOAS:
    // "self" para el detalle y "productos" para volver al listado.
    private EntityModel<Producto> toModel(Producto producto) {
        EntityModel<Producto> model = EntityModel.of(producto);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductoController.class).obtenerProducto(producto.getId())).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductoController.class).listarProductos(null, null)).withRel("productos"));
        return model;
    }
}
