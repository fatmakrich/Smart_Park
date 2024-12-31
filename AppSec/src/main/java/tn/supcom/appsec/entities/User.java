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
    private String mail; // email address

    @Column
    private String userName;

    @Column
    private String password;

    @Column
    private Long permissionLevel;

    public User() {
    }

    public User(String mail, String userName, String password, Long permissionLevel) {
        this.mail = mail;
        this.userName = userName;
        this.password = password;
        this.permissionLevel = permissionLevel;
    }

    public String getMail() {  // Corrected getter method name
        return mail;
    }

    public String getUserName() {  // Corrected getter method name
        return userName;
    }

    public String getPassword() {  // Corrected getter method name
        return password;
    }

    public Long getPermissionLevel() {
        return permissionLevel;
    }

    public void setPermissionLevel(Long permissionLevel) {
        this.permissionLevel = permissionLevel;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(mail);
    }

    @Override
    public String getName() {
        return getMail();
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + mail + '\'' +
                ", fullname=" + userName +
                '}';
    }
}
