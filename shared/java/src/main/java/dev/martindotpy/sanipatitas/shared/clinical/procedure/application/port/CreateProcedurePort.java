package dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto.ProcedureDto;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.payload.CreateProcedurePayload;
import io.smallrye.mutiny.Uni;

public interface CreateProcedurePort {
    Uni<ProcedureDto> create(CreateProcedurePayload payload);
}
