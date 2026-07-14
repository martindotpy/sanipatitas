package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.PrescriptionMapper;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto.PrescriptionDto;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port.CreatePrescriptionPort;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.entity.Prescription;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.entity.PrescriptionItem;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.CreatePrescriptionPayload;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.repository.PrescriptionRepository;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.PrescriptionStatus;
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
public class CreatePrescriptionUseCase implements CreatePrescriptionPort {
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PrescriptionMapper prescriptionMapper;

    @Override
    public Uni<PrescriptionDto> create(CreatePrescriptionPayload payload) {
        var patientId = payload.getPatientId();
        var veterinarianId = payload.getVeterinarianId();
        var prescriptionBuilder = prescriptionMapper.from(payload);

        if (payload.getStatus() == null) {
            prescriptionBuilder.status(PrescriptionStatus.ACTIVE);
        }

        return patientRepository.findById(patientId)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(patientId))
                .chain(patient -> userRepository.findById(veterinarianId)
                        .onItem().ifNull().failWith(() -> new UserNotFoundException(veterinarianId))
                        .map(veterinarian -> {
                            var items = payload.getItems().stream()
                                    .map(CreatePrescriptionUseCase::toItem)
                                    .collect(Collectors.<PrescriptionItem>toList());

                            @SuppressWarnings("null")
                            Prescription prescription = prescriptionBuilder
                                    .patient(patient)
                                    .veterinarian(veterinarian)
                                    .items(items)
                                    .build();

                            items.forEach(item -> item.setPrescription(prescription));

                            return prescription;
                        }))
                .chain(prescription -> prescriptionRepository.persist(prescription))
                .map(prescriptionMapper::toDto);
    }

    private static PrescriptionItem toItem(
            dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.payload.CreatePrescriptionItemPayload payload) {
        return PrescriptionItem.builder()
                .medicationName(payload.getMedicationName())
                .dosage(payload.getDosage())
                .frequency(payload.getFrequency())
                .duration(payload.getDuration())
                .route(payload.getRoute())
                .notes(payload.getNotes())
                .build();
    }
}
