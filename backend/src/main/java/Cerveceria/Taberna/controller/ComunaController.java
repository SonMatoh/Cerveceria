package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.ComunaDTO;
import Cerveceria.Taberna.model.Comuna;
import Cerveceria.Taberna.model.Region;
import Cerveceria.Taberna.repository.ComunaRepository;
import Cerveceria.Taberna.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comunas")
@CrossOrigin(origins = "*")
@Tag(name = "Comunas", description = "Catálogo de comunas filtrables por región")
public class ComunaController {

    @Autowired
    private ComunaRepository comunaRepository;

    @Autowired
    private RegionRepository regionRepository;

    @Operation(summary = "Listar comunas", description = "Obtiene comunas, opcionalmente filtradas por región",
        responses = { @ApiResponse(responseCode = "200", description = "Lista de comunas") })
    @GetMapping
    public List<ComunaDTO> listar(@RequestParam(required = false) Long region) {
        List<Comuna> comunas;
        if (region != null) {
            comunas = comunaRepository.findByRegionIdOrderByIdAsc(region);
        } else {
            comunas = comunaRepository.findAllByOrderByIdAsc();
        }
        return comunas.stream()
                .map(ComunaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Operation(summary = "Crear comuna", description = "Agrega una comuna asociada a una región",
        responses = { @ApiResponse(responseCode = "201", description = "Comuna creada"),
                      @ApiResponse(responseCode = "409", description = "Ya existe en esa región") })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ComunaDTO crear(@RequestBody ComunaDTO datos) {
        if (datos.getNombre() == null || datos.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre de la comuna es obligatorio");
        }
        if (datos.getRegionId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El id de región es obligatorio");
        }
        Region region = regionRepository.findById(datos.getRegionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Región no encontrada"));
        if (comunaRepository.existsByNombreAndRegionId(datos.getNombre().trim(), region.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La comuna ya existe en esa región");
        }
        Comuna comuna = new Comuna();
        comuna.setNombre(datos.getNombre().trim());
        comuna.setRegion(region);
        Comuna saved = comunaRepository.save(comuna);
        return ComunaDTO.fromEntity(saved);
    }
}
