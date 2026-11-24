package Cerveceria.Taberna.controller;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Salud", description = "Endpoints de verificación de estado del servicio")
public class SaludController {

    @Operation(
        summary = "Health check",
        description = "Verifica que el servicio esté operativo",
        responses = {
            @ApiResponse(responseCode = "200", description = "Servicio saludable")
        }
    )
    @GetMapping("/health")
    public EntityModel<Map<String, String>> health() {
        Map<String, String> body = new HashMap<>();
        body.put("estado", "ok");
        body.put("servicio", "La Taberna de Snorlax");
        body.put("version", "1.0.0");

        EntityModel<Map<String, String>> model = EntityModel.of(body);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(SaludController.class).health()).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductoController.class).listarProductos(null, null)).withRel("productos"));
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(AuthController.class).esAdmin()).withRel("auth-status"));

        return model;
    }
}
