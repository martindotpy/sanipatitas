package dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.immunization.domain.entity.Immunization;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface ImmunizationRepository extends PanacheRepositoryBase<Immunization, UUID> {
    default Uni<List<Immunization>> findByPatientId(UUID patientId, Page page) {
        return find("patient.id = ?1", patientId).page(page).list();
    }

    default Uni<Long> countByPatientId(UUID patientId) {
        return count("patient.id = ?1", patientId);
    }

    default Uni<Immunization> update(Immunization immunization) {
        return getSession().chain(session -> session.merge(immunization));
    }
}
