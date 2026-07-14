package dev.martindotpy.sanipatitas.ehr.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.clinical.condition.application.dto.MedicalConditionDto;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.entity.MedicalCondition;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.payload.CreateMedicalConditionPayload;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.payload.UpdateMedicalConditionPayload;
import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface MedicalConditionMapper {
    @ObjectFactory
    default MedicalCondition.MedicalConditionBuilder<?, ?> createMedicalCondition() {
        return MedicalCondition.builder();
    }

    MedicalConditionDto toDto(MedicalCondition medicalCondition);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    MedicalCondition.MedicalConditionBuilder<?, ?> from(CreateMedicalConditionPayload payload);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    MedicalCondition.MedicalConditionBuilder<?, ?> from(UUID id, UpdateMedicalConditionPayload payload);
}
