package dev.martindotpy.sanipatitas.appointment.application.service;

import java.util.concurrent.atomic.AtomicReference;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.subscription.BackPressureStrategy;
import io.smallrye.mutiny.subscription.MultiEmitter;

@ApplicationScoped
public class AppointmentEventService {
    private final AtomicReference<MultiEmitter<? super AppointmentEvent>> emitterRef = new AtomicReference<>();
    private volatile Multi<AppointmentEvent> stream;

    @PostConstruct
    void init() {
        this.stream = Multi.createFrom().<AppointmentEvent>emitter(
                emitter -> emitterRef.set(emitter),
                BackPressureStrategy.BUFFER).broadcast().toAllSubscribers();
    }

    public Multi<AppointmentEvent> stream() {
        return stream;
    }

    public void publish(AppointmentEvent event) {
        var emitter = emitterRef.get();
        if (emitter != null) {
            emitter.emit(event);
        }
    }
}
