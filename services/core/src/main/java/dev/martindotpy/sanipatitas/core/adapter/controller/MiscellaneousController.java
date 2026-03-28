package dev.martindotpy.sanipatitas.core.adapter.controller;

import org.eclipse.microprofile.openapi.annotations.extensions.Extension;

import dev.martindotpy.sanipatitas.shared.domain.model.HelloWorld;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/")
@Extension(name = "x-smallrye-profile-internal", value = "")
public class MiscellaneousController {
    @GET
    @Path("/_health")
    public String hello() {
        return "Ok";

    }

    @GET
    @Path("/hello")
    public HelloWorld helloWorld() {
        return new HelloWorld("Hello World");
    }
}
