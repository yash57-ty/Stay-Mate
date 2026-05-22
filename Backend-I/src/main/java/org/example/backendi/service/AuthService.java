package org.example.backendi.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.backendi.model.User;
import org.example.backendi.model.dto.LoginRequest;
import org.example.backendi.model.dto.UserResponse;
import org.example.backendi.model.dto.SignupRequest;
import org.example.backendi.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    public void signup(SignupRequest request) {
        System.out.println("Hello1");
        User existing = userRepository.findByPhone(request.phone());
        if (existing != null) {
            throw new RuntimeException("User already exists");
        }
        User user = new User();
        user.setName(request.name());
        user.setGender(request.gender());
        user.setPhone(request.phone());
        user.setEmail(request.email());
        if(request.role()==true) {
            user.setRole("ROLE_PGOWNER");
            System.out.println("hi");
        }
        else user.setRole("ROLE_USER");
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);
    }

    public UserResponse login(
            LoginRequest request,
            HttpServletRequest httpRequest
    ) {

        Authentication authentication =
                authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(
                                request.phone(),
                                request.password()
                        )
                );

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);

        HttpSession session =
                httpRequest.getSession(true);

        session.setAttribute(
                HttpSessionSecurityContextRepository
                        .SPRING_SECURITY_CONTEXT_KEY,
                context
        );

        User user =
                userRepository.findByPhone(
                        request.phone()
                );

        return new UserResponse(
                user.getName(),
                user.getPhone(),
                user.getRole(),
                user.getGender()
        );
    }

    public void resetPassword(String phone, String newPassword) {
        User user = userRepository.findByPhone(phone);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (newPassword == null || newPassword.isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}