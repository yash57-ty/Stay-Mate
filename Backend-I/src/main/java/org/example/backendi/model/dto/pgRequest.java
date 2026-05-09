package org.example.backendi.model.dto;

import org.springframework.web.multipart.MultipartFile;

public record pgRequest(
        String address,
        int rent,
        String rentType,
        String capacity,
        String city,
        String gender,
        String phone,
        MultipartFile[] houseImages,
        MultipartFile electricityBill
        )
{}
