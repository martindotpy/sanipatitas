package dev.martindotpy.sanipatitas.ehr.application.usecase;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.ImmunizationMapper;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.dto.ImmunizationDto;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port.CreateImmunizationPort;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.payload.CreateImmunizationPayload;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.repository.ImmunizationRepository;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ImmunizationStatus;
import dev.martindotpy.sanipatitas.shared.patient.domain.error.PatientNotFoundException;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import dev.martindotpy.sanipatitas.shared.user.domain.error.UserNotFoundException;
import dev.martindotpy.sanipatitas.shared.user.domain.repository.UserRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreateImmunizationUseCase implements CreateImmunizationPort {
    private final ImmunizationRepository immunizationRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final ImmunizationMapper immunizationMapper;

    @Override
    public Uni<ImmunizationDto> create(CreateImmunizationPayload payload) {
        var patientId = payload.getPatientId();
        var veterinarianId = payload.getVeterinarianId();
        var immunizationBuilder = immunizationMapper.from(payload);

        if (payload.getStatus() == null) {
            immunizationBuilder.status(ImmunizationStatus.COMPLETED);
        }

        return patientRepository.findById(patientId)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(patientId))
                .chain(patient -> userRepository.findById(veterinarianId)
                        .onItem().ifNull().failWith(() -> new UserNotFoundException(veterinarianId))
                        .map(veterinarian -> {
                            @SuppressWarnings("null")
                            var immunization = immunizationBuilder
                                    .patient(patient)
                                    .veterinarian(veterinarian)
                                    .build();
                            return immunization;
                        }))
                .chain(immunizationRepository::persist)
                .map(immunizationMapper::toDto);
    }
}
