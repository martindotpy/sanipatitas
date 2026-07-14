package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.ImmunizationMapper;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.dto.ImmunizationDto;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.application.port.FindImmunizationPort;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.error.ImmunizationNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.repository.ImmunizationRepository;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindImmunizationUseCase implements FindImmunizationPort {
    private final ImmunizationRepository immunizationRepository;
    private final ImmunizationMapper immunizationMapper;

    @Override
    public Uni<PageResult<ImmunizationDto>> findByPatientId(UUID patientId, int page, int size) {
        var pagination = Page.of(page, size);
        var immunizationQuery = immunizationRepository.findByPatientId(patientId, pagination);
        var immunizationCountQuery = immunizationRepository.countByPatientId(patientId);

        return Uni.combine().all()
                .unis(immunizationQuery, immunizationCountQuery)
                .with((immunizations, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        immunizations.stream()
                                .map(immunizationMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<ImmunizationDto> findById(UUID id) {
        return immunizationRepository.findById(id)
                .onItem().ifNull().failWith(() -> new ImmunizationNotFoundException(id))
                .map(immunizationMapper::toDto);
    }
}
