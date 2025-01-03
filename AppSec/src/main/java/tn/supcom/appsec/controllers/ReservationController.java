package tn.supcom.appsec.controllers;

import tn.supcom.appsec.entities.Reservation;
import tn.supcom.appsec.repositories.ReservationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.LocalDateTime;

@ApplicationScoped
public class ReservationController {

    @Inject
    private ReservationRepository reservationRepository;

    // Créer une nouvelle réservation avec un spot
    public Reservation createReservation(String clientId, String parkingId, String spotId, String carInfo, LocalDateTime startTime, int duration) {
        // Créer une nouvelle réservation sans définir explicitement l'ID
        Reservation reservation = new Reservation(clientId, parkingId, spotId, carInfo, startTime, duration);

        // Sauvegarder la réservation dans MongoDB (MongoDB va générer l'ID)
        return reservationRepository.save(reservation);
    }
}
