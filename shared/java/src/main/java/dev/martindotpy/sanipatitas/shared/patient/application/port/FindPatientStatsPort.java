package dev.martindotpy.sanipatitas.shared.patient.application.port;

import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientStatsDto;
import io.smallrye.mutiny.Uni;

public interface FindPatientStatsPort {
    Uni<PatientStatsDto> getStats();
}
