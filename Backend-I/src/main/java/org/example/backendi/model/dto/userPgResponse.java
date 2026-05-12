package org.example.backendi.model.dto;

public record userPgResponse(
        Long Id,
        String address,
        String capacity,
        int rent,
        String rentType,
        String email,
        String phone,
        String []houseUrls
) {}
