package dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.entity;

import static jakarta.persistence.CascadeType.ALL;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.envers.Audited;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.PrescriptionStatus;
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
public class Prescription extends EntityWithUuidV7 {
    @NotNull
    @Column(nullable = false)
    private LocalDateTime issueDate;

    @Nullable
    private LocalDateTime expirationDate;

    @Nullable
    @Column(length = 2000)
    private String notes;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PrescriptionStatus status;

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

    @OneToMany(mappedBy = "prescription", cascade = ALL, orphanRemoval = true)
    private List<PrescriptionItem> items;
}
