package dev.martindotpy.sanipatitas.shared.clinical.observation.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.observation.domain.entity.MedicalObservation;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface MedicalObservationRepository extends PanacheRepositoryBase<MedicalObservation, UUID> {
    default Uni<List<MedicalObservation>> findByPatientId(UUID patientId, Page page) {
        return find("patient.id = ?1", patientId).page(page).list();
    }

    default Uni<Long> countByPatientId(UUID patientId) {
        return count("patient.id = ?1", patientId);
    }

    default Uni<MedicalObservation> update(MedicalObservation medicalObservation) {
        return getSession().chain(session -> session.merge(medicalObservation));
    }
}