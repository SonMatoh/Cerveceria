package Cerveceria.Taberna.dto;

import java.util.List;

public class OrdenRequest {

    private Long usuarioId;
    private Integer subtotal;
    private Integer descuento;
    private Integer total;
    private String estado;
    private String metodoPago;
    private String entrega;
    private String calle;
    private String numero;
    private String complemento;
    private String comuna;
    private String region;
    private List<OrdenItemRequest> items;

    public OrdenRequest() {}

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Integer getSubtotal() { return subtotal; }
    public void setSubtotal(Integer subtotal) { this.subtotal = subtotal; }

    public Integer getDescuento() { return descuento; }
    public void setDescuento(Integer descuento) { this.descuento = descuento; }

    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public String getEntrega() { return entrega; }
    public void setEntrega(String entrega) { this.entrega = entrega; }

    public String getCalle() { return calle; }
    public void setCalle(String calle) { this.calle = calle; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public List<OrdenItemRequest> getItems() { return items; }
    public void setItems(List<OrdenItemRequest> items) { this.items = items; }
}
