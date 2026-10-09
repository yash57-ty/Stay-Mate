package org.example.backendi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backendi.model.Dish;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class DishImageServiceImpl implements DishImageService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${serper.api.key}")
    private String serperApiKey;

    public DishImageServiceImpl(
            ObjectMapper objectMapper) {

        this.objectMapper = objectMapper;

        this.restClient = RestClient.builder()
                .baseUrl("https://google.serper.dev")
                .build();
    }

    @Override
    public void assignImage(Dish dish) {

        if (dish.getImageUrl() != null &&
                !dish.getImageUrl().isBlank()) {

            System.out.println(
                    "Image already exists for: "
                            + dish.getCanonicalName()
            );

            return;
        }

        String dishName =
                dish.getCanonicalName().trim();

        System.out.println(
                "Searching image for: "
                        + dishName
        );

        try {

            // ==================================================
            // 2. SEARCH QUERY
            // ==================================================

            String query =
                    "\"" + dishName + "\" Indian food";

            System.out.println(
                    "Search query: "
                            + query
            );

            // ==================================================
            // 3. REQUEST BODY
            // ==================================================

            Map<String, Object> request =
                    new HashMap<>();

            request.put("q", query);

            // Get several results so later we can
            // improve image selection.
            request.put("num", 5);

            // India
            request.put("gl", "in");

            // English
            request.put("hl", "en");

            // ==================================================
            // 4. CALL SERPER IMAGE API
            // ==================================================

            System.out.println(
                    "Calling Serper image search..."
            );

            String response =
                    restClient.post()
                            .uri("/images")
                            .header(
                                    "X-API-KEY",
                                    serperApiKey
                            )
                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )
                            .body(request)
                            .retrieve()
                            .body(String.class);

            // ==================================================
            // 5. CHECK RESPONSE
            // ==================================================

            if (response == null ||
                    response.isBlank()) {

                throw new RuntimeException(
                        "Empty response from Serper"
                );
            }

            System.out.println(
                    "Serper response received"
            );

            // ==================================================
            // 6. PARSE JSON
            // ==================================================

            JsonNode root =
                    objectMapper.readTree(response);

            JsonNode images =
                    root.path("images");

            if (!images.isArray()
                    || images.isEmpty()) {

                throw new RuntimeException(
                        "No images found for: "
                                + dishName
                );
            }

            System.out.println(
                    "Images found: "
                            + images.size()
            );

            // ==================================================
            // 7. FIND FIRST VALID IMAGE
            // ==================================================

            String imageUrl = null;

            for (JsonNode image : images) {

                String candidate =
                        image.path("imageUrl")
                                .asText(null);

                if (candidate != null &&
                        !candidate.isBlank()) {

                    imageUrl = candidate;

                    System.out.println(
                            "Candidate image found: "
                                    + candidate
                    );

                    break;
                }
            }

            // ==================================================
            // 8. VALIDATE IMAGE URL
            // ==================================================

            if (imageUrl == null ||
                    imageUrl.isBlank()) {

                throw new RuntimeException(
                        "No valid image URL found for: "
                                + dishName
                );
            }

            // ==================================================
            // 9. SAVE IMAGE URL
            // ==================================================

            dish.setImageUrl(imageUrl);

            dish.setImageSource(
                    "SERPER_IMAGE_SEARCH"
            );

            System.out.println(
                    "Image found successfully!"
            );

            System.out.println(
                    "Dish: "
                            + dishName
            );

            System.out.println(
                    "Image URL: "
                            + imageUrl
            );

        } catch (Exception e) {

            // ==================================================
            // 10. ERROR HANDLING
            // ==================================================

            System.out.println(
                    "Image search failed for: "
                            + dishName
            );

            System.out.println(
                    "Error type: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "Error message: "
                            + e.getMessage()
            );

            throw new RuntimeException(
                    "Failed to search image for "
                            + dishName,
                    e
            );
        }
    }
}