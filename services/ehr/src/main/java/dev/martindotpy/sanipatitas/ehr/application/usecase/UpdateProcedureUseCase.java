package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.ProcedureMapper;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto.ProcedureDto;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port.UpdateProcedurePort;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.error.ProcedureNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.payload.UpdateProcedurePayload;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.repository.ProcedureRepository;
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
public class UpdateProcedureUseCase implements UpdateProcedurePort {
    private final ProcedureRepository procedureRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final ProcedureMapper procedureMapper;

    @Override
    public Uni<ProcedureDto> update(UUID id, UpdateProcedurePayload payload) {
        var patientId = payload.getPatientId();
        var veterinarianId = payload.getVeterinarianId();
        var procedureBuilder = procedureMapper.from(id, payload);

        return patientRepository.findById(patientId)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(patientId))
                .chain(patient -> userRepository.findById(veterinarianId)
                        .onItem().ifNull().failWith(() -> new UserNotFoundException(veterinarianId))
                        .chain(veterinarian -> procedureRepository.findById(id)
                                .onItem().ifNull().failWith(() -> new ProcedureNotFoundException(id))
                                .map(_ -> {
                                    @SuppressWarnings("null")
                                    var procedure = procedureBuilder
                                            .patient(patient)
                                            .veterinarian(veterinarian)
                                            .build();
                                    return procedure;
                                })))
                .chain(procedureRepository::update)
                .map(procedureMapper::toDto);
    }
}
