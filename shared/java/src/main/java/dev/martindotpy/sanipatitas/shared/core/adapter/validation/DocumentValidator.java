package dev.martindotpy.sanipatitas.shared.core.adapter.validation;

import java.util.regex.Pattern;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import dev.martindotpy.sanipatitas.shared.core.domain.enums.IdType;
import dev.martindotpy.sanipatitas.shared.core.domain.validation.ValidDocument;

public class DocumentValidator implements ConstraintValidator<ValidDocument, Object> {
    private static final Pattern DNI_PATTERN = Pattern.compile("^\\d{8}$");
    private static final Pattern CE_PATTERN = Pattern.compile("^[A-Za-z0-9]{9}$");
    private static final Pattern PASSPORT_PATTERN = Pattern.compile("^[A-Za-z0-9]{6,20}$");

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        try {
            var idTypeField = value.getClass().getDeclaredField("idType");
            var idNumberField = value.getClass().getDeclaredField("idNumber");

            idTypeField.setAccessible(true);
            idNumberField.setAccessible(true);

            var idNumber = (String) idNumberField.get(value);
            var idType = (IdType) idTypeField.get(value);

            if (idType == null || idNumber == null) {
                return true;
            }

            return switch (idType) {
                case DNI -> DNI_PATTERN.matcher(idNumber).matches();
                case CE -> CE_PATTERN.matcher(idNumber).matches();
                case PASSPORT -> PASSPORT_PATTERN.matcher(idNumber).matches();
            };
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return false;
        }
    }
}
