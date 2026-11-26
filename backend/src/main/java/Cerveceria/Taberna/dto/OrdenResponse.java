package Cerveceria.Taberna.dto;

import java.util.List;

public class OrdenResponse {

    private Long id;
    private String nroOrden;
    private Integer subtotal;
    private Integer descuento;
    private Integer total;
    private String estado;
    private List<OrdenItemResponse> items;

    public OrdenResponse() {}

    public OrdenResponse(Long id, String nroOrden, Integer subtotal, Integer descuento,
                         Integer total, String estado, List<OrdenItemResponse> items) {
        this.id = id;
        this.nroOrden = nroOrden;
        this.subtotal = subtotal;
        this.descuento = descuento;
        this.total = total;
        this.estado = estado;
        this.items = items;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNroOrden() { return nroOrden; }
    public void setNroOrden(String nroOrden) { this.nroOrden = nroOrden; }

    public Integer getSubtotal() { return subtotal; }
    public void setSubtotal(Integer subtotal) { this.subtotal = subtotal; }

    public Integer getDescuento() { return descuento; }
    public void setDescuento(Integer descuento) { this.descuento = descuento; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<OrdenItemResponse> getItems() { return items; }
    public void setItems(List<OrdenItemResponse> items) { this.items = items; }
}
