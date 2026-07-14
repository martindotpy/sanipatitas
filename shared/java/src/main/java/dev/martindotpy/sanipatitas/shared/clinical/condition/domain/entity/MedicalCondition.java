package dev.martindotpy.sanipatitas.shared.clinical.condition.domain.entity;

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

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionSeverity;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionStatus;
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
public class MedicalCondition extends EntityWithUuidV7 {
    @NotBlank
    @Size(max = 255)
    private String name;

    @Nullable
    @Size(max = 20)
    private String code;

    @Nullable
    @Size(max = 2000)
    private String description;

    @Nullable
    private OffsetDateTime onsetDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ConditionStatus status;

    @Nullable
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ConditionSeverity severity;

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
