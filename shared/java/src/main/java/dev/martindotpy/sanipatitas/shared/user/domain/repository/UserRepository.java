package dev.martindotpy.sanipatitas.shared.user.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.user.domain.entity.User;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface UserRepository extends PanacheRepositoryBase<User, UUID> {
    default Uni<List<User>> findAll(Page page) {
        return findAll().page(page).list();
    }

    default Uni<List<User>> search(String search, Page page) {
        return find("name like ?1 or email like ?1 or lastName like ?1", "%%%s%%".formatted(search)).page(page).list();
    }

    default Uni<Long> count(String search) {
        return count("name like ?1 or email like ?1 or lastName like ?1", "%%%s%%".formatted(search));
    }
}
