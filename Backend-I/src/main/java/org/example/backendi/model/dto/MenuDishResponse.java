package org.example.backendi.model.dto;

public record MenuDishResponse(
        Long id,
        String name,
        String gujaratiName,
        String category,
        String imageUrl,
        String imageStatus,
        Integer displayOrder
) {}