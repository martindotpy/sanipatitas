package dev.martindotpy.sanipatitas.shared.core.domain.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;

import com.github.f4b6a3.uuid.UuidCreator;

import lombok.Getter;

@Getter
@MappedSuperclass
public class EntityWithUuidV7 {
    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UuidCreator.getTimeOrderedEpoch();
        }
    }
}
