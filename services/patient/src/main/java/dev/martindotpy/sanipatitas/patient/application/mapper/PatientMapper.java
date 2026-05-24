package dev.martindotpy.sanipatitas.patient.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.patient.domain.entity.Patient;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.CreatePatientPayload;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.UpdatePatientPayload;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface PatientMapper {
    @ObjectFactory
    default Patient.PatientBuilder<?, ?> createPatientBuilder() {
        return Patient.builder();
    }

    PatientDto toDto(Patient patient);

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "breed", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Patient.PatientBuilder<?, ?> from(CreatePatientPayload payload);

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "breed", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Patient.PatientBuilder<?, ?> from(UUID id, UpdatePatientPayload payload);
}
