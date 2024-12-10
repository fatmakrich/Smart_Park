package tn.supcom.appsec.repositories;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import java.util.stream.Stream;
import tn.supcom.appsec.entities.User;

@Repository
public interface UserRepository extends CrudRepository<User, String> {

    // Find all users as a stream
    Stream<User> findAll();

    // Find users by their userName (updated from fullname to userName)
    Stream<User> findByUserNameIn(String userName);
}
