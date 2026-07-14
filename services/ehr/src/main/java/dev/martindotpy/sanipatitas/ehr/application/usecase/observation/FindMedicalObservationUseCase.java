package dev.martindotpy.sanipatitas.ehr.application.usecase.observation;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.MedicalObservationMapper;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.dto.MedicalObservationDto;
import dev.martindotpy.sanipatitas.shared.clinical.observation.application.port.FindMedicalObservationPort;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.error.MedicalObservationNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.repository.MedicalObservationRepository;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindMedicalObservationUseCase implements FindMedicalObservationPort {
    private final MedicalObservationRepository medicalObservationRepository;
    private final MedicalObservationMapper medicalObservationMapper;

    @Override
    public Uni<PageResult<MedicalObservationDto>> findByPatientId(UUID patientId, int page, int size) {
        var pagination = Page.of(page, size);
        var observationQuery = medicalObservationRepository.findByPatientId(patientId, pagination);
        var observationCountQuery = medicalObservationRepository.countByPatientId(patientId);

        return Uni.combine().all()
                .unis(observationQuery, observationCountQuery)
                .with((observations, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        observations.stream()
                                .map(medicalObservationMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<MedicalObservationDto> findById(UUID id) {
        return medicalObservationRepository.findById(id)
                .onItem().ifNull().failWith(() -> new MedicalObservationNotFoundException(id))
                .map(medicalObservationMapper::toDto);
    }
}