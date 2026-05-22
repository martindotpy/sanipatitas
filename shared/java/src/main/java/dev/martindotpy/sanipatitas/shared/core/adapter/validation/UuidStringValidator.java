package dev.martindotpy.sanipatitas.shared.core.adapter.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import dev.martindotpy.sanipatitas.shared.core.application.utils.Patterns;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.Uuid;

public class UuidStringValidator implements ConstraintValidator<Uuid, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        try {
            return Patterns.UUID_PATTERN.matcher(value).matches();
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
