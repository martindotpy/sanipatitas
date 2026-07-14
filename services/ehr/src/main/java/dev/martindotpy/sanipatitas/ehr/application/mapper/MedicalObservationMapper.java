package dev.martindotpy.sanipatitas.ehr.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.clinical.observation.application.dto.MedicalObservationDto;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.entity.MedicalObservation;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.payload.CreateMedicalObservationPayload;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.payload.UpdateMedicalObservationPayload;
import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface MedicalObservationMapper {
    @ObjectFactory
    default MedicalObservation.MedicalObservationBuilder<?, ?> createMedicalObservation() {
        return MedicalObservation.builder();
    }

    MedicalObservationDto toDto(MedicalObservation medicalObservation);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    MedicalObservation.MedicalObservationBuilder<?, ?> from(CreateMedicalObservationPayload payload);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    MedicalObservation.MedicalObservationBuilder<?, ?> from(UUID id, UpdateMedicalObservationPayload payload);
}