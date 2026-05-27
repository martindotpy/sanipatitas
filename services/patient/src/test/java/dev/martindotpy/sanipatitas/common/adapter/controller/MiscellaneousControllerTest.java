package dev.martindotpy.sanipatitas.common.adapter.controller;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class MiscellaneousControllerTest {
    @Test
    void testHelloEndpoint() {
        given()
                .when()
                .get("/q/health")
                .then()
                .statusCode(200)
                .body("status", is("UP"));
    }
}
