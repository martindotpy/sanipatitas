package dev.martindotpy.sanipatitas.shared.core.adapter.converter;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.UUID;

import jakarta.ws.rs.ext.ParamConverter;
import jakarta.ws.rs.ext.ParamConverterProvider;
import jakarta.ws.rs.ext.Provider;

@Provider
public class UuidParamConverterProvider implements ParamConverterProvider {
    private final UuidParamConverter converter = new UuidParamConverter();

    @Override
    @SuppressWarnings("unchecked")
    public <T> ParamConverter<T> getConverter(Class<T> rawType, Type genericType, Annotation[] annotations) {
        if (rawType == UUID.class) {
            return (ParamConverter<T>) converter;
        }

        return null;
    }
}
