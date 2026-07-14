package dev.martindotpy.sanipatitas.shared.clinical.observation.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.observation.application.dto.MedicalObservationDto;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.payload.UpdateMedicalObservationPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateMedicalObservationPort {
    Uni<MedicalObservationDto> update(UUID id, UpdateMedicalObservationPayload payload);
}