package dev.martindotpy.sanipatitas.shared.patient.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import io.smallrye.mutiny.Uni;

public interface FindPatientPort {
    Uni<PageResult<PatientDto>> search(String search, int page, int size);

    Uni<PatientDto> findById(UUID id);
}
