package Cerveceria.Taberna.controller;

import Cerveceria.Taberna.model.Blog;
import Cerveceria.Taberna.repository.BlogRepository;
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
@RequestMapping("/api/blog")
@CrossOrigin(origins = "*")
@Tag(name = "Blog", description = "Artículos y publicaciones del blog de la taberna")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @Operation(
        summary = "Listar artículos del blog",
        description = "Obtiene todos los artículos publicados",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de artículos obtenida exitosamente")
        }
    )
    @GetMapping
    public CollectionModel<EntityModel<Blog>> listarBlog() {
        List<Blog> blogs = blogRepository.findAll();

        List<EntityModel<Blog>> blogModels = blogs.stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(blogModels,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(BlogController.class).listarBlog()).withSelfRel());
    }

    @Operation(
        summary = "Obtener artículo por ID",
        description = "Obtiene un artículo específico de blog por su identificador",
        responses = {
            @ApiResponse(responseCode = "200", description = "Artículo encontrado"),
            @ApiResponse(responseCode = "404", description = "Artículo no encontrado")
        }
    )
    @GetMapping("/{id}")
    public EntityModel<Blog> obtenerBlog(@PathVariable Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog " + id + " no existe"));
        return toModel(blog);
    }

    // Cada artículo viaja con sus links HATEOAS:
    // "self" para el detalle y "blog" para volver al listado completo.
    private EntityModel<Blog> toModel(Blog blog) {
        EntityModel<Blog> model = EntityModel.of(blog);
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(BlogController.class).obtenerBlog(blog.getId())).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(BlogController.class).listarBlog()).withRel("blog"));
        return model;
    }
}
