package dev.martindotpy.sanipatitas.patient.application.mapper;

import org.mapstruct.Mapper;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.SpeciesDto;
import dev.martindotpy.sanipatitas.shared.patient.domain.entity.Species;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface SpeciesMapper {
    SpeciesDto toDto(Species species);
}
