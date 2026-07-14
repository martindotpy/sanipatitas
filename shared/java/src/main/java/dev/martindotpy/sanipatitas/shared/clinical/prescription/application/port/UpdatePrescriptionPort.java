package dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto.PrescriptionDto;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.UpdatePrescriptionPayload;
import io.smallrye.mutiny.Uni;

public interface UpdatePrescriptionPort {
    Uni<PrescriptionDto> update(UUID id, UpdatePrescriptionPayload payload);
}
