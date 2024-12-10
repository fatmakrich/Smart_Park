package tn.supcom.appsec.boundaries;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import tn.supcom.appsec.util.Argon2Utility;
import tn.supcom.appsec.entities.User;
import tn.supcom.appsec.repositories.UserRepository;

import java.util.Optional;

@ApplicationScoped
@Path("user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SignUpEndpoint {

    @Inject
    private UserRepository repository;

    @POST // Post method that receives User credentials from sign up in JSON format and saves it in the database
    public Response save(User user) {
        // Check if the user already exists by mail (email as the unique identifier)
        Optional<User> existingUser = repository.findById(user.getMail());
        if (existingUser.isPresent()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\":\"User already exists!\"}")
                    .build();
        }

        // Hash the password before saving
        String password = user.getPassword();
        String passwordHash = Argon2Utility.hash(password.toCharArray()); // Hash the password tapped by the user before saving it in the database

        // Create a new User entity with the hashed password
        User userHash = new User(user.getMail(), user.getUserName(), passwordHash); // Create new User entity with the hashed password
        repository.save(userHash); // Save the data in MongoDB

        return Response.ok()
                .entity("{\"username created\": \"" + userHash.getUserName() + "\"}")
                .build();
    }
}
