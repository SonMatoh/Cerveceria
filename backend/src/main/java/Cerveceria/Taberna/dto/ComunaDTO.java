package Cerveceria.Taberna.dto;

import Cerveceria.Taberna.model.Comuna;

public class ComunaDTO {

    private Long id;
    private String nombre;
    private Long regionId;

    public ComunaDTO() {}

    public ComunaDTO(Long id, String nombre, Long regionId) {
        this.id = id;
        this.nombre = nombre;
        this.regionId = regionId;
    }

    public static ComunaDTO fromEntity(Comuna comuna) {
        return new ComunaDTO(comuna.getId(), comuna.getNombre(), comuna.getRegion().getId());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }
}
