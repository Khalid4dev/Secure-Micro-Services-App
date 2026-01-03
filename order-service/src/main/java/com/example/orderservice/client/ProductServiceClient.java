package com.example.orderservice.client;

import com.example.orderservice.dto.ProductDTO;
import com.example.orderservice.exception.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ProductServiceClient {

    private final WebClient webClient;
    private final String productServiceUrl;

    public ProductServiceClient(WebClient webClient,
            @Value("${application.config.product-service-url}") String productServiceUrl) {
        this.webClient = webClient;
        this.productServiceUrl = productServiceUrl;
    }

    public ProductDTO getProductById(Long id) {
        try {
            return webClient.get()
                    .uri(productServiceUrl + "/" + id)
                    .retrieve()
                    .bodyToMono(ProductDTO.class)
                    .block(); // Blocking for synchronous flow as requested
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new ProductNotFoundException("Product not found with id: " + id);
            } else if (e.getStatusCode() == HttpStatus.FORBIDDEN || e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "inter-service auth failed");
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error calling product-service", e);
        }
    }
}
