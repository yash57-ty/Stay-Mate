package org.example.backendi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import org.example.backendi.model.dto.ExtractedMenu;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiMenuService {

    private final Client client;
    private final ObjectMapper objectMapper;

    @Value("${gemini.model}")
    private String model;

    public GeminiMenuService(
            @Value("${gemini.api.key}") String apiKey,
            ObjectMapper objectMapper) {

        this.client = Client.builder()
                .apiKey(apiKey)
                .build();

        this.objectMapper = objectMapper;
    }

    public ExtractedMenu extractMenu(String menuText) {

        String prompt = """
                You are a food menu extraction system for an Indian
                tiffin and restaurant application.

                Your job is to extract EVERY individual food item
                from the given menu.

                The menu may contain:

                - Gujarati
                - English
                - Hindi
                - Gujarati written in English letters
                - Mixed languages
                - Emojis
                - Numbering
                - Prices
                - Spelling mistakes

                IMPORTANT RULES:

                1. Extract every individual food item.

                2. Never invent a food item.

                3. Never combine different food items.

                4. If a menu contains multiple sabjis,
                   return every sabji separately.

                5. "Sabji", "Sweet Options", "Dinner Menu",
                   "Unlimited Thali", etc. are categories or
                   descriptions and are NOT individual dishes.

                6. Remove prices from dish names.

                7. Normalize spelling variations.

                8. Understand Gujarati transliteration.

                9. Preserve the original food name in rawName.

                10. canonicalName should be a normalized English
                    food name that can later be used to find
                    a specific food image.

                11. gujaratiName should contain the Gujarati name
                    when the input provides one.

                12. confidence must be between 0.0 and 1.0.

                13. If you are uncertain about a food item,
                    reduce its confidence instead of guessing.

                Use only these categories:

                SABJI
                DAL
                KADHI
                RICE
                ROTI
                BREAD
                SALAD
                SWEET
                SNACK
                DRINK
                MAIN_COURSE
                OTHER

                Examples:

                "દૂધી ચણા દાળ"
                -> "Dudhi Chana Dal"

                "અડદની દાળ"
                -> "Adad Ni Dal"

                "ડુંગરી બટાકા"
                -> "Dungari Bataka"

                "સેવ ટમેટા"
                -> "Sev Tameta"

                "રીંગણ નો ઓળો"
                -> "Ringan No Olo"

                Return ONLY valid JSON matching this structure:

                {
                  "meal": "DINNER",
                  "date": "2026-09-26",
                  "items": [
                    {
                      "rawName": "...",
                      "canonicalName": "...",
                      "gujaratiName": "...",
                      "category": "...",
                      "confidence": 0.95
                    }
                  ]
                }

                MENU:
                %s
                """.formatted(menuText);

        GenerateContentConfig config =
                GenerateContentConfig.builder()
                        .temperature(0.1f)
                        .responseMimeType("application/json")
                        .build();

        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        config
                );

        try {

            String json = response.text();

            return objectMapper.readValue(
                    json,
                    ExtractedMenu.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini menu response",
                    e
            );
        }
    }
}