package dev.martindotpy.sanipatitas.shared.patient.domain.payload;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.Gender;

public interface UpdatePatientPayload {
    String getName();

    @Nullable
    Gender getGender();

    @Nullable
    LocalDate getBirthDate();

    @Nullable
    String getApproximateAge();

    @Nullable
    BigDecimal getWeightKg();

    @Nullable
    String getDescription();

    @Nullable
    Boolean getIsSterilized();

    @Nullable
    Boolean getIsDeceased();

    @Nullable
    UUID getBreedId();

    UUID getClientId();
}
