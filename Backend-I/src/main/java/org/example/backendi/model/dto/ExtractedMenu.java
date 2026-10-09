package org.example.backendi.model.dto;

import java.util.List;

public record ExtractedMenu(
        String meal,
        String date,
        List<ExtractedDish> items
) {}
