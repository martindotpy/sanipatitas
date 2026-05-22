package dev.martindotpy.sanipatitas.shared.core.adapter.validation;

import java.util.UUID;

import jakarta.ws.rs.ext.ParamConverter;

public class UuidParamConverter implements ParamConverter<UUID> {
    @Override
    public UUID fromString(String value) {
        if (value == null) {
            return null;
        }

        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    @Override
    public String toString(UUID value) {
        return value != null ? value.toString() : null;
    }
}
