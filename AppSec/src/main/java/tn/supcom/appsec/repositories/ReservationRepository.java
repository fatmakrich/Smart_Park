package tn.supcom.appsec.repositories;

import tn.supcom.appsec.entities.Reservation;
import jakarta.data.repository.Repository;
import jakarta.data.repository.CrudRepository;

@Repository
public interface ReservationRepository extends CrudRepository<Reservation, String> {
    // Ajouter des méthodes personnalisées si nécessaire
}
