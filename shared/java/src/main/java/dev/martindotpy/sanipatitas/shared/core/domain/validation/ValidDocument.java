package dev.martindotpy.sanipatitas.shared.core.domain.validation;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = DocumentValidator.class)
@Documented
public @interface ValidDocument {
    String message() default "El número de documento no es válido para el tipo seleccionado";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
