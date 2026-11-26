package Cerveceria.Taberna.repository;

import Cerveceria.Taberna.model.Region;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    boolean existsByNombre(String nombre);

    List<Region> findAllByOrderByIdAsc();
}
