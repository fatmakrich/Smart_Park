package tn.supcom.appsec.repositories;

import tn.supcom.appsec.entities.Parking;
import jakarta.data.repository.Repository;
import jakarta.data.repository.CrudRepository;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.util.List;

@Repository
public interface ParkingRepository extends CrudRepository<Parking, String> {
    default List<Parking> findAllAsList() {
        return StreamSupport.stream(findAll().spliterator(), false).collect(Collectors.toList());
    }
}
