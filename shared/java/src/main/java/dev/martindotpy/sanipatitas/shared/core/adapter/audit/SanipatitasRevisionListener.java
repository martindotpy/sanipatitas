package dev.martindotpy.sanipatitas.shared.core.adapter.audit;

import org.hibernate.envers.RevisionListener;
import org.jboss.logging.Logger;

import jakarta.enterprise.inject.spi.CDI;

public class SanipatitasRevisionListener implements RevisionListener {

    private static final Logger log = Logger.getLogger("sanipatitas.audit.revision");

    @Override
    public void newRevision(Object revisionEntity) {
        if (!(revisionEntity instanceof SanipatitasRevisionEntity rev)) {
            return;
        }

        try {
            var token = CDI.current().select(
                    org.eclipse.microprofile.jwt.JsonWebToken.class).get();
            rev.setUsername(token.getSubject() != null ? token.getSubject() : "anonymous");
            rev.setRole(token.getClaim("role") != null
                    ? token.getClaim("role").toString()
                    : "unknown");
        } catch (Exception e) {
            log.debugf("Could not resolve user for audit revision: %s", e.getMessage());
            rev.setUsername("anonymous");
            rev.setRole("unknown");
        }
    }
}
