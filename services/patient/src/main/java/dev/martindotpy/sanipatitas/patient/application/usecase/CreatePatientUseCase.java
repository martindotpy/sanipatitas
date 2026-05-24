package dev.martindotpy.sanipatitas.patient.application.usecase;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.patient.application.mapper.PatientMapper;
import dev.martindotpy.sanipatitas.shared.breed.domain.entity.Breed;
import dev.martindotpy.sanipatitas.shared.breed.domain.error.BreedNotFoundException;
import dev.martindotpy.sanipatitas.shared.breed.domain.repository.BreedRepository;
import dev.martindotpy.sanipatitas.shared.client.domain.error.ClientNotFoundException;
import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientDto;
import dev.martindotpy.sanipatitas.shared.patient.application.port.CreatePatientPort;
import dev.martindotpy.sanipatitas.shared.patient.domain.payload.CreatePatientPayload;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class CreatePatientUseCase implements CreatePatientPort {
    private final PatientRepository patientRepository;
    private final ClientRepository clientRepository;
    private final BreedRepository breedRepository;
    private final PatientMapper patientMapper;

    @Override
    public Uni<PatientDto> create(CreatePatientPayload payload) {
        var breedId = payload.getBreedId();
        var clientId = payload.getClientId();
        var patientBuilder = patientMapper.from(payload);

        var clientQuery = clientRepository.findById(clientId)
                .onItem().ifNull().failWith(() -> new ClientNotFoundException(clientId));
        var breedQuery = breedId != null
                ? breedRepository.findById(breedId)
                        .onItem().ifNull().failWith(() -> new BreedNotFoundException(breedId))
                : Uni.createFrom().nullItem();

        return Uni.combine().all()
                .unis(clientQuery, breedQuery)
                .with((client, breedNullable) -> {
                    var breed = switch (breedNullable) {
                        case Breed b -> b;
                        case null -> null;
                        default -> null;
                    };

                    @SuppressWarnings("null")
                    var patient = patientBuilder
                            .client(client)
                            .breed(breed)
                            .build();

                    return patient;
                })
                .chain(patientRepository::persist)
                .map(patientMapper::toDto);
    }
}
