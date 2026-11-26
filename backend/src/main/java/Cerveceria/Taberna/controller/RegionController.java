package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.dto.RegionDTO;
import Cerveceria.Taberna.model.Region;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/regiones")
@CrossOrigin(origins = "*")
public class RegionController {

    @Autowired
    private RegionRepository regionRepository;

    @GetMapping
    public List<RegionDTO> listar() {
        return regionRepository.findAllByOrderByIdAsc().stream()
                .map(RegionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public RegionDTO crear(@RequestBody RegionDTO datos) {
        if (datos.getNombre() == null || datos.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre de la región es obligatorio");
        }
        if (regionRepository.existsByNombre(datos.getNombre().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La región ya existe");
        }
        Region region = new Region();
        region.setNombre(datos.getNombre().trim());
        Region saved = regionRepository.save(region);
        return RegionDTO.fromEntity(saved);
    }
}
