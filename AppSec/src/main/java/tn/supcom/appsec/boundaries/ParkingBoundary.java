package tn.supcom.appsec.boundaries;

import tn.supcom.appsec.controllers.ParkingController;
import tn.supcom.appsec.entities.Parking;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped
@Path("/parkings")
public class ParkingBoundary {

    @Inject
    private ParkingController parkingController;

    /**
     * Endpoint to add a new parking.
     */
    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @Path("/add")
    public Response addParking(Parking parking) {
        try {
            Parking createdParking = parkingController.addParking(
                    parking.getParkingName(),
                    parking.getLatitude(),
                    parking.getLongitude(),
                    parking.getNumberSpots(),
                    parking.getPhoneNumber(),
                    parking.getAddress(),
                    parking.getSpotIds(),
                    parking.getAvailableSpotIds()
            );
            return Response.status(Response.Status.CREATED).entity(createdParking).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid parking data: " + e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating parking: " + e.getMessage()).build();
        }
    }

    /**
     * Endpoint to get a list of all parkings.
     */
    @GET
    @Produces("application/json")
    public Response getAllParkings() {
        try {
            List<Parking> parkings = parkingController.getAllParkings();
            if (parkings.isEmpty()) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }
            return Response.ok(parkings).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching parkings: " + e.getMessage()).build();
        }
    }

    /**
     * Endpoint to get parking details by ID.
     */
    @GET
    @Produces("application/json")
    @Path("/{id}")
    public Response getParkingById(@PathParam("id") String id) {
        try {
            Parking parking = parkingController.getParkingById(id);
            if (parking != null) {
                return Response.ok(parking).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Parking not found with ID: " + id).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid ID: " + e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching parking: " + e.getMessage()).build();
        }
    }

    /**
     * Endpoint to delete a parking by ID.
     */
    @DELETE
    @Path("/{id}")
    public Response deleteParking(@PathParam("id") String id) {
        try {
            boolean isDeleted = parkingController.deleteParking(id);
            if (isDeleted) {
                return Response.noContent().build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Parking not found with ID: " + id).build();
            }
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Invalid ID: " + e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error deleting parking: " + e.getMessage()).build();
        }
    }
    /**
     * Endpoint to get the nearest parkings with available spots.
     */
    @GET
    @Produces("application/json")
    @Path("/nearest")
    public Response getNearestAvailableParkings(@QueryParam("lat") double latitude,
                                                @QueryParam("lon") double longitude,
                                                @QueryParam("limit") @DefaultValue("5") int limit) {
        try {
            List<Parking> nearestParkings = parkingController.getNearestAvailableParkings(latitude, longitude, limit);
            if (nearestParkings.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("No nearby parking with available spots found.").build();
            }
            return Response.ok(nearestParkings).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching nearest parkings: " + e.getMessage()).build();
        }
    }

}
