package org.example.backendi.model.dto;

public record ExtractedDish(
        String rawName,
        String canonicalName,
        String gujaratiName,
        String category,
        double confidence
) {}
