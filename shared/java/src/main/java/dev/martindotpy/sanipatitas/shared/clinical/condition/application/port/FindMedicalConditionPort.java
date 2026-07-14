package dev.martindotpy.sanipatitas.shared.clinical.condition.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.condition.application.dto.MedicalConditionDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindMedicalConditionPort {
    Uni<PageResult<MedicalConditionDto>> findByPatientId(UUID patientId, int page, int size);

    Uni<MedicalConditionDto> findById(UUID id);
}
