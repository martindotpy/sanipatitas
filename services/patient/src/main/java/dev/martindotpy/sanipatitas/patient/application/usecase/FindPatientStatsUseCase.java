package dev.martindotpy.sanipatitas.patient.application.usecase;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import jakarta.enterprise.context.ApplicationScoped;

import dev.martindotpy.sanipatitas.shared.client.domain.repository.ClientRepository;
import dev.martindotpy.sanipatitas.shared.patient.application.dto.PatientStatsDto;
import dev.martindotpy.sanipatitas.shared.patient.application.port.FindPatientStatsPort;
import dev.martindotpy.sanipatitas.shared.patient.domain.repository.PatientRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import lombok.RequiredArgsConstructor;

@WithSession
@ApplicationScoped
@RequiredArgsConstructor
public final class FindPatientStatsUseCase implements FindPatientStatsPort {
    private final PatientRepository patientRepository;
    private final ClientRepository clientRepository;

    @Override
    public Uni<PatientStatsDto> getStats() {
        var todayStart = LocalDate.now().atStartOfDay(ZoneOffset.ofHours(-5)).toOffsetDateTime();
        var todayEnd = todayStart.plusDays(1);
        var monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneOffset.ofHours(-5)).toOffsetDateTime();

        Uni<Long> totalPatients = patientRepository.count();
        Uni<Long> patientsToday = patientRepository.count("createdAt >= ?1 and createdAt < ?2", todayStart, todayEnd);
        Uni<Long> patientsMonth = patientRepository.count("createdAt >= ?1 and createdAt < ?2", monthStart, todayEnd);
        Uni<Long> totalClients = clientRepository.count();

        return Uni.combine().all()
                .unis(totalPatients, patientsToday, patientsMonth, totalClients)
                .with((tp, pt, pm, tc) -> PatientStatsDto.builder()
                        .totalPatients(tp)
                        .patientsCreatedToday(pt)
                        .patientsCreatedThisMonth(pm)
                        .totalClients(tc)
                        .build());
    }
}
