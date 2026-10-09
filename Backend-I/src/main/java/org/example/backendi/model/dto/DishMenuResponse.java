package org.example.backendi.model.dto;

public record DishMenuResponse(
        Long id,
        String name,
        String gujaratiName,
        String category,
        String imageUrl
) {}