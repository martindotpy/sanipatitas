package dev.martindotpy.sanipatitas.patient.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.appointment.domain.repository.AppointmentRepository;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.repository.MedicalConditionRepository;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.repository.ImmunizationRepository;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.repository.MedicalObservationRepository;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.repository.PrescriptionRepository;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.repository.ProcedureRepository;
import dev.martindotpy.sanipatitas.shared.patient.application.port.DeletePatientPort;
import dev.martindotpy.sanipatitas.shared.patient.domain.error.PatientHasAssociatedDataException;
import dev.martindotpy.sanipatitas.shared.patient.domain.error.PatientNotFoundException;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeletePatientUseCase implements DeletePatientPort {
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalConditionRepository medicalConditionRepository;
    private final ImmunizationRepository immunizationRepository;
    private final MedicalObservationRepository medicalObservationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final ProcedureRepository procedureRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return patientRepository.findById(id)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(id))
                .chain(patient -> Uni.combine().all()
                        .unis(
                                appointmentRepository.count("patient.id", id),
                                medicalConditionRepository.countByPatientId(id),
                                immunizationRepository.countByPatientId(id),
                                medicalObservationRepository.countByPatientId(id),
                                prescriptionRepository.countByPatientId(id),
                                procedureRepository.countByPatientId(id))
                        .asTuple()
                        .chain(tuple -> {
                            long associated = tuple.getItem1()
                                    + tuple.getItem2()
                                    + tuple.getItem3()
                                    + tuple.getItem4()
                                    + tuple.getItem5()
                                    + tuple.getItem6();
                            if (associated > 0) {
                                return Uni.createFrom().failure(new PatientHasAssociatedDataException(id));
                            }
                            return patientRepository.delete(patient).replaceWithVoid();
                        }));
    }
}
