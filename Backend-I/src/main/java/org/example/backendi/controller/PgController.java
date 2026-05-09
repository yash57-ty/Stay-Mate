package org.example.backendi.controller;

import org.example.backendi.model.dto.RestaurantRequest;
import org.example.backendi.model.dto.pgRequest;
import org.example.backendi.service.PgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/pg")
public class PgController {


    @Autowired
    private PgService pgService;


    @PostMapping(
            value = "/add",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> addPgRequestController(@ModelAttribute pgRequest pgRequest) throws IOException {
       return ResponseEntity.ok(pgService.addpg(pgRequest));
    }
}
