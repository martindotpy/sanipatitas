package dev.martindotpy.sanipatitas.shared.species.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.species.domain.entity.Species;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface SpeciesRepository extends PanacheRepositoryBase<Species, UUID> {
    default Uni<List<Species>> findAll(Page page) {
        return findAll().page(page).list();
    }

    default Uni<List<Species>> search(String search, Page page) {
        return find("name like ?1", "%%%s%%".formatted(search)).page(page).list();
    }

    default Uni<Long> count(String search) {
        return count("name like ?1", "%%%s%%".formatted(search));
    }

    default Uni<Species> update(Species species) {
        return getSession().chain(session -> session.merge(species));
    }
}
