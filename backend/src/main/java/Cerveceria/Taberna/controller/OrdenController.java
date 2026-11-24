package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.model.Orden;
import Cerveceria.Taberna.model.Usuario;
import Cerveceria.Taberna.repository.OrdenRepository;
import Cerveceria.Taberna.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "*")
public class OrdenController {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public CollectionModel<EntityModel<Orden>> listarOrdenes(
            @RequestParam(required = false) Long usuarioId) {
        List<Orden> ordenes;
        if (usuarioId != null) {
            ordenes = ordenRepository.findAll().stream()
                    .filter(o -> o.getUsuarioId().equals(usuarioId))
                    .collect(Collectors.toList());
        } else {
            ordenes = ordenRepository.findAll();
        }

        List<EntityModel<Orden>> ordenModels = ordenes.stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(ordenModels,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrdenController.class).listarOrdenes(null)).withSelfRel());
    }

    @GetMapping("/{id}")
    public EntityModel<Orden> obtenerOrden(@PathVariable Long id) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden " + id + " no existe"));
        return toModel(orden);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EntityModel<Orden> crearOrden(@RequestBody Map<String, Object> datos) {
        Long usuarioId = Long.valueOf(datos.get("usuarioId").toString());
        Integer total = Integer.valueOf(datos.get("total").toString());
        String estado = (String) datos.getOrDefault("estado", "pendiente");

        // Si el usuario de la orden no existe, entonces no guardamos nada:
        // devolvemos 404 para que el checkout no cree una orden huérfana.
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        if (usuarioOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario " + usuarioId + " no existe");
        }

        Orden orden = new Orden();
        orden.setUsuarioId(usuarioId);
        orden.setTotal(total);
        orden.setFecha(LocalDateTime.now());
        orden.setEstado(estado);

        Orden saved = ordenRepository.save(orden);
        return toModel(saved);
    }

    @PutMapping("/{id}/estado")
    public EntityModel<Orden> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden " + id + " no existe"));
        orden.setEstado(datos.get("estado"));
        Orden saved = ordenRepository.save(orden);
        return toModel(saved);
    }

    private EntityModel<Orden> toModel(Orden orden) {
        EntityModel<Orden> model = EntityModel.of(orden);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrdenController.class).obtenerOrden(orden.getId())).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrdenController.class).listarOrdenes(null)).withRel("ordenes"));
        return model;
    }
}
