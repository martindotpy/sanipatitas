package dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.dto.ImmunizationDto;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.payload.UpdateImmunizationPayload;
import io.smallrye.mutiny.Uni;

public interface UpdateImmunizationPort {
    Uni<ImmunizationDto> update(UUID id, UpdateImmunizationPayload payload);
}
