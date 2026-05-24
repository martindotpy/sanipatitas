package dev.martindotpy.sanipatitas.shared.core.application.configuration;

import java.time.ZoneId;

public class TimeZoneConfiguration {
    public static final ZoneId ZONE_ID = System.getenv("TZ") != null ? ZoneId.of(System.getenv("TZ"))
            : ZoneId.systemDefault();
}
