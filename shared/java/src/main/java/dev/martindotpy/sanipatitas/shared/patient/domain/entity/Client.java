package dev.martindotpy.sanipatitas.shared.patient.domain.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.IdType;
import dev.martindotpy.sanipatitas.shared.core.domain.model.EntityWithUuidV7;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.PeruPhone;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.ValidDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ValidDocument
public class Client extends EntityWithUuidV7 {
    private UUID userId;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String lastName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IdType idType;

    @NotBlank
    @Size(min = 6, max = 20)
    @Column(nullable = false, unique = true)
    private String idNumber;

    @NotBlank
    @PeruPhone
    @Column(nullable = false, length = 15)
    private String phone;

    @PeruPhone
    @Column(length = 15)
    private String phoneAlt;

    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 500)
    private String address;

    @Size(max = 2000)
    private String notes;

    @Builder.Default
    @NotNull
    @Column(nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;
}
