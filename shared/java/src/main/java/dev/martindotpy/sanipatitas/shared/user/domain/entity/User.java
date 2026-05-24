package dev.martindotpy.sanipatitas.shared.user.domain.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.model.EntityWithUuidV7;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"user\"")
public class User extends EntityWithUuidV7 {
    @NotBlank
    @Column(nullable = false)
    private String name;
    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;
    @NotNull
    @Column(nullable = false)
    private Boolean emailVerified;
    @Nullable
    private String image;
    @Nullable
    private String role;
    @Nullable
    private Boolean banned;
    @Nullable
    private String banReason;
    @Nullable
    private OffsetDateTime banExpires;
    @NotBlank
    @Column(nullable = false)
    private String lastName;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;
    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;
}
