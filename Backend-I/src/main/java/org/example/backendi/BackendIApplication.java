package org.example.backendi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class BackendIApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendIApplication.class, args);
    }
}
