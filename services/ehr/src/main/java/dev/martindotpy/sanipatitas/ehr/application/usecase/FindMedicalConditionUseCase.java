package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.MedicalConditionMapper;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.dto.MedicalConditionDto;
import dev.martindotpy.sanipatitas.shared.clinical.condition.application.port.FindMedicalConditionPort;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.error.MedicalConditionNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.repository.MedicalConditionRepository;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindMedicalConditionUseCase implements FindMedicalConditionPort {
    private final MedicalConditionRepository medicalConditionRepository;
    private final MedicalConditionMapper medicalConditionMapper;

    @Override
    public Uni<PageResult<MedicalConditionDto>> findByPatientId(UUID patientId, int page, int size) {
        var pagination = Page.of(page, size);
        var conditionQuery = medicalConditionRepository.findByPatientId(patientId, pagination);
        var conditionCountQuery = medicalConditionRepository.countByPatientId(patientId);

        return Uni.combine().all()
                .unis(conditionQuery, conditionCountQuery)
                .with((conditions, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        conditions.stream()
                                .map(medicalConditionMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<MedicalConditionDto> findById(UUID id) {
        return medicalConditionRepository.findById(id)
                .onItem().ifNull().failWith(() -> new MedicalConditionNotFoundException(id))
                .map(medicalConditionMapper::toDto);
    }
}
