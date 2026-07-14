package dev.martindotpy.sanipatitas.ehr.application.usecase.observation;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.MedicalObservationMapper;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.dto.MedicalObservationDto;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.port.UpdateMedicalObservationPort;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.error.MedicalObservationNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.payload.UpdateMedicalObservationPayload;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.repository.MedicalObservationRepository;
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
public class UpdateMedicalObservationUseCase implements UpdateMedicalObservationPort {
    private final MedicalObservationRepository medicalObservationRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final MedicalObservationMapper medicalObservationMapper;

    @Override
    public Uni<MedicalObservationDto> update(UUID id, UpdateMedicalObservationPayload payload) {
        var patientId = payload.getPatientId();
        var veterinarianId = payload.getVeterinarianId();
        var medicalObservationBuilder = medicalObservationMapper.from(id, payload);

        return patientRepository.findById(patientId)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(patientId))
                .chain(patient -> userRepository.findById(veterinarianId)
                        .onItem().ifNull().failWith(() -> new UserNotFoundException(veterinarianId))
                        .chain(veterinarian -> medicalObservationRepository.findById(id)
                                .onItem().ifNull().failWith(() -> new MedicalObservationNotFoundException(id))
                                .map(_ -> {
                                    @SuppressWarnings("null")
                                    var medicalObservation = medicalObservationBuilder
                                            .patient(patient)
                                            .veterinarian(veterinarian)
                                            .build();
                                    return medicalObservation;
                                })))
                .chain(medicalObservationRepository::update)
                .map(medicalObservationMapper::toDto);
    }
}