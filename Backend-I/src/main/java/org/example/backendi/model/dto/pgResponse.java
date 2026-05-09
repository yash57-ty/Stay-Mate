package org.example.backendi.model.dto;

public record pgResponse(
        Long id,
        String phone,
        String Name,
        String address,
        String []imageUrls,
        int rent,
        String capacity,
        String rentType,
        String gender
) {}
