package dev.martindotpy.sanipatitas.ehr.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.ehr.application.mapper.PrescriptionMapper;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.dto.PrescriptionDto;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.application.port.FindPrescriptionPort;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.error.PrescriptionNotFoundException;
import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.repository.PrescriptionRepository;
import dev.martindotpy.sanipatitas.shared.core.application.dto.PageResult;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindPrescriptionUseCase implements FindPrescriptionPort {
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionMapper prescriptionMapper;

    @Override
    public Uni<PageResult<PrescriptionDto>> findByPatientId(UUID patientId, int page, int size) {
        var pagination = Page.of(page, size);
        var prescriptionQuery = prescriptionRepository.findByPatientId(patientId, pagination);
        var prescriptionCountQuery = prescriptionRepository.countByPatientId(patientId);

        return Uni.combine().all()
                .unis(prescriptionQuery, prescriptionCountQuery)
                .with((prescriptions, totalElements) -> PageResult.from(
                        page, size, totalElements,
                        prescriptions.stream()
                                .map(prescriptionMapper::toDto)
                                .toList()));
    }

    @Override
    public Uni<PrescriptionDto> findById(UUID id) {
        return prescriptionRepository.findByIdWithItems(id)
                .onItem().ifNull().failWith(() -> new PrescriptionNotFoundException(id))
                .map(prescriptionMapper::toDto);
    }
}
