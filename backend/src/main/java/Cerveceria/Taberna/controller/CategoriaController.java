package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.model.Categoria;
import Cerveceria.Taberna.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
@Tag(name = "Categorías", description = "Categorías de productos de la taberna")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Si el front pide el catálogo, entonces devolvemos todas las categorías
    // con sus links HATEOAS para navegar al detalle y de vuelta al listado.
    @Operation(
        summary = "Listar categorías",
        description = "Obtiene todas las categorías de productos",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de categorías obtenida exitosamente")
        }
    )
    @GetMapping
    public CollectionModel<EntityModel<Categoria>> listarCategorias() {
        List<Categoria> categorias = categoriaRepository.findAll();

        List<EntityModel<Categoria>> categoriaModels = categorias.stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(categoriaModels,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(CategoriaController.class).listarCategorias()).withSelfRel());
    }

    @Operation(
        summary = "Obtener categoría por ID",
        description = "Obtiene una categoría específica por su identificador",
        responses = {
            @ApiResponse(responseCode = "200", description = "Categoría encontrada"),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
        }
    )
    @GetMapping("/{id}")
    public EntityModel<Categoria> obtenerCategoria(@PathVariable Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría " + id + " no existe"));
        return toModel(categoria);
    }

    private EntityModel<Categoria> toModel(Categoria categoria) {
        EntityModel<Categoria> model = EntityModel.of(categoria);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(CategoriaController.class).obtenerCategoria(categoria.getId())).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(CategoriaController.class).listarCategorias()).withRel("categorias"));
        return model;
    }
}
