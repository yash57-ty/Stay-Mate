package org.example.backendi.service;

import org.example.backendi.model.User;
import org.example.backendi.model.dto.LoginRequest;
import org.example.backendi.model.dto.UserResponse;
import org.example.backendi.model.dto.SignupRequest;
import org.example.backendi.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public void signup(SignupRequest request) {
        System.out.println("Hello1");
        User existing = userRepository.findByPhone(request.phone());
        if (existing != null) {
            throw new RuntimeException("User already exists");
        }
        System.out.println(request.toString());
        User user = new User();
        user.setName(request.name());
        user.setGender(request.gender());
        user.setPhone(request.phone());
        user.setEmail(request.email());
        if(request.role()==true) {
            user.setRole("PGowner");
            System.out.println("hi");
        }
        else user.setRole("User");
        user.setPassword(request.password());

        userRepository.save(user);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.phone());
        if (user == null || !user.getPassword().equals(request.password())) {
            throw new RuntimeException("Invalid phone or password");
        }
        UserResponse userResponse=new UserResponse(user.getName(),user.getPhone(),user.getRole());
        return userResponse;
    }

    public void resetPassword(String phone, String newPassword) {
        User user = userRepository.findByPhone(phone);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (newPassword == null || newPassword.isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        user.setPassword(newPassword);
        userRepository.save(user);
    }
}