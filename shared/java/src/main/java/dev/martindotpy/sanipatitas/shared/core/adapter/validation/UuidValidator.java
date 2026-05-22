package dev.martindotpy.sanipatitas.shared.core.adapter.validation;

import java.util.UUID;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;

public class UuidValidator implements ConstraintValidator<Uuid, UUID> {
    @Override
    public boolean isValid(UUID value, ConstraintValidatorContext context) {
        return value != null;
    }
}
