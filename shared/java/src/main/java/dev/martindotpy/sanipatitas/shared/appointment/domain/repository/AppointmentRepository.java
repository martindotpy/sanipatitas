package dev.martindotpy.sanipatitas.shared.appointment.domain.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.appointment.domain.entity.Appointment;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface AppointmentRepository extends PanacheRepositoryBase<Appointment, UUID> {
    default Uni<List<Appointment>> findAll(Page page) {
        return findAll().page(page).list();
    }

    default Uni<List<Appointment>> findByDateRange(LocalDate from, LocalDate to, Page page) {
        return find("date between ?1 and ?2", from, to).page(page).list();
    }

    default Uni<Long> countByDateRange(LocalDate from, LocalDate to) {
        return count("date between ?1 and ?2", from, to);
    }
}
