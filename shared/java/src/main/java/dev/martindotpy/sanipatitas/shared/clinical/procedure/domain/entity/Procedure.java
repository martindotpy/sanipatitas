package dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.entity;

import java.time.LocalDateTime;

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

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureCategory;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureStatus;
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
public class Procedure extends EntityWithUuidV7 {
    @Nullable
    @Size(max = 20)
    private String code;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Nullable
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProcedureCategory category;

    @Nullable
    @Size(max = 2000)
    private String reason;

    @Nullable
    @Size(max = 2000)
    private String outcome;

    @Nullable
    @Size(max = 2000)
    private String complications;

    @Nullable
    private LocalDateTime performedDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProcedureStatus status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @NotNull
    @ManyToOne
    private Patient patient;

    @NotNull
    @ManyToOne
    private User veterinarian;
}
