package dev.martindotpy.sanipatitas.patient.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.patient.domain.entity.Species;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.CreateSpeciesPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface SpeciesMapper {

    @ObjectFactory
    default Species.SpeciesBuilder<?, ?> createSpeciesBuilder() {
        return Species.builder();
    }

    SpeciesDto toDto(Species species);

    Species.SpeciesBuilder<?, ?> from(CreateSpeciesPayload payload);
}
