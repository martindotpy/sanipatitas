package dev.martindotpy.sanipatitas.appointment.application.service;

import java.util.UUID;

public record AppointmentEvent(UUID appointmentId, AppointmentEvent.Type type) {
    public enum Type {
        CREATED, UPDATED, DELETED
    }
}
