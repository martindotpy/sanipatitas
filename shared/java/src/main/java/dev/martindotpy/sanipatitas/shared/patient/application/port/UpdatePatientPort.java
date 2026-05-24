package dev.martindotpy.sanipatitas.shared.patient.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.UpdatePatientPayload;
import io.smallrye.mutiny.Uni;

public interface UpdatePatientPort {
    Uni<PatientDto> update(UUID id, UpdatePatientPayload payload);
}
