package dev.martindotpy.sanipatitas.shared.core.adapter.openapi;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.microprofile.openapi.OASFactory;
import org.eclipse.microprofile.openapi.OASFilter;
import org.eclipse.microprofile.openapi.models.OpenAPI;
import org.eclipse.microprofile.openapi.models.media.Content;
import org.eclipse.microprofile.openapi.models.media.MediaType;
import org.eclipse.microprofile.openapi.models.media.Schema;
import org.eclipse.microprofile.openapi.models.responses.APIResponse;
import org.eclipse.microprofile.openapi.models.responses.APIResponses;

public class ProblemDetailsRequiredFieldsFilter implements OASFilter {
    @Override
    public void filterOpenAPI(OpenAPI openApi) {
        // Update the refs in the paths to match the new schema names
        openApi.getPaths().getPathItems().forEach((path, pathItem) -> {
            if (pathItem.getOperations() != null) {
                pathItem.getOperations().forEach((_, operation) -> {
                    if (operation.getTags() == null) {
                        return;
                    }

                    var tags = new ArrayList<String>();

                    operation.getTags().forEach((tag) -> {
                        if (tag.endsWith(" Controller")) {
                            tags.add(tag.substring(0, tag.length() - 11));
                        } else {
                            tags.add(tag);
                        }
                    });

                    operation.setTags(tags);
                });
            }
        });

        // Make the required fields in the problem details schemas actually required
        openApi.getComponents().getSchemas().forEach((name, schema) -> {
            switch (name) {
                case "HttpProblem", "HttpValidationProblem" ->
                    schema.setRequired(List.of("status", "instance"));
                case "Violation" ->
                    schema.setRequired(List.of("field", "in", "message"));
                default -> {
                    break;
                }
            }
        });

        // Add 422 response to operations with input if not already defined
        APIResponse validationResponse = createValidationResponse();

        openApi.getPaths().getPathItems().forEach((path, pathItem) -> {
            pathItem.getOperations().forEach((_, operation) -> {
                boolean hasInput = (operation.getParameters() != null
                        && !operation.getParameters().isEmpty())
                        || operation.getRequestBody() != null;

                if (!hasInput) {
                    return;
                }

                APIResponses responses = operation.getResponses();

                if (responses == null) {
                    return;
                }

                responses.removeAPIResponse("400");

                if (responses.getAPIResponse("422") == null) {
                    responses.addAPIResponse("422", validationResponse);
                }
            });
        });
    }

    private APIResponse createValidationResponse() {
        Schema schema = OASFactory.createSchema()
                .ref("#/components/schemas/HttpValidationProblem");

        MediaType mediaType = OASFactory.createMediaType()
                .schema(schema);

        Content content = OASFactory.createContent()
                .addMediaType("application/json", mediaType);

        return OASFactory.createAPIResponse()
                .description("Constraint Violation")
                .content(content);
    }
}
