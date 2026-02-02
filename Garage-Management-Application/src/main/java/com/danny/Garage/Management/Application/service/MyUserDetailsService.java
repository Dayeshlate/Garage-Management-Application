package com.danny.Garage.Management.Application.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.danny.Garage.Management.Application.entity.User;
import com.danny.Garage.Management.Application.repository.UserRepository;

@Service  
public class MyUserDetailsService implements UserDetailsService { 
  
    private final UserRepository userRepository; 
    
    public MyUserDetailsService(UserRepository userRepository) { 
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return user;
    }

    
 
}
