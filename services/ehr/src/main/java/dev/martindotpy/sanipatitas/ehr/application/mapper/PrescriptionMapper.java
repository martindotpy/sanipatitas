package dev.martindotpy.sanipatitas.ehr.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto.PrescriptionDto;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto.PrescriptionItemDto;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.entity.Prescription;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.entity.PrescriptionItem;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.CreatePrescriptionPayload;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.UpdatePrescriptionPayload;

@Mapper(componentModel = "cdi")
public interface PrescriptionMapper {
    @ObjectFactory
    default Prescription.PrescriptionBuilder<?, ?> createPrescription() {
        return Prescription.builder();
    }

    PrescriptionDto toDto(Prescription prescription);

    PrescriptionItemDto toItemDto(PrescriptionItem item);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Prescription.PrescriptionBuilder<?, ?> from(CreatePrescriptionPayload payload);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Prescription.PrescriptionBuilder<?, ?> from(UUID id, UpdatePrescriptionPayload payload);
}
