package org.example.backendi.service;

import org.example.backendi.model.Dish;
import org.example.backendi.model.MenuItem;
import org.example.backendi.model.MenuStore;
import org.example.backendi.model.dto.ExtractedMenu;
import org.example.backendi.repo.MenuItemRepository;
import org.springframework.stereotype.Service;

@Service
public class MenuProcessingService {

    private final DishResolverService dishResolverService;
    private final MenuItemRepository menuItemRepository;

    public MenuProcessingService(
            DishResolverService dishResolverService,
            MenuItemRepository menuItemRepository) {

        this.dishResolverService = dishResolverService;
        this.menuItemRepository = menuItemRepository;
    }

    public void processMenu(
            MenuStore menuStore,
            ExtractedMenu extractedMenu) {

        int order = 1;

        for (var extractedDish : extractedMenu.items()) {

            Dish dish =
                    dishResolverService.resolveDish(extractedDish);

            boolean exists =
                    menuItemRepository
                            .existsByMenuStoreIdAndDishId(
                                    menuStore.getId(),
                                    dish.getId()
                            );

            if (!exists) {

                MenuItem menuItem = new MenuItem();

                menuItem.setMenuStore(menuStore);
                menuItem.setDish(dish);
                menuItem.setDisplayOrder(order);

                menuItemRepository.save(menuItem);
            }

            order++;
        }
    }
}