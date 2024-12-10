package tn.supcom.appsec.boundaries;

import jakarta.inject.Inject;
import java.nio.charset.StandardCharsets;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.util.Base64;
import tn.supcom.appsec.controllers.UserManager;
import tn.supcom.appsec.util.Identity;
import org.json.JSONObject;
import jakarta.ejb.EJBException;
import java.net.URI;

@Path("/")
@RequestScoped
public class SignInEndpoint {
    private static final String COOKIE_NAME = "xssCookie";
    private static final String AUTHENTICATION_SCHEME_PREFIX = "Bearer ";

    @Inject
    private UserManager identityController;
    @Context
    private UriInfo uriInfo;
    @Context
    private HttpHeaders headers;

    // Utility method to get cookie value
    private String getCookieValue(String cookieName) {
        Cookie cookie = headers.getCookies().get(cookieName);
        return (cookie != null) ? cookie.getValue() : null;
    }

    @POST
    @Path("/authorize")
    @Produces(MediaType.APPLICATION_JSON)
    public Response preSignIn(@HeaderParam("Pre-Authorization") String authorization) {
        if (authorization == null || !authorization.startsWith(AUTHENTICATION_SCHEME_PREFIX)) {
            URI signinUri = uriInfo.getBaseUriBuilder()
                    .path("signin.html") // Redirect to the signin page
                    .build();
            return Response.seeOther(signinUri).build(); // HTTP 303 redirection to signin.html
        }

        try {
            // Decode the 'Pre-Authorization' header
            byte[] bytes = Base64.getDecoder()
                    .decode(authorization.substring(AUTHENTICATION_SCHEME_PREFIX.length()));
            String decoded = new String(bytes, StandardCharsets.UTF_8);
            String[] credentials = decoded.split("#");

            if (credentials.length != 2) {
                URI signinUri = uriInfo.getBaseUriBuilder()
                        .path("signin.html")
                        .build();
                return Response.seeOther(signinUri).build();
            }

            String clientId = credentials[0];
            String codeChallenge = credentials[1];

            // Set code challenge in cookie
            NewCookie codeChallengeCookie = new NewCookie(
                    COOKIE_NAME,           // Cookie name
                    Base64.getEncoder().encodeToString((clientId + "#" + codeChallenge).getBytes(StandardCharsets.UTF_8)), // Encode clientId#codeChallenge
                    "/",                   // Path (available across the app)
                    null,                  // Domain (default to server domain)
                    "Code Challenge Cookie", // Comment for the cookie
                    86400,                 // Cookie lifetime (1 day in seconds)
                    true,                  // Secure cookie (only sent over HTTPS)
                    true                   // HttpOnly (accessible only by the server)
            );

            return Response.ok("{\"message\":\"Code challenge set in cookie.\"}")
                    .cookie(codeChallengeCookie)
                    .build();
        } catch (IllegalArgumentException e) {
            URI signinUri = uriInfo.getBaseUriBuilder()
                    .path("signin.html")
                    .build();
            return Response.seeOther(signinUri).build();
        }
    }

    @POST
    @Path("/authenticate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response signIn(String json) {
        JSONObject obj = new JSONObject(json);
        String mail = obj.optString("mail", null);  // Use optString with a default value of null
        String password = obj.optString("password", null);

        // Validate mail and password
        if (mail == null || mail.isEmpty() || mail.length() < 4 || mail.length() > 30 || password == null || password.length() < 6) {
            return Response.status(Response.Status.NOT_ACCEPTABLE)
                    .entity("{\"message\":\"Invalid credentials.\"}")
                    .build();
        }

        try {
            // Authenticate the user
            Identity identity = identityController.authenticate(mail, password);

            // Retrieve the cookie value
            String cookieValue = getCookieValue(COOKIE_NAME);
            if (cookieValue == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"message\":\"Cookie missing or invalid.\"}")
                        .build();
            }

            // Decode the cookie value (Base64 encoded)
            String decodedCookie = new String(Base64.getDecoder().decode(cookieValue), StandardCharsets.UTF_8);
            String[] parts = decodedCookie.split("#");

            if (parts.length != 2) {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("{\"message\":\"Invalid cookie format.\"}")
                        .build();
            }

            String clientId = parts[0];
            String codeChallenge = parts[1];

            // Verify clientId and codeChallenge
            if (clientId == null || codeChallenge == null) {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("{\"message\":\"Client ID or Code Challenge missing.\"}")
                        .build();
            }

            // Create authorization code
            String authorizationCode = Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString((codeChallenge + ":" + clientId).getBytes(StandardCharsets.UTF_8));

            // Return authorization code
            return Response.ok("{\"authorization_code\":\"" + authorizationCode + "\"}")
                    .build();

        } catch (EJBException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"message\":\"Authentication failed.\"}")
                    .build();
        }
    }
}
