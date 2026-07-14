package dev.martindotpy.sanipatitas.shared.inventory.domain.payload;

import org.jspecify.annotations.Nullable;

public interface UpdateSupplierPayload {
    String getName();
    @Nullable String getRuc();
    @Nullable String getContactName();
    @Nullable String getContactPhone();
    @Nullable String getEmail();
    @Nullable String getAddress();
}
