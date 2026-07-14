package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port.DeleteProcedurePort;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.error.ProcedureNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.repository.ProcedureRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class DeleteProcedureUseCase implements DeleteProcedurePort {
    private final ProcedureRepository procedureRepository;

    @Override
    public Uni<Void> deleteById(UUID id) {
        return procedureRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProcedureNotFoundException(id))
                .call(procedureRepository::delete)
                .replaceWithVoid();
    }
}
