package dev.martindotpy.sanipatitas.shared.patient.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.patient.domain.entity.Patient;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface PatientRepository extends PanacheRepositoryBase<Patient, UUID> {
    default Uni<List<Patient>> findAll(Page page) {
        return findAll().page(page).list();
    }

    default Uni<List<Patient>> search(String search, Page page) {
        return find("name like ?1", "%%%s%%".formatted(search)).page(page).list();
    }

    default Uni<Long> count(String search) {
        return count("name like ?1", "%%%s%%".formatted(search));
    }
}
