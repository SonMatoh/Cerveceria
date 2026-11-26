package Cerveceria.Taberna.dto;

import Cerveceria.Taberna.model.Region;

public class RegionDTO {

    private Long id;
    private String nombre;

    public RegionDTO() {}

    public RegionDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public static RegionDTO fromEntity(Region region) {
        return new RegionDTO(region.getId(), region.getNombre());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
