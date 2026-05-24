package dev.martindotpy.sanipatitas.appointment.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.appointment.application.dto.AppointmentDto;
import dev.martindotpy.sanipatitas.shared.appointment.domain.entity.Appointment;
import dev.martindotpy.sanipatitas.shared.appointment.domain.payload.CreateAppointmentPayload;
import dev.martindotpy.sanipatitas.shared.appointment.domain.payload.UpdateAppointmentPayload;
import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface AppointmentMapper {
    @ObjectFactory
    default Appointment.AppointmentBuilder<?, ?> createAppointment() {
        return Appointment.builder();
    }

    AppointmentDto toDto(Appointment appointment);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Appointment.AppointmentBuilder<?, ?> from(CreateAppointmentPayload payload);

    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "veterinarian", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Appointment.AppointmentBuilder<?, ?> from(UUID id, UpdateAppointmentPayload payload);
}
