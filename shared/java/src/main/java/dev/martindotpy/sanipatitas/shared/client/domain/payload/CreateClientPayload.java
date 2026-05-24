package dev.martindotpy.sanipatitas.shared.client.domain.payload;

import java.util.UUID;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.IdType;

public interface CreateClientPayload {
    @Nullable
    UUID getId();

    String getFirstName();

    String getLastName();

    IdType getIdType();

    String getIdNumber();

    String getPhone();

    @Nullable
    String getPhoneAlt();

    @Nullable
    String getEmail();

    @Nullable
    String getAddress();

    @Nullable
    String getNotes();
}
