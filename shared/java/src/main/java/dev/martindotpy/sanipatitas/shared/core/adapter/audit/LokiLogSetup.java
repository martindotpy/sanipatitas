package dev.martindotpy.sanipatitas.shared.core.adapter.audit;

import java.util.logging.Level;
import java.util.logging.Logger;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.Initialized;
import jakarta.enterprise.event.Observes;

// Registers LokiLogHandler on the root JUL logger at startup
@ApplicationScoped
public class LokiLogSetup {

    private static final Logger ROOT = Logger.getLogger("");
    private static final String LOKI_ENABLED = System.getenv().getOrDefault("LOKI_ENABLED", "false");

    private LokiLogHandler handler;

    // CDI
    void onStart(@Observes @Initialized(ApplicationScoped.class) Object event) {
        if (!"true".equalsIgnoreCase(LOKI_ENABLED)) return;

        handler = new LokiLogHandler();
        handler.setLevel(Level.INFO);
        ROOT.addHandler(handler);
    }

    @PreDestroy
    void cleanup() {
        if (handler != null) {
            ROOT.removeHandler(handler);
            handler.close();
        }
    }
}
