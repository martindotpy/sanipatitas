package dev.martindotpy.sanipatitas.shared.core.domain.validation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import dev.martindotpy.sanipatitas.shared.core.adapter.validation.PeruPhoneValidator;

@Target({ FIELD, PARAMETER })
@Retention(RUNTIME)
@Constraint(validatedBy = PeruPhoneValidator.class)
@Documented
public @interface PeruPhone {
    String message() default "debe ser un número de teléfono móvil peruano válido (9XXXXXXXX)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
