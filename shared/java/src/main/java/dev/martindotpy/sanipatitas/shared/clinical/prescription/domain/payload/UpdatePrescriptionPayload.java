package dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.PrescriptionStatus;

public interface UpdatePrescriptionPayload {
    OffsetDateTime getIssueDate();

    @Nullable
    OffsetDateTime getExpirationDate();

    @Nullable
    String getNotes();

    @Nullable
    PrescriptionStatus getStatus();

    UUID getPatientId();

    UUID getVeterinarianId();

    List<? extends UpdatePrescriptionItemPayload> getItems();
}
