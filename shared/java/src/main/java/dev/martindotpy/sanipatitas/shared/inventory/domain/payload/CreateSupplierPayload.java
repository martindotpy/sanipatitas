package dev.martindotpy.sanipatitas.shared.inventory.domain.payload;

import java.util.UUID;

import org.jspecify.annotations.Nullable;

public interface CreateSupplierPayload {
    @Nullable UUID getId();
    String getName();
    @Nullable String getRuc();
    @Nullable String getContactName();
    @Nullable String getContactPhone();
    @Nullable String getEmail();
    @Nullable String getAddress();
}
