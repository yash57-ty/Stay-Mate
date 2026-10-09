package org.example.backendi.repo;

import org.example.backendi.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DishRepository extends JpaRepository<Dish, Long> {

    Optional<Dish> findByCanonicalNameIgnoreCase(String canonicalName);
}