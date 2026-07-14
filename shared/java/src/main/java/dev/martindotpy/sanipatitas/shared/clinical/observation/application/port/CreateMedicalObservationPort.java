package dev.martindotpy.sanipatitas.shared.clinical.observation.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.observation.application.dto.MedicalObservationDto;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.payload.CreateMedicalObservationPayload;
import io.smallrye.mutiny.Uni;

public interface CreateMedicalObservationPort {
    Uni<MedicalObservationDto> create(CreateMedicalObservationPayload payload);
}