package dev.martindotpy.sanipatitas.shared.patient.application.port;

import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.CreatePatientPayload;
import io.smallrye.mutiny.Uni;

public interface CreatePatientPort {
    Uni<PatientDto> create(CreatePatientPayload payload);
}
