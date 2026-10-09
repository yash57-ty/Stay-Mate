package org.example.backendi.service;

import org.example.backendi.model.Dish;
import org.example.backendi.model.ImageStatus;
import org.example.backendi.repo.DishRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ImageProcessingService {

    private final DishRepository dishRepository;
    private final DishImageService dishImageService;

    public ImageProcessingService(
            DishRepository dishRepository,
            DishImageService dishImageService) {

        this.dishRepository = dishRepository;
        this.dishImageService = dishImageService;
    }

    @Async("imageTaskExecutor")
    public void processImage(Long dishId) {

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() ->
                        new RuntimeException("Dish not found: " + dishId));

        if (dish.getImageUrl() != null &&
                !dish.getImageUrl().isBlank()) {

            dish.setImageStatus(ImageStatus.COMPLETED);
            dishRepository.save(dish);

            return;
        }

        try {

            dish.setImageStatus(ImageStatus.PROCESSING);
            dishRepository.save(dish);

            System.out.println(
                    "Processing image for: "
                            + dish.getCanonicalName()
            );

            System.out.println(
                    "BEFORE image generation: "
                            + dish.getCanonicalName()
            );

            dishImageService.assignImage(dish);

            System.out.println(
                    "AFTER image generation: "
                            + dish.getCanonicalName()
            );

            if (dish.getImageUrl() != null &&
                    !dish.getImageUrl().isBlank()) {

                dish.setImageStatus(ImageStatus.COMPLETED);

            } else {

                dish.setImageStatus(ImageStatus.FAILED);
            }

            dishRepository.save(dish);

        } catch (Exception e) {

            System.out.println(
                    "Image processing failed for: "
                            + dish.getCanonicalName()
            );

            e.printStackTrace();

            dish.setImageStatus(ImageStatus.FAILED);
            dishRepository.save(dish);
        }
    }
}