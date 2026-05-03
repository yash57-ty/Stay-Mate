package org.example.backendi.model.dto;
public record orderRequest(
        String address,
        Long menuId,
        int quantity
) {}