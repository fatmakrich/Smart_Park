package tn.supcom.appsec.entities;

import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Reservation {

    @Id
    private String id;  // L'ID sera un UUID sous forme de chaîne

    @Column("clientId")
    private String clientId;

    @Column("parkingId")
    private String parkingId;

    @Column("spotId")
    private String spotId;

    @Column("carInfo")
    private String carInfo;

    @Column("startTime")
    private LocalDateTime startTime;

    @Column("duration")
    private int duration;

    @Column("endTime")
    private LocalDateTime endTime;

    // Constructeur sans arguments (nécessaire pour le mapping NoSQL)
    public Reservation() {
        // Générer un ID unique lors de la création de l'objet
        this.id = UUID.randomUUID().toString();  // Générer un UUID unique sous forme de chaîne
    }

    // Constructeur avec arguments
    public Reservation(String clientId, String parkingId, String spotId, String carInfo, LocalDateTime startTime, int duration) {
        this.clientId = clientId;
        this.parkingId = parkingId;
        this.spotId = spotId;
        this.carInfo = carInfo;
        this.startTime = startTime;
        this.duration = duration;
        this.endTime = startTime.plusHours(duration);  // Calcul automatique de endTime
        this.id = UUID.randomUUID().toString();  // Générer un UUID unique pour chaque réservation
    }

    // Getters et setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getParkingId() {
        return parkingId;
    }

    public void setParkingId(String parkingId) {
        this.parkingId = parkingId;
    }

    public String getSpotId() {
        return spotId;
    }

    public void setSpotId(String spotId) {
        this.spotId = spotId;
    }

    public String getCarInfo() {
        return carInfo;
    }

    public void setCarInfo(String carInfo) {
        this.carInfo = carInfo;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
        this.endTime = startTime.plusHours(duration);  // Recalculer endTime lors du changement de startTime
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
        this.endTime = startTime.plusHours(duration);  // Recalculer endTime lors du changement de durée
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }
}
