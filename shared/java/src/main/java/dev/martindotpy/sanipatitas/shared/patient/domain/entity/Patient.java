package dev.martindotpy.sanipatitas.shared.patient.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.envers.Audited;
import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.breed.domain.entity.Breed;
import dev.martindotpy.sanipatitas.shared.client.domain.entity.Client;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.Gender;
import dev.martindotpy.sanipatitas.shared.core.domain.model.EntityWithUuidV7;
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
public class Patient extends EntityWithUuidV7 {
    @NotBlank
    @Size(max = 500)
    private String name;
    @Nullable
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;
    @Nullable
    private LocalDate birthDate;
    @Nullable
    @Size(max = 50)
    private String approximateAge;
    @Nullable
    @Digits(integer = 3, fraction = 2)
    @Column(precision = 5, scale = 2)
    private BigDecimal weightKg;
    @Nullable
    @Size(max = 2000)
    private String description;
    @Nullable
    private Boolean isSterilized;
    @Nullable
    private Boolean isDeceased;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;
    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    @Nullable
    @ManyToOne
    private Breed breed;
    @NotNull
    @ManyToOne
    private Client client;
}
