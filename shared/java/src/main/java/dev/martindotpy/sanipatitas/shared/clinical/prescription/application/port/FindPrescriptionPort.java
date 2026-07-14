package dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto.PrescriptionDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindPrescriptionPort {
    Uni<PageResult<PrescriptionDto>> findByPatientId(UUID patientId, int page, int size);

    Uni<PrescriptionDto> findById(UUID id);
}
