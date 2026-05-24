package dev.martindotpy.sanipatitas.shared.client.domain.payload;

import org.jspecify.annotations.Nullable;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.IdType;

public interface UpdateClientPayload {
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
