package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.model.Orden;
import Cerveceria.Taberna.model.Usuario;
import Cerveceria.Taberna.repository.OrdenRepository;
import Cerveceria.Taberna.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "*")
public class OrdenController {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Orden> listarOrdenes(
            @RequestParam(required = false) Long usuarioId) {
        if (usuarioId != null) {
            return ordenRepository.findAll().stream()
                    .filter(o -> o.getUsuarioId().equals(usuarioId))
                    .toList();
        }
        return ordenRepository.findAll();
    }

    @GetMapping("/{id}")
    public Orden obtenerOrden(@PathVariable Long id) {
        return ordenRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden " + id + " no existe"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Orden crearOrden(@RequestBody Map<String, Object> datos) {
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

        return ordenRepository.save(orden);
    }

    @PutMapping("/{id}/estado")
    public Orden actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden " + id + " no existe"));
        orden.setEstado(datos.get("estado"));
        return ordenRepository.save(orden);
    }
}
