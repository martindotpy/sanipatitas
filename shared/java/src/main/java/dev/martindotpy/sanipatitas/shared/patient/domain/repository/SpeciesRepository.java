package dev.martindotpy.sanipatitas.shared.patient.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.patient.domain.entity.Species;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;

public interface SpeciesRepository extends PanacheRepositoryBase<Species, UUID> {
}
