package com.example.orderservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
                .filter(jwtInterceptor())
                .build();
    }

    private ExchangeFilterFunction jwtInterceptor() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            String token = getToken();
            if (token != null) {
                ClientRequest newRequest = ClientRequest.from(clientRequest)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .build();
                return reactor.core.publisher.Mono.just(newRequest);
            }
            return reactor.core.publisher.Mono.just(clientRequest);
        });
    }

    private String getToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwt.getTokenValue();
        }
        return null;
    }
}
