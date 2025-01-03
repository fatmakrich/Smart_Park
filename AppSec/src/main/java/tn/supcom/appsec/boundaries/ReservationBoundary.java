package tn.supcom.appsec.boundaries;

import tn.supcom.appsec.controllers.ReservationController;
import tn.supcom.appsec.entities.Reservation;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
@Path("/reservations")
public class ReservationBoundary {

    @Inject
    private ReservationController reservationController;

    /**
     * Endpoint to add a new reservation.
     */
    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @Path("/add")
    public Response addReservation(Reservation reservation) {
        try {
            Reservation createdReservation = reservationController.createReservation(
                    reservation.getClientId(),
                    reservation.getParkingId(),
                    reservation.getSpotId(),
                    reservation.getCarInfo(),
                    reservation.getStartTime(),
                    reservation.getDuration()
            );
            return Response.status(Response.Status.CREATED).entity(createdReservation).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating reservation: " + e.getMessage()).build();
        }
    }
}
