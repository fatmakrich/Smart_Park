package tn.supcom.appsec.controllers;

import jakarta.ejb.EJBException;

import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;

import tn.supcom.appsec.entities.User;
import tn.supcom.appsec.repositories.UserRepository;
import tn.supcom.appsec.util.Argon2Utility;

@ApplicationScoped
public class UserManager {

    @Inject
    private UserRepository userRepository; // Repository to interact with the user database

    // Finds a user by email (mail)
    public User findByUsername(String mail) {
        return userRepository.findById(mail).orElseThrow(() ->
                new EJBException("User with mail: " + mail + " not found.") // Return user or throw exception if not found
        );
    }

    // Authenticate method for users (sign in)
    public User authenticate(final String mail, final String password) {
        User user = userRepository.findById(mail).orElseThrow(() ->
                new EJBException("Failed sign in with mail: " + mail + " [Unknown mail]") // If mail is not found
        );

        // Check if the password matches the stored password (hashed using Argon2)
        if (Argon2Utility.check(user.getPassword(), password.toCharArray())) {
            return user; // Authentication successful
        }

        // If the password is incorrect
        throw new EJBException("Failed sign in with mail: " + mail + " [Wrong password]");
    }
}
