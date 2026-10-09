package org.example.backendi.service;

import org.example.backendi.model.Dish;
import org.example.backendi.model.DishAlias;
import org.example.backendi.model.ImageStatus;
import org.example.backendi.model.dto.ExtractedDish;
import org.example.backendi.repo.DishAliasRepository;
import org.example.backendi.repo.DishRepository;
import org.springframework.stereotype.Service;

@Service
public class DishResolverService {

    private final DishRepository dishRepository;
    private final DishAliasRepository dishAliasRepository;
    private final ImageProcessingService imageProcessingService;

    public DishResolverService(
            DishRepository dishRepository,
            DishAliasRepository dishAliasRepository,
            ImageProcessingService imageProcessingService) {

        this.dishRepository = dishRepository;
        this.dishAliasRepository = dishAliasRepository;
        this.imageProcessingService = imageProcessingService;
    }

    public Dish resolveDish(ExtractedDish extractedDish) {

        String canonicalName =
                extractedDish.canonicalName().trim();

        var existingDish =
                dishRepository.findByCanonicalNameIgnoreCase(canonicalName);

        if (existingDish.isPresent()) {

            Dish dish = existingDish.get();

            // If image already exists, nothing to process
            if (dish.getImageUrl() != null &&
                    !dish.getImageUrl().isBlank()) {

                return dish;
            }

            // Queue image processing in background
            imageProcessingService.processImage(dish.getId());

            return dish;
        }

        String rawName =
                extractedDish.rawName().trim();

        var existingAlias =
                dishAliasRepository.findByAliasIgnoreCase(rawName);

        if (existingAlias.isPresent()) {

            Dish dish = existingAlias.get().getDish();

            if (dish.getImageUrl() != null &&
                    !dish.getImageUrl().isBlank()) {

                return dish;
            }

            // Queue image processing
            imageProcessingService.processImage(dish.getId());

            return dish;
        }
        Dish dish = new Dish();
        dish.setCanonicalName(canonicalName);
        dish.setGujaratiName(extractedDish.gujaratiName());
        dish.setCategory(extractedDish.category());

        dish.setImageStatus(ImageStatus.PENDING);

        dish = dishRepository.save(dish);

        if (!rawName.equalsIgnoreCase(canonicalName)) {

            DishAlias alias = new DishAlias();

            alias.setAlias(rawName);
            alias.setDish(dish);

            dishAliasRepository.save(alias);
        }

        imageProcessingService.processImage(dish.getId());

        return dish;
    }
}