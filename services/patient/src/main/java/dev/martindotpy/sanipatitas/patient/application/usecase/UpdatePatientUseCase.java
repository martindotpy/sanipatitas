package dev.martindotpy.sanipatitas.patient.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.patient.application.mapper.PatientMapper;
import dev.martindotpy.sanipatitas.shared.breed.domain.error.BreedNotFoundException;
import dev.martindotpy.sanipatitas.shared.breed.domain.repository.BreedRepository;
import dev.martindotpy.sanipatitas.shared.client.domain.error.ClientNotFoundException;
import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.patient.application.port.UpdatePatientPort;
import dev.martindotpy.sanipatitas.shared.patient.domain.error.PatientNotFoundException;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.UpdatePatientPayload;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdatePatientUseCase implements UpdatePatientPort {
    private final PatientRepository patientRepository;
    private final ClientRepository clientRepository;
    private final BreedRepository breedRepository;
    private final PatientMapper patientMapper;

    @Override
    public Uni<PatientDto> update(UUID id, UpdatePatientPayload payload) {
        var breedId = payload.getBreedId();
        var clientId = payload.getClientId();
        var patientBuilder = patientMapper.from(id, payload);

        return clientRepository.findById(clientId)
                .onItem().ifNull().failWith(() -> new ClientNotFoundException(clientId))
                .chain(client -> {
                    if (breedId == null) {
                        return patientRepository.findById(id)
                                .onItem().ifNull().failWith(() -> new PatientNotFoundException(id))
                                .map(_ -> {
                                    @SuppressWarnings("null")
                                    var patient = patientBuilder
                                            .client(client)
                                            .breed(null)
                                            .build();
                                    return patient;
                                });
                    }

                    return breedRepository.findById(breedId)
                            .onItem().ifNull().failWith(() -> new BreedNotFoundException(breedId))
                            .chain(breed -> patientRepository.findById(id)
                                    .onItem().ifNull().failWith(() -> new PatientNotFoundException(id))
                                    .map(_ -> {
                                        @SuppressWarnings("null")
                                        var patient = patientBuilder
                                                .client(client)
                                                .breed(breed)
                                                .build();
                                        return patient;
                                    }));
                })
                .chain(patientRepository::update)
                .map(patientMapper::toDto);
    }
}
