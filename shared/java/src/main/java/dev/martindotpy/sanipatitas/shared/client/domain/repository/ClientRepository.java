package dev.martindotpy.sanipatitas.shared.client.domain.repository;

import java.util.List;
import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.client.domain.entity.Client;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

public interface ClientRepository extends PanacheRepositoryBase<Client, UUID> {
    default Uni<List<Client>> findAll(Page page) {
        return findAll().page(page).list();
    }

    default Uni<List<Client>> search(String search, Page page) {
        return find("firstName like ?1 or lastName like ?1", "%%%s%%".formatted(search)).page(page).list();
    }

    default Uni<Long> countSearch(String search) {
        return count("firstName like ?1 or lastName like ?1", "%%%s%%".formatted(search));
    }

    default Uni<Client> update(Client client) {
        return getSession().chain(session -> session.merge(client));
    }
}
