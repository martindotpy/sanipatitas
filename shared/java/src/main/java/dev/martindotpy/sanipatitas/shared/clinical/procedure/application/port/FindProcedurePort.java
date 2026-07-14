package dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto.ProcedureDto;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.smallrye.mutiny.Uni;

public interface FindProcedurePort {
    Uni<PageResult<ProcedureDto>> findByPatientId(UUID patientId, int page, int size);

    Uni<ProcedureDto> findById(UUID id);
}
