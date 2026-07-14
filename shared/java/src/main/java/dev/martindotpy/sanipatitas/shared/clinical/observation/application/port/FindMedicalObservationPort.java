package dev.martindotpy.sanipatitas.shared.clinical.observation.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.observation.application.dto.MedicalObservationDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindMedicalObservationPort {
    Uni<PageResult<MedicalObservationDto>> findByPatientId(UUID patientId, int page, int size);

    Uni<MedicalObservationDto> findById(UUID id);
}