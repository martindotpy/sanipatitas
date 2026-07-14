package dev.martindotpy.sanipatitas.ehr.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto.ProcedureDto;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.entity.Procedure;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.payload.CreateProcedurePayload;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.payload.UpdateProcedurePayload;
import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface ProcedureMapper {
    @ObjectFactory
    default Procedure.ProcedureBuilder<?, ?> createProcedure() {
        return Procedure.builder();
    }

    ProcedureDto toDto(Procedure procedure);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Procedure.ProcedureBuilder<?, ?> from(CreateProcedurePayload payload);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Procedure.ProcedureBuilder<?, ?> from(UUID id, UpdateProcedurePayload payload);
}
