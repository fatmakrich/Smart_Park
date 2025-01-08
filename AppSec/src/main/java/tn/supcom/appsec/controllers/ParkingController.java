package tn.supcom.appsec.controllers;

import tn.supcom.appsec.entities.Parking;
import tn.supcom.appsec.repositories.ParkingRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.util.Comparator;
@ApplicationScoped
public class ParkingController {

    @Inject
    private ParkingRepository parkingRepository;

    // Créer un nouveau parking
    public Parking createParking(String parkingName, float latitude, float longitude, int numberSpots, String phoneNumber, String address, List<String> spotIds, List<String> availableSpotIds) {
        // Créer une nouvelle instance de Parking
        Parking parking = new Parking(parkingName, latitude, longitude, numberSpots, phoneNumber, address, spotIds, availableSpotIds);

        // Sauvegarder le parking dans MongoDB
        return parkingRepository.save(parking);
    }

    // Ajouter un parking (alias pour createParking)
    public Parking addParking(String parkingName, float latitude, float longitude, int numberSpots, String phoneNumber, String address, List<String> spotIds, List<String> availableSpotIds) {
        return createParking(parkingName, latitude, longitude, numberSpots, phoneNumber, address, spotIds, availableSpotIds);
    }

    // Récupérer les détails d'un parking par son ID
    public Parking getParkingById(String id) {
        Optional<Parking> parking = parkingRepository.findById(id);
        return parking.orElse(null); // Retourner null si le parking n'est pas trouvé
    }

    // Récupérer la liste de tous les parkings
    public List<Parking> getAllParkings() {
        return StreamSupport.stream(parkingRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    // Supprimer un parking par son ID
    public boolean deleteParking(String id) {
        Optional<Parking> parking = parkingRepository.findById(id);
        if (parking.isPresent()) {
            parkingRepository.delete(parking.get());
            return true; // Suppression réussie
        }
        return false; // Aucun parking trouvé avec cet ID
    }



    public List<Parking> getNearestAvailableParkings(double userLat, double userLon, int limit) {
        List<Parking> allParkings = getAllParkings();

        // Filtrer les parkings avec des places disponibles
        List<Parking> availableParkings = allParkings.stream()
                .filter(parking -> parking.getAvailableSpotIds() != null && !parking.getAvailableSpotIds().isEmpty())
                .collect(Collectors.toList());

        // Trier par distance
        return availableParkings.stream()
                .sorted(Comparator.comparingDouble(parking -> calculateDistance(userLat, userLon, parking.getLatitude(), parking.getLongitude())))
                .limit(limit)
                .collect(Collectors.toList());
    }

    // Fonction utilitaire pour calculer la distance entre deux points géographiques
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Rayon de la Terre en km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance en km
    }

}
