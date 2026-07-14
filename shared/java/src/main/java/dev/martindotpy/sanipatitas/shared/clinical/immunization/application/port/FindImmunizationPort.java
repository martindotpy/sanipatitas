package dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.dto.ImmunizationDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindImmunizationPort {
    Uni<PageResult<ImmunizationDto>> findByPatientId(UUID patientId, int page, int size);

    Uni<ImmunizationDto> findById(UUID id);
}
