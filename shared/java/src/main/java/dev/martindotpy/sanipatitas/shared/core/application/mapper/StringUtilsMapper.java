package dev.martindotpy.sanipatitas.shared.core.application.mapper;

public class StringUtilsMapper {
    public static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
