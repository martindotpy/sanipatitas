package dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.PrescriptionStatus;

public interface UpdatePrescriptionPayload {
    LocalDateTime getIssueDate();

    @Nullable
    LocalDateTime getExpirationDate();

    @Nullable
    String getNotes();

    @Nullable
    PrescriptionStatus getStatus();

    UUID getPatientId();

    UUID getVeterinarianId();

    List<? extends UpdatePrescriptionItemPayload> getItems();
}
