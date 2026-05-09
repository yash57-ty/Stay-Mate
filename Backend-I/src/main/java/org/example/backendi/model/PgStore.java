package org.example.backendi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PgStore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String address;
    int rent;
    String rentType;
    String capacity;
    String city;
    String gender;
    @ElementCollection
    List<String> houseUrls;
    String electricityBillUrls;
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    User user;
    String status;
}
