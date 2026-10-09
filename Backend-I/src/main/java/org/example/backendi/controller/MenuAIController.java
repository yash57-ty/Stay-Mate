package org.example.backendi.controller;

import org.example.backendi.model.Dish;
import org.example.backendi.model.ImageStatus;
import org.example.backendi.model.MenuItem;
import org.example.backendi.model.MenuStore;
import org.example.backendi.model.dto.DishMenuResponse;
import org.example.backendi.model.dto.ExtractedMenu;
import org.example.backendi.model.dto.MenuAIRequest;
import org.example.backendi.model.dto.MenuDishResponse;
import org.example.backendi.repo.DishRepository;
import org.example.backendi.repo.MenuItemRepository;
import org.example.backendi.repo.MenuStoreRepository;
import org.example.backendi.service.DishResolverService;
import org.example.backendi.service.GeminiMenuService;
import org.example.backendi.service.ImageProcessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-menu")
public class MenuAIController {

    private final GeminiMenuService geminiMenuService;
    private final DishResolverService dishResolverService;
    private final DishRepository dishRepository;
    private final ImageProcessingService imageProcessingService;
    private final MenuItemRepository menuItemRepository;
    private final MenuStoreRepository menuStoreRepository;

    public MenuAIController(
            GeminiMenuService geminiMenuService,
            DishResolverService dishResolverService,
            DishRepository dishRepository,
            ImageProcessingService imageProcessingService,
            MenuItemRepository menuItemRepository,
            MenuStoreRepository menuStoreRepository) {

        this.geminiMenuService = geminiMenuService;
        this.dishResolverService = dishResolverService;
        this.dishRepository = dishRepository;
        this.imageProcessingService = imageProcessingService;
        this.menuItemRepository = menuItemRepository;
        this.menuStoreRepository = menuStoreRepository;
    }

    @PostMapping("/process/{menuStoreId}")
    public ResponseEntity<List<DishMenuResponse>> processMenu(
            @PathVariable Long menuStoreId) {

        // 1. Find the existing menu
        MenuStore menuStore =
                menuStoreRepository.findById(menuStoreId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "MenuStore not found: " + menuStoreId
                                ));

        // 2. Get menu text directly from MenuStore
        String menuText = menuStore.getMenu();

        // 3. Gemini extracts individual dishes
        ExtractedMenu extractedMenu =
                geminiMenuService.extractMenu(menuText);

        int displayOrder = 1;

        // 4. Resolve each dish and associate it with this menu
        for (var extractedDish : extractedMenu.items()) {

            Dish dish =
                    dishResolverService.resolveDish(extractedDish);

            // Prevent duplicate dish in the same menu
            boolean exists =
                    menuItemRepository.existsByMenuStoreIdAndDishId(
                            menuStore.getId(),
                            dish.getId()
                    );

            if (!exists) {

                MenuItem menuItem = new MenuItem();

                menuItem.setMenuStore(menuStore);
                menuItem.setDish(dish);
                menuItem.setDisplayOrder(displayOrder);

                menuItemRepository.save(menuItem);
            }

            displayOrder++;
        }

        // 5. Return dishes belonging to this menu
        List<DishMenuResponse> result =
                menuItemRepository
                        .findByMenuStoreIdOrderByDisplayOrderAsc(
                                menuStore.getId()
                        )
                        .stream()
                        .map(item -> {

                            Dish dish = item.getDish();

                            return new DishMenuResponse(
                                    dish.getId(),
                                    dish.getCanonicalName(),
                                    dish.getGujaratiName(),
                                    dish.getCategory(),
                                    dish.getImageUrl()
                            );
                        })
                        .toList();

        return ResponseEntity.ok(result);
    }

    @PostMapping("/test-image")
    public ResponseEntity<String> testImage(
            @RequestParam String dishName) {

        var existingDish =
                dishRepository.findByCanonicalNameIgnoreCase(dishName);

        if (existingDish.isPresent()) {

            Dish dish = existingDish.get();

            if (dish.getImageUrl() != null &&
                    !dish.getImageUrl().isBlank()) {

                return ResponseEntity.ok(
                        "Image already exists for: "
                                + dish.getCanonicalName()
                );
            }

            dish.setImageStatus(ImageStatus.PENDING);
            dishRepository.save(dish);

            imageProcessingService.processImage(dish.getId());

            return ResponseEntity.ok(
                    "Image processing started for existing dish: "
                            + dish.getCanonicalName()
            );
        }

        Dish dish = new Dish();

        dish.setCanonicalName(dishName);
        dish.setCategory("TEST");
        dish.setImageStatus(ImageStatus.PENDING);

        dish = dishRepository.save(dish);

        imageProcessingService.processImage(dish.getId());

        return ResponseEntity.ok(
                "Image processing started for new dish: "
                        + dish.getCanonicalName()
        );
    }

    @GetMapping("/menu/{menuStoreId}/dishes")
    public ResponseEntity<List<MenuDishResponse>> getMenuDishes(
            @PathVariable Long menuStoreId) {

        List<MenuDishResponse> result =
                menuItemRepository
                        .findByMenuStoreIdOrderByDisplayOrderAsc(
                                menuStoreId
                        )
                        .stream()
                        .map(item -> {

                            Dish dish = item.getDish();

                            return new MenuDishResponse(
                                    dish.getId(),
                                    dish.getCanonicalName(),
                                    dish.getGujaratiName(),
                                    dish.getCategory(),
                                    dish.getImageUrl(),
                                    dish.getImageStatus() != null
                                            ? dish.getImageStatus().name()
                                            : null,
                                    item.getDisplayOrder()
                            );
                        })
                        .toList();

        return ResponseEntity.ok(result);
    }
}