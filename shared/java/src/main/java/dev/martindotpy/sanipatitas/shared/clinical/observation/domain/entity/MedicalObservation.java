package dev.martindotpy.sanipatitas.shared.clinical.observation.domain.entity;

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

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ObservationCategory;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ObservationStatus;
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
public class MedicalObservation extends EntityWithUuidV7 {
    @Nullable
    @Size(max = 255)
    private String code;

    @NotBlank
    @Size(max = 2000)
    private String value;

    @Nullable
    @Size(max = 100)
    private String unit;

    @Nullable
    @Size(max = 255)
    private String interpretation;

    @Nullable
    @Size(max = 255)
    private String bodySite;

    @Nullable
    @Size(max = 255)
    private String method;

    @Nullable
    @Size(max = 500)
    private String referenceRange;

    @Nullable
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ObservationCategory category;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ObservationStatus status;

    @Nullable
    private OffsetDateTime issuedDate;

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