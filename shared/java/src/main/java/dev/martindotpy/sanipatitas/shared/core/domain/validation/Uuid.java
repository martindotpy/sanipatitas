package dev.martindotpy.sanipatitas.shared.core.domain.validation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import dev.martindotpy.sanipatitas.shared.core.adapter.validation.UuidStringValidator;
import dev.martindotpy.sanipatitas.shared.core.adapter.validation.UuidValidator;

@Target({ FIELD, PARAMETER })
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = { UuidStringValidator.class, UuidValidator.class })
public @interface Uuid {
    String message() default "debe ser un UUID válido";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
