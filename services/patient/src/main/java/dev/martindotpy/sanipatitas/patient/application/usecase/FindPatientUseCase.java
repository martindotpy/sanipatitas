package dev.martindotpy.sanipatitas.patient.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.patient.application.mapper.PatientMapper;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.patient.application.port.FindPatientPort;
import dev.martindotpy.sanipatitas.shared.patient.domain.error.PatientNotFoundException;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindPatientUseCase implements FindPatientPort {
    private final PatientRepository patientRepository;

    private final PatientMapper patientMapper;

    @Override
    public Uni<PageResult<PatientDto>> search(String search, int page, int size) {
        var pagination = Page.of(page, size);
        var hasSearch = search != null && !search.isBlank();

        var patientQuery = hasSearch ? patientRepository.search(search, pagination)
                : patientRepository.findAll(pagination);
        var patientCountQuery = hasSearch ? patientRepository.count(search) : patientRepository.count();

        return Uni.combine().all()
                .unis(patientQuery, patientCountQuery)
                .with((patients, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        patients.stream()
                                .map(patientMapper::toDto)
                                .toList()));

    }

    @Override
    public Uni<PatientDto> findById(UUID id) {
        return patientRepository.findById(id)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(id))
                .map(patientMapper::toDto);
    }
}
