package dev.martindotpy.sanipatitas.appointment.application.usecase;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.appointment.application.mapper.AppointmentMapper;
import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentDto;
import dev.martindotpy.sanipatitas.shared.appointment.application.port.UpdateAppointmentPort;
import dev.martindotpy.sanipatitas.shared.appointment.domain.error.AppointmentNotFoundException;
import dev.martindotpy.sanipatitas.shared.appointment.domain.payload.UpdateAppointmentPayload;
import dev.martindotpy.sanipatitas.shared.appointment.domain.repository.AppointmentRepository;
import dev.martindotpy.sanipatitas.shared.client.domain.error.ClientNotFoundException;
import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import dev.martindotpy.sanipatitas.shared.patient.domain.error.PatientNotFoundException;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import dev.martindotpy.sanipatitas.shared.user.domain.error.UserNotFoundException;
import dev.martindotpy.sanipatitas.shared.user.domain.repository.UserRepository;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithTransaction
@ApplicationScoped
@RequiredArgsConstructor
public class UpdateAppointmentUseCase implements UpdateAppointmentPort {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final AppointmentMapper appointmentMapper;

    @Override
    public Uni<AppointmentDto> update(UUID id, UpdateAppointmentPayload payload) {
        var patientId = payload.getPatientId();
        var clientId = payload.getClientId();
        var veterinarianId = payload.getVeterinarianId();
        var appointmentBuilder = appointmentMapper.from(id, payload);

        var patientQuery = patientRepository.findById(patientId)
                .onItem().ifNull().failWith(() -> new PatientNotFoundException(patientId));
        var clientQuery = clientRepository.findById(clientId)
                .onItem().ifNull().failWith(() -> new ClientNotFoundException(clientId));
        var veterinarianQuery = userRepository.findById(veterinarianId)
                .onItem().ifNull().failWith(() -> new UserNotFoundException(veterinarianId));
        var appointmentQuery = appointmentRepository.findById(id)
                .onItem().ifNull().failWith(() -> new AppointmentNotFoundException(id));

        return Uni.combine().all()
                .unis(patientQuery, clientQuery, veterinarianQuery, appointmentQuery)
                .with((patient, client, veterinarian, _) -> {
                    @SuppressWarnings("null")
                    var appointment = appointmentBuilder
                            .patient(patient)
                            .client(client)
                            .veterinarian(veterinarian)
                            .build();

                    return appointment;
                })
                .chain(appointmentRepository::persist)
                .map(appointmentMapper::toDto);
    }
}
