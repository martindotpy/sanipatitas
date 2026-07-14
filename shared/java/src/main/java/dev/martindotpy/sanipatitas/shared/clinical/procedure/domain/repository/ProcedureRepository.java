package dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.clinical.procedure.domain.entity.Procedure;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface ProcedureRepository extends PanacheRepositoryBase<Procedure, UUID> {
    default Uni<List<Procedure>> findByPatientId(UUID patientId, Page page) {
        return find("patient.id = ?1", patientId).page(page).list();
    }

    default Uni<Long> countByPatientId(UUID patientId) {
        return count("patient.id = ?1", patientId);
    }

    default Uni<Procedure> update(Procedure procedure) {
        return getSession().chain(session -> session.merge(procedure));
    }
}
