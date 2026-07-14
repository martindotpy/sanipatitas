package dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.prescription.domain.entity.Prescription;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface PrescriptionRepository extends PanacheRepositoryBase<Prescription, UUID> {
    default Uni<List<Prescription>> findByPatientId(UUID patientId, Page page) {
        return find("SELECT DISTINCT p FROM Prescription p LEFT JOIN FETCH p.items WHERE p.patient.id = ?1 ORDER BY p.issueDate DESC", patientId)
                .page(page)
                .list();
    }

    default Uni<Long> countByPatientId(UUID patientId) {
        return count("patient.id = ?1", patientId);
    }

    default Uni<Prescription> findByIdWithItems(UUID id) {
        return find("SELECT DISTINCT p FROM Prescription p LEFT JOIN FETCH p.items WHERE p.id = ?1", id)
                .singleResult();
    }

    default Uni<Prescription> update(Prescription prescription) {
        return getSession().chain(session -> session.merge(prescription));
    }
}
