package Cerveceria.Taberna.repository;

import Cerveceria.Taberna.model.Orden;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findAllByOrderByIdDesc();
}
