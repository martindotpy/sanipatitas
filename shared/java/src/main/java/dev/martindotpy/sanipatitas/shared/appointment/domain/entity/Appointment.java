package dev.martindotpy.sanipatitas.shared.appointment.domain.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.envers.Audited;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.client.domain.entity.Client;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentClass;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.AppointmentStatus;
import dev.martindotpy.sanipatitas.shared.core.domain.model.EntityWithUuidV7;
import dev.martindotpy.sanipatitas.shared.patient.domain.entity.Patient;
import dev.martindotpy.sanipatitas.shared.user.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
public class Appointment extends EntityWithUuidV7 {
    @NotNull
    private LocalDate date;
    @NotNull
    private LocalTime startTime;
    @Nullable
    private LocalTime endTime;
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AppointmentStatus status;
    @Builder.Default
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "class", length = 20)
    private AppointmentClass appointmentClass = AppointmentClass.AMBULATORY;
    @Nullable
    @Size(max = 2000)
    private String reason;
    @Nullable
    @Size(max = 2000)
    private String notes;

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
    private Client client;
    @NotNull
    @ManyToOne
    private User veterinarian;
}
