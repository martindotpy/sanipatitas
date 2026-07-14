package dev.martindotpy.sanipatitas.ehr.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.dto.ImmunizationDto;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.entity.Immunization;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.payload.CreateImmunizationPayload;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.payload.UpdateImmunizationPayload;
import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface ImmunizationMapper {
    @ObjectFactory
    default Immunization.ImmunizationBuilder<?, ?> createImmunization() {
        return Immunization.builder();
    }

    ImmunizationDto toDto(Immunization immunization);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Immunization.ImmunizationBuilder<?, ?> from(CreateImmunizationPayload payload);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Immunization.ImmunizationBuilder<?, ?> from(UUID id, UpdateImmunizationPayload payload);
}
