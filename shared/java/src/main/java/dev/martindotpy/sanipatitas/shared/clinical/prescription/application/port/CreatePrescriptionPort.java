package dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto.PrescriptionDto;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.CreatePrescriptionPayload;
import io.smallrye.mutiny.Uni;

public interface CreatePrescriptionPort {
    Uni<PrescriptionDto> create(CreatePrescriptionPayload payload);
}
