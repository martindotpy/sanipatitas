package dev.martindotpy.sanipatitas.shared.clinical.condition.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.condition.application.dto.MedicalConditionDto;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.payload.CreateMedicalConditionPayload;
import io.smallrye.mutiny.Uni;

public interface CreateMedicalConditionPort {
    Uni<MedicalConditionDto> create(CreateMedicalConditionPayload payload);
}
