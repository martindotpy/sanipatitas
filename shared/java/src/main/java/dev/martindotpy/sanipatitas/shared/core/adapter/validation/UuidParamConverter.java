package dev.martindotpy.sanipatitas.shared.core.adapter.validation;

import java.util.UUID;

import jakarta.ws.rs.ext.ParamConverter;

import dev.martindotpy.sanipatitas.shared.core.application.utils.Patterns;

public class UuidParamConverter implements ParamConverter<UUID> {
    @Override
    public UUID fromString(String value) {
        if (value == null || !Patterns.UUID_PATTERN.matcher(value).matches()) {
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
