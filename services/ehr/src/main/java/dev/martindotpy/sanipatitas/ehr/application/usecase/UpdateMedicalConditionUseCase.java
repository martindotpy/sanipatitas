package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.MedicalConditionMapper;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.dto.MedicalConditionDto;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.port.UpdateMedicalConditionPort;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.error.MedicalConditionNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.payload.UpdateMedicalConditionPayload;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.repository.MedicalConditionRepository;
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
public class UpdateMedicalConditionUseCase implements UpdateMedicalConditionPort {
    private final MedicalConditionRepository medicalConditionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final MedicalConditionMapper medicalConditionMapper;

    @Override
    public Uni<MedicalConditionDto> update(UUID id, UpdateMedicalConditionPayload payload) {
        var patientId = payload.getPatientId();
        var veterinarianId = payload.getVeterinarianId();
        var medicalConditionBuilder = medicalConditionMapper.from(id, payload);

        return patientRepository.findById(patientId)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(patientId))
                .chain(patient -> userRepository.findById(veterinarianId)
                        .onItem().ifNull().failWith(() -> new UserNotFoundException(veterinarianId))
                        .chain(veterinarian -> medicalConditionRepository.findById(id)
                                .onItem().ifNull().failWith(() -> new MedicalConditionNotFoundException(id))
                                .map(_ -> {
                                    @SuppressWarnings("null")
                                    var medicalCondition = medicalConditionBuilder
                                            .patient(patient)
                                            .veterinarian(veterinarian)
                                            .build();
                                    return medicalCondition;
                                })))
                .chain(medicalConditionRepository::update)
                .map(medicalConditionMapper::toDto);
    }
}
