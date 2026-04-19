package dev.martindotpy.sanipatitas.core.adapter.controller;

import org.eclipse.microprofile.openapi.annotations.Operation;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/")
public class MiscellaneousController {
    @GET
    @Path("/_health")
    @Operation(hidden = true)
    public String hello() {
        return "Ok";

    }
}
