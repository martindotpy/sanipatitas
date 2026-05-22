package dev.martindotpy.sanipatitas.shared.patient.domain.repository;

import java.util.UUID;

import dev.martindotpy.sanipatitas.shared.patient.domain.entity.Patient;
import io.quarkus.hibernate.reactive.panache.PanacheRepositoryBase;

public interface PatientRepository extends PanacheRepositoryBase<Patient, UUID> {
}
