package dev.martindotpy.sanipatitas.species.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.species.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.species.domain.entity.Species;
import dev.martindotpy.sanipatitas.shared.species.domain.payload.CreateSpeciesPayload;
import dev.martindotpy.sanipatitas.shared.species.domain.payload.UpdateSpeciesPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface SpeciesMapper {
    @ObjectFactory
    default Species.SpeciesBuilder<?, ?> createSpecies() {
        return Species.builder();
    }

    SpeciesDto toDto(Species species);

    Species.SpeciesBuilder<?, ?> from(CreateSpeciesPayload payload);

    Species.SpeciesBuilder<?, ?> from(UUID id, UpdateSpeciesPayload payload);
}
