package dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.envers.Audited;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationRoute;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationStatus;
import dev.martindotpy.sanipatitas.shared.core.domain.model.EntityWithUuidV7;
import dev.martindotpy.sanipatitas.shared.patient.domain.entity.Patient;
import dev.martindotpy.sanipatitas.shared.user.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Entity
@Audited
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Immunization extends EntityWithUuidV7 {
    @Nullable
    @Size(max = 100)
    private String vaccineCode;

    @NotBlank
    @Size(max = 255)
    private String vaccineName;

    @Nullable
    @Size(max = 255)
    private String manufacturer;

    @Nullable
    @Size(max = 255)
    private String lotNumber;

    @Nullable
    private OffsetDateTime expirationDate;

    @NotNull
    @Column(nullable = false)
    private OffsetDateTime administrationDate;

    @Nullable
    @Size(max = 50)
    private String doseNumber;

    @Nullable
    @Size(max = 50)
    private String doseUnit;

    @Nullable
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ImmunizationRoute route;

    @Nullable
    @Size(max = 255)
    private String site;

    @Nullable
    @Size(max = 2000)
    private String reaction;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ImmunizationStatus status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    @NotNull
    @ManyToOne
    private Patient patient;

    @NotNull
    @ManyToOne
    private User veterinarian;
}
