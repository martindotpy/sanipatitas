package dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto.ProcedureDto;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.payload.UpdateProcedurePayload;
import io.smallrye.mutiny.Uni;

public interface UpdateProcedurePort {
    Uni<ProcedureDto> update(UUID id, UpdateProcedurePayload payload);
}
