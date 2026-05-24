package dev.martindotpy.sanipatitas.client.application.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import dev.martindotpy.sanipatitas.shared.client.application.dto.ClientDto;
import dev.martindotpy.sanipatitas.shared.client.domain.entity.Client;
import dev.martindotpy.sanipatitas.shared.client.domain.payload.CreateClientPayload;
import dev.martindotpy.sanipatitas.shared.client.domain.payload.UpdateClientPayload;
import dev.martindotpy.sanipatitas.shared.core.application.mapper.StringUtilsMapper;

@Mapper(componentModel = "cdi", uses = { StringUtilsMapper.class })
public interface ClientMapper {
    @ObjectFactory
    default Client.ClientBuilder<?, ?> createClient() {
        return Client.builder();
    }

    ClientDto toDto(Client client);

    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Client.ClientBuilder<?, ?> from(CreateClientPayload payload);

    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Client.ClientBuilder<?, ?> from(UUID id, UpdateClientPayload payload);
}
