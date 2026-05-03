package org.example.backendi.repo;

import org.example.backendi.model.Menu_session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenusessionRepo extends JpaRepository<Menu_session, Long> {
    Menu_session findByPhoneNo(String phoneNo);
}
