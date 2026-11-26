package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.ProductoRequest;
import Cerveceria.Taberna.model.Imagen;
import Cerveceria.Taberna.model.Producto;
import Cerveceria.Taberna.repository.ImagenRepository;
import Cerveceria.Taberna.repository.ProductoRepository;
import Cerveceria.Taberna.service.ImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import io.swagger.v3.oas.annotations.Operation;
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
@Validated
@Tag(name = "Productos", description = "Catálogo de cervezas de la taberna")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ImagenRepository imagenRepository;

    @Autowired
    private ImagenService imagenService;

    @Operation(summary = "Listar productos", description = "Obtiene el catálogo, con filtros opcionales por categoría o nombre",
        responses = { @ApiResponse(responseCode = "200", description = "Lista de productos") })
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

    @Operation(summary = "Producto por ID", description = "Obtiene un producto por su identificador",
        responses = { @ApiResponse(responseCode = "200", description = "Producto encontrado"),
                      @ApiResponse(responseCode = "404", description = "Producto no existe") })
    @GetMapping("/{id}")
    public EntityModel<Producto> obtenerProducto(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe"));
        return toModel(producto);
    }

    @Operation(summary = "Crear producto", description = "Crea un producto con stock y categoría",
        responses = { @ApiResponse(responseCode = "201", description = "Producto creado"),
                      @ApiResponse(responseCode = "400", description = "Datos inválidos") })
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
        producto.setStock(datos.getStock());
        Producto saved = productoRepository.save(producto);
        return toModel(saved);
    }

    @Operation(summary = "Actualizar producto", description = "Modifica los datos de un producto",
        responses = { @ApiResponse(responseCode = "200", description = "Producto actualizado"),
                      @ApiResponse(responseCode = "404", description = "Producto no existe") })
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
        producto.setStock(datos.getStock());
        Producto saved = productoRepository.save(producto);
        return toModel(saved);
    }

    @Operation(summary = "Eliminar producto", description = "Borra un producto del catálogo",
        responses = { @ApiResponse(responseCode = "204", description = "Producto eliminado"),
                      @ApiResponse(responseCode = "404", description = "Producto no existe") })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarProducto(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe");
        }
        productoRepository.deleteById(id);
    }

    @Operation(summary = "Subir imagen", description = "Sube una imagen del producto a ImgBB",
        responses = { @ApiResponse(responseCode = "200", description = "Imagen subida"),
                      @ApiResponse(responseCode = "400", description = "No se pudo subir") })
    @PostMapping(value = "/{id}/imagen", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> subirImagen(@PathVariable Long id,
                                         @RequestParam("imagen") MultipartFile archivo) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto " + id + " no existe"));

        try {
            String url = imagenService.subirImagen(archivo);

            // Guardar en tabla de imágenes
            Imagen imagen = new Imagen();
            imagen.setUrl(url);
            imagen.setProducto(producto);
            imagenRepository.save(imagen);

            // Actualizar URL principal del producto
            producto.setImagenUrl(url);
            productoRepository.save(producto);

            return ResponseEntity.ok(Map.of("url", url, "productoId", producto.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No se pudo subir la imagen: " + e.getMessage()));
        }
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
