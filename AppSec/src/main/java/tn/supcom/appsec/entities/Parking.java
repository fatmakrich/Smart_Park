package tn.supcom.appsec.entities;

import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;
import java.util.List;
import java.util.UUID;

@Entity
public class Parking {

    @Id
    private String parkingId;

    @Column
    private String parkingName;

    @Column
    private float latitude;

    @Column
    private float longitude;

    @Column
    private int numberSpots;

    @Column
    private String phoneNumber;

    @Column
    private String address; // Peut être calculée à partir de latitude/longitude

    @Column
    private List<String> spotIds; // Liste des IDs des spots dans ce parking

    @Column
    private List<String> availableSpotIds; // Liste des IDs des spots disponibles

    // Constructeur sans arguments (requis par le framework)
    public Parking() {
        this.parkingId = UUID.randomUUID().toString();
    }

    // Constructeur avec arguments
    public Parking(String parkingName, float latitude, float longitude, int numberSpots,
                   String phoneNumber, String address, List<String> spotIds, List<String> availableSpotIds) {
        this.parkingId = UUID.randomUUID().toString();
        this.parkingName = parkingName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.numberSpots = numberSpots;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.spotIds = spotIds;
        this.availableSpotIds = availableSpotIds;
    }

    // Getters et setters
    public String getParkingId() {
        return parkingId;
    }

    public void setParkingId(String parkingId) {
        this.parkingId = parkingId;
    }

    public String getParkingName() {
        return parkingName;
    }

    public void setParkingName(String parkingName) {
        this.parkingName = parkingName;
    }

    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }

    public int getNumberSpots() {
        return numberSpots;
    }

    public void setNumberSpots(int numberSpots) {
        this.numberSpots = numberSpots;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getSpotIds() {
        return spotIds;
    }

    public void setSpotIds(List<String> spotIds) {
        this.spotIds = spotIds;
    }

    public List<String> getAvailableSpotIds() {
        return availableSpotIds;
    }

    public void setAvailableSpotIds(List<String> availableSpotIds) {
        this.availableSpotIds = availableSpotIds;
    }
}
