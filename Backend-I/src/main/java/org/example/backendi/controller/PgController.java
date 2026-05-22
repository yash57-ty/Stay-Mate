package org.example.backendi.controller;

import org.example.backendi.model.dto.RestaurantRequest;
import org.example.backendi.model.dto.pgRequest;
import org.example.backendi.service.AdminService;
import org.example.backendi.service.PgService;
import org.example.backendi.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/pg")
public class PgController {


    @Autowired
    private PgService pgService;

    @Autowired
    private AdminService adminService;


    @PostMapping(
            value = "/add",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> addPgRequestController(@ModelAttribute pgRequest pgRequest) throws IOException {
       return ResponseEntity.ok(pgService.addpg(pgRequest));
    }

    @GetMapping("/getPg")
    public ResponseEntity<?> getPgRequestController(@RequestParam String city,@RequestParam String gender) {
        return pgService.getpg(gender,city);
    }

    @GetMapping("/getPgCities")
    public ResponseEntity<List<String>> getAllPgCitiesController(){
        return adminService.getpgcities();
    }

    @GetMapping("/managePg")
    public ResponseEntity<?> getMangePgRequestController(
            Authentication authentication
    ) {

        String phone = authentication.getName();

        return pgService.getManagePg(phone);
    }

    @PutMapping("/updateCap/{Id}")
    public ResponseEntity<?> updatePgRequestController(@PathVariable Long Id,@RequestBody int capacity) {
        return pgService.updateCapacity(Id,capacity);
    }
}
