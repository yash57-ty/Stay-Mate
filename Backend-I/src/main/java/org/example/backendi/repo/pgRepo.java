package org.example.backendi.repo;

import org.example.backendi.model.PgStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface pgRepo extends JpaRepository<PgStore,Long> {


    @Query("SELECT p FROM PgStore p WHERE p.city = :city")
    List<PgStore> findBycity(@Param("city") String city);

    List<PgStore> findByuserId(Long id);
}
