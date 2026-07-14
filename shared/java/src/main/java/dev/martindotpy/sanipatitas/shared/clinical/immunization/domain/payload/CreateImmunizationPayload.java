package dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.payload;

import java.time.LocalDateTime;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationRoute;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationStatus;

public interface CreateImmunizationPayload {
    @Nullable
    UUID getId();

    @Nullable
    String getVaccineCode();

    String getVaccineName();

    @Nullable
    String getManufacturer();

    @Nullable
    String getLotNumber();

    @Nullable
    LocalDateTime getExpirationDate();

    LocalDateTime getAdministrationDate();

    @Nullable
    String getDoseNumber();

    @Nullable
    String getDoseUnit();

    @Nullable
    ImmunizationRoute getRoute();

    @Nullable
    String getSite();

    @Nullable
    String getReaction();

    @Nullable
    ImmunizationStatus getStatus();

    UUID getPatientId();

    UUID getVeterinarianId();
}
