package Cerveceria.Taberna.repository;

import Cerveceria.Taberna.model.Comuna;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComunaRepository extends JpaRepository<Comuna, Long> {
    boolean existsByNombreAndRegionId(String nombre, Long regionId);

    List<Comuna> findByRegionIdOrderByIdAsc(Long regionId);

    List<Comuna> findAllByOrderByIdAsc();
}
