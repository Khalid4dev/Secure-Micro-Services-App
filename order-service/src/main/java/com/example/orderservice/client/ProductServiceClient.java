package com.example.orderservice.client;

import com.example.orderservice.dto.ProductDTO;
import com.example.orderservice.exception.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ProductServiceClient {

    private final RestClient restClient;
    private final String productServiceUrl;

    public ProductServiceClient(RestClient.Builder builder,
            @Value("${application.config.product-service-url}") String productServiceUrl) {
        this.restClient = builder.build();
        this.productServiceUrl = productServiceUrl;
    }

    public ProductDTO getProductById(Long id) {
        String token = getToken();

        return restClient.get()
                .uri(productServiceUrl + "/{id}", id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .onStatus(status -> status.value() == 404, (request, response) -> {
                    throw new ProductNotFoundException("Product not found with id: " + id);
                })
                .body(ProductDTO.class);
    }

    private String getToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwt.getTokenValue();
        }
        throw new RuntimeException("JWT token not found in security context");
    }
}
