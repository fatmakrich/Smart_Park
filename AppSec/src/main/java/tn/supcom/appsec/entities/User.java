package tn.supcom.appsec.entities;

import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;
import jakarta.json.bind.annotation.JsonbVisibility;
import tn.supcom.appsec.util.Identity;

import java.io.Serializable;
import java.util.Objects;

@Entity
@JsonbVisibility(FieldPropertyVisibilityStrategy.class)
public class User implements Serializable, Identity { // User entity for database

    @Id
    private String mail; //email address
    @Column
    private String userName;
    @Column
    private String password;

    // If you want to keep permissionLevel, you can add it here.
    // @Column
    // private Long permissionLevel;

    public User() {}

    public User(String mail, String userName, String password) {
        this.mail = mail;
        this.userName = userName;
        this.password = password;
    }

    public String getMail() {
        return mail;
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public int hashCode() {
        return Objects.hash(mail);
    }

    @Override
    public String getName() {
        return getMail();
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + mail + '\'' +
                ", userName='" + userName + '\'' +
                '}';
    }
}
