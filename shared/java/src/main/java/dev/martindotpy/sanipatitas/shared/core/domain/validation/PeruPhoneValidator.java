package dev.martindotpy.sanipatitas.shared.core.domain.validation;

import java.util.regex.Pattern;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PeruPhoneValidator implements ConstraintValidator<PeruPhone, String> {
    private static final Pattern PHONE_PATTERN = Pattern.compile("^9\\d{8}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }
        return PHONE_PATTERN.matcher(value.strip()).matches();
    }
}
