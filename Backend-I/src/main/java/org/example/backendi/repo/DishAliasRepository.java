package org.example.backendi.repo;

import org.example.backendi.model.DishAlias;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DishAliasRepository extends JpaRepository<DishAlias, Long> {

    Optional<DishAlias> findByAliasIgnoreCase(String alias);
}