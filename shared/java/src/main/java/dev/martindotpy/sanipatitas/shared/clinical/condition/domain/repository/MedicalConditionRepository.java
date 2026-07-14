package dev.martindotpy.sanipatitas.shared.clinical.condition.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.condition.domain.entity.MedicalCondition;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface MedicalConditionRepository extends PanacheRepositoryBase<MedicalCondition, UUID> {
    default Uni<List<MedicalCondition>> findByPatientId(UUID patientId, Page page) {
        return find("patient.id = ?1", patientId).page(page).list();
    }

    default Uni<Long> countByPatientId(UUID patientId) {
        return count("patient.id = ?1", patientId);
    }

    default Uni<MedicalCondition> update(MedicalCondition medicalCondition) {
        return getSession().chain(session -> session.merge(medicalCondition));
    }
}
