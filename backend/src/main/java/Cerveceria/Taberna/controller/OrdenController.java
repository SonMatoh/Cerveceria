package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.model.Orden;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import Cerveceria.Taberna.model.Usuario;
import Cerveceria.Taberna.repository.OrdenRepository;
import Cerveceria.Taberna.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "*")
@Tag(name = "Órdenes", description = "Gestión de órdenes de compra y boletas")
public class OrdenController {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Operation(
        summary = "Listar órdenes",
        description = "Obtiene todas las órdenes, opcionalmente filtradas por usuario",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de órdenes obtenida exitosamente")
        }
    )
    @GetMapping
    public CollectionModel<EntityModel<Orden>> listarOrdenes(
            @Parameter(description = "Filtrar órdenes por ID de usuario")
            @RequestParam(required = false) Long usuarioId) {
        List<Orden> ordenes;
        if (usuarioId != null) {
            ordenes = ordenRepository.findAll().stream()
                    .filter(o -> o.getUsuarioId().equals(usuarioId))
                    .collect(java.util.stream.Collectors.toList());
        } else {
            ordenes = ordenRepository.findAll();
        }

        List<EntityModel<Orden>> ordenModels = ordenes.stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(ordenModels,
                linkTo(methodOn(OrdenController.class).listarOrdenes(null)).withSelfRel());
    }

    @Operation(
        summary = "Obtener orden por ID",
        description = "Obtiene una orden específica por su identificador",
        responses = {
            @ApiResponse(responseCode = "200", description = "Orden encontrada"),
            @ApiResponse(responseCode = "404", description = "Orden no encontrada")
        }
    )
    @GetMapping("/{id}")
    public EntityModel<Orden> obtenerOrden(@PathVariable Long id) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden " + id + " no existe"));
        return toModel(orden);
    }

    @Operation(
        summary = "Crear orden",
        description = "Crea una nueva orden de compra",
        responses = {
            @ApiResponse(responseCode = "201", description = "Orden creada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
        }
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EntityModel<Orden> crearOrden(@Valid @RequestBody Map<String, Object> datos) {
        Long usuarioId = Long.valueOf(datos.get("usuarioId").toString());
        Integer total = Integer.valueOf(datos.get("total").toString());
        String estado = (String) datos.getOrDefault("estado", "pendiente");

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        if (usuarioOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario " + usuarioId + " no existe");
        }

        Orden orden = new Orden();
        orden.setUsuarioId(usuarioId);
        orden.setTotal(total);
        orden.setFecha(LocalDateTime.now());
        orden.setEstado(estado);

        Orden guardada = ordenRepository.save(orden);
        return toModel(guardada);
    }

    @Operation(
        summary = "Actualizar estado de orden",
        description = "Actualiza el estado de una orden existente",
        responses = {
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "404", description = "Orden no encontrada")
        }
    )
    @PutMapping("/{id}/estado")
    public EntityModel<Orden> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden " + id + " no existe"));
        orden.setEstado(datos.get("estado"));
        Orden guardada = ordenRepository.save(orden);
        return toModel(guardada);
    }

    private EntityModel<Orden> toModel(Orden orden) {
        EntityModel<Orden> model = EntityModel.of(orden);
        model.add(linkTo(methodOn(OrdenController.class).obtenerOrden(orden.getId())).withSelfRel());
        model.add(linkTo(methodOn(OrdenController.class).listarOrdenes(null)).withRel("ordenes"));
        model.add(linkTo(methodOn(OrdenController.class).crearOrden(null)).withRel("crear-orden"));
        return model;
    }
}
