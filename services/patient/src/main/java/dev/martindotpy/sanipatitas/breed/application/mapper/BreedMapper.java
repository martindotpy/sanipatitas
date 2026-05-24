package dev.martindotpy.sanipatitas.breed.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.breed.application.dto.BreedDto;
import dev.martindotpy.sanipatitas.shared.breed.domain.entity.Breed;
import dev.martindotpy.sanipatitas.shared.breed.domain.payload.CreateBreedPayload;
import dev.martindotpy.sanipatitas.shared.breed.domain.payload.UpdateBreedPayload;
import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface BreedMapper {
    @ObjectFactory
    default Breed.BreedBuilder<?, ?> createBreedBuilder() {
        return Breed.builder();
    }

    BreedDto toDto(Breed breed);

    @Mapping(target = "species", ignore = true)
    Breed.BreedBuilder<?, ?> from(CreateBreedPayload payload);

    @Mapping(target = "species", ignore = true)
    Breed.BreedBuilder<?, ?> from(UUID id, UpdateBreedPayload payload);
}
