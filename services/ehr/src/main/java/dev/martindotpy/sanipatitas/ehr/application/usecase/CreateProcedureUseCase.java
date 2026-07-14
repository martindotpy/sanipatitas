package dev.martindotpy.sanipatitas.ehr.application.usecase;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.ProcedureMapper;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto.ProcedureDto;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port.CreateProcedurePort;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.payload.CreateProcedurePayload;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.repository.ProcedureRepository;
import dev.martindotpy.sanipatitas.shared.core.domain.enums.ProcedureStatus;
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
public class CreateProcedureUseCase implements CreateProcedurePort {
    private final ProcedureRepository procedureRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final ProcedureMapper procedureMapper;

    @Override
    public Uni<ProcedureDto> create(CreateProcedurePayload payload) {
        var patientId = payload.getPatientId();
        var veterinarianId = payload.getVeterinarianId();
        var procedureBuilder = procedureMapper.from(payload);

        if (payload.getStatus() == null) {
            procedureBuilder.status(ProcedureStatus.PREPARATION);
        }

        return patientRepository.findById(patientId)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(patientId))
                .chain(patient -> userRepository.findById(veterinarianId)
                        .onItem().ifNull().failWith(() -> new UserNotFoundException(veterinarianId))
                        .map(veterinarian -> {
                            @SuppressWarnings("null")
                            var procedure = procedureBuilder
                                    .patient(patient)
                                    .veterinarian(veterinarian)
                                    .build();
                            return procedure;
                        }))
                .chain(procedureRepository::persist)
                .map(procedureMapper::toDto);
    }
}
