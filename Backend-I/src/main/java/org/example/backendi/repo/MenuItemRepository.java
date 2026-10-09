package org.example.backendi.repo;

import org.example.backendi.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository
        extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByMenuStoreIdOrderByDisplayOrderAsc(
            Long menuStoreId
    );

    boolean existsByMenuStoreIdAndDishId(
            Long menuStoreId,
            Long dishId
    );
}