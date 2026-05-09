package org.example.backendi.service;

import org.example.backendi.model.PgStore;
import org.example.backendi.model.User;
import org.example.backendi.model.dto.pgRequest;
import org.example.backendi.repo.UserRepository;
import org.example.backendi.repo.pgRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PgService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    pgRepo pgRepo;

    public ResponseEntity<?> addpg(
            pgRequest pgRequest
    ) throws IOException {


        System.out.println(pgRequest.phone());

        User user =
                userRepository.findByPhone(
                        pgRequest.phone()
                );

        System.out.println(user);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }


        if (pgRequest.houseImages().length > 6) {

            return ResponseEntity
                    .badRequest()
                    .body("Maximum 6 images allowed");
        }

        String uploadDir =
                System.getProperty("user.dir")
                        + File.separator
                        + "uploads";

        File dir = new File(uploadDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }


        List<String> imageUrls =
                new ArrayList<>();

        for (MultipartFile img :
                pgRequest.houseImages()) {

            // image size validation
            if (img.getSize() >
                    1024 * 1024) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                img.getOriginalFilename()
                                        + " exceeds 1 MB"
                        );
            }

            String type =
                    img.getContentType();

            if (type == null ||
                    !type.startsWith("image/")) {

                return ResponseEntity
                        .badRequest()
                        .body("Only image files allowed");
            }

            String filename =
                    UUID.randomUUID()
                            + "_"
                            + img.getOriginalFilename();


            File destination =
                    new File(
                            dir.getAbsolutePath(),
                            filename
                    );

            img.transferTo(destination);

            imageUrls.add(
                    "/uploads/" + filename
            );
        }


        MultipartFile electricityBill =
                pgRequest.electricityBill();
        if (electricityBill.getSize()
                > 1024 * 1024) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "image exceeds 500 KB"
                    );
        }
        String type2=electricityBill.getContentType();
        if (type2 == null ||
                !type2.startsWith("image/")) {

            return ResponseEntity
                    .badRequest()
                    .body("Only image files allowed");
        }
        String billName =
                UUID.randomUUID()
                        + "_"
                        + electricityBill
                        .getOriginalFilename();

        File billDestination =
                new File(
                        dir.getAbsolutePath(),
                        billName
                );

        electricityBill.transferTo(
                billDestination
        );

        String billUrl =
                "/uploads/" + billName;


        PgStore pg = new PgStore();

        pg.setAddress(pgRequest.address());

        pg.setRent(pgRequest.rent());

        pg.setRentType(pgRequest.rentType());

        pg.setCapacity(pgRequest.capacity());

        pg.setCity(pgRequest.city());

        pg.setGender(pgRequest.gender());

        pg.setHouseUrls(imageUrls);

        pg.setElectricityBillUrls(billUrl);

        pg.setUser(user);
        pg.setStatus("pending");
        pgRepo.save(pg);

        return ResponseEntity.ok(
                "PG Uploaded Successfully"
        );
    }
}