package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.ProcedureMapper;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.dto.ProcedureDto;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.application.port.FindProcedurePort;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.error.ProcedureNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.repository.ProcedureRepository;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindProcedureUseCase implements FindProcedurePort {
    private final ProcedureRepository procedureRepository;
    private final ProcedureMapper procedureMapper;

    @Override
    public Uni<PageResult<ProcedureDto>> findByPatientId(UUID patientId, int page, int size) {
        var pagination = Page.of(page, size);
        var procedureQuery = procedureRepository.findByPatientId(patientId, pagination);
        var procedureCountQuery = procedureRepository.countByPatientId(patientId);

        return Uni.combine().all()
                .unis(procedureQuery, procedureCountQuery)
                .with((procedures, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        procedures.stream()
                                .map(procedureMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<ProcedureDto> findById(UUID id) {
        return procedureRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ProcedureNotFoundException(id))
                .map(procedureMapper::toDto);
    }
}
