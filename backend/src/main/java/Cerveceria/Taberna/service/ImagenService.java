package Cerveceria.Taberna.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@Service
public class ImagenService {

    @Value("${imgbb.api.key:}")
    private String apiKey;

    @Value("${imgbb.api.url:}")
    private String apiUrl;

    private final RestClient restClient = RestClient.create();

    /**
     * Sube un archivo a ImgBB y devuelve la URL pública de la imagen.
     */
    public String subirImagen(MultipartFile archivo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("No se envió ningún archivo");
        }

        byte[] bytes = archivo.getBytes();
        String base64 = Base64.getEncoder().encodeToString(bytes);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("key", apiKey);
        form.add("image", base64);
        form.add("name", archivo.getOriginalFilename());

        Map<String, Object> respuesta = restClient.post()
                .uri(apiUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(Map.class);

        if (respuesta == null) {
            throw new IOException("ImgBB no devolvió respuesta");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) respuesta.get("data");
        if (data == null) {
            throw new IOException("ImgBB devolvió error: " + respuesta);
        }

        String url = (String) data.get("url");
        if (url == null || url.isBlank()) {
            throw new IOException("ImgBB no devolvió URL de imagen");
        }

        return url;
    }
}
