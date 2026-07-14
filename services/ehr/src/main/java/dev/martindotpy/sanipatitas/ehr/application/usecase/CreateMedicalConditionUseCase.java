package dev.martindotpy.sanipatitas.ehr.application.usecase;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.MedicalConditionMapper;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.dto.MedicalConditionDto;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.port.CreateMedicalConditionPort;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.payload.CreateMedicalConditionPayload;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.repository.MedicalConditionRepository;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ConditionStatus;
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
public class CreateMedicalConditionUseCase implements CreateMedicalConditionPort {
    private final MedicalConditionRepository medicalConditionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final MedicalConditionMapper medicalConditionMapper;

    @Override
    public Uni<MedicalConditionDto> create(CreateMedicalConditionPayload payload) {
        var patientId = payload.getPatientId();
        var veterinarianId = payload.getVeterinarianId();
        var medicalConditionBuilder = medicalConditionMapper.from(payload);

        if (payload.getStatus() == null) {
            medicalConditionBuilder.status(ConditionStatus.ACTIVE);
        }

        return patientRepository.findById(patientId)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(patientId))
                .chain(patient -> userRepository.findById(veterinarianId)
                        .onItem().ifNull().failWith(() -> new UserNotFoundException(veterinarianId))
                        .map(veterinarian -> {
                            @SuppressWarnings("null")
                            var medicalCondition = medicalConditionBuilder
                                    .patient(patient)
                                    .veterinarian(veterinarian)
                                    .build();
                            return medicalCondition;
                        }))
                .chain(medicalConditionRepository::persist)
                .map(medicalConditionMapper::toDto);
    }
}
