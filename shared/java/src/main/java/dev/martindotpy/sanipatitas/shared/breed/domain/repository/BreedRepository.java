package dev.martindotpy.sanipatitas.shared.breed.domain.repository;

import java.util.List;
import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.breed.domain.entity.Breed;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface BreedRepository extends PanacheRepositoryBase<Breed, UUID> {
    default Uni<List<Breed>> findAll(Page page) {
        return findAll().page(page).list();
    }

    default Uni<List<Breed>> search(String search, Page page) {
        return find("name like ?1", "%%%s%%".formatted(search)).page(page).list();
    }

    default Uni<List<Breed>> findBySpecies(@Nullable List<UUID> speciesIds, @Nullable String search, Page page) {
        if (speciesIds == null || speciesIds.isEmpty()) {
            if (search == null || search.isBlank()) {
                return findAll(page);
            }
            return search(search, page);
        }
        if (search == null || search.isBlank()) {
            return find("species.id in ?1", speciesIds).page(page).list();
        }
        return find("species.id in ?1 and name like ?2", speciesIds, "%%%s%%".formatted(search)).page(page).list();
    }

    default Uni<Long> countBySpecies(@Nullable List<UUID> speciesIds, @Nullable String search) {
        if (speciesIds == null || speciesIds.isEmpty()) {
            if (search == null || search.isBlank()) {
                return count();
            }
            return count(search);
        }
        if (search == null || search.isBlank()) {
            return count("species.id in ?1", speciesIds);
        }
        return count("species.id in ?1 and name like ?2", speciesIds, "%%%s%%".formatted(search));
    }

    default Uni<Long> count(String search) {
        return count("name like ?1", "%%%s%%".formatted(search));
    }

    default Uni<Breed> update(Breed breed) {
        return getSession().chain(session -> session.merge(breed));
    }
}
