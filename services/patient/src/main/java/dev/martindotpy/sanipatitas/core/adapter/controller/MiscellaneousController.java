package dev.martindotpy.sanipatitas.core.adapter.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

import org.eclipse.microprofile.openapi.annotations.Operation;

@Path("/")
public class MiscellaneousController {
    @GET
    @Path("/_health")
    @Operation(hidden = true)
    public String hello() {
        return "Ok";

    }
}
