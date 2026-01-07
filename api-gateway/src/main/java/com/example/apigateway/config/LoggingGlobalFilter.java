package com.example.apigateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class LoggingGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis();

        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication().getPrincipal())
                .cast(Jwt.class)
                .map(jwt -> {
                    String username = jwt.getClaimAsString("preferred_username");
                    return username != null ? username : jwt.getSubject();
                })
                .defaultIfEmpty("anonymous")
                .flatMap(username -> {
                    String traceId = java.util.UUID.randomUUID().toString();
                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(exchange.getRequest().mutate().header("X-Trace-Id", traceId).build())
                            .build();

                    log.info("Gateway Request: traceId={} method={} path={} user={}",
                            traceId, exchange.getRequest().getMethod(), exchange.getRequest().getURI().getPath(),
                            username);

                    return chain.filter(mutatedExchange).then(Mono.fromRunnable(() -> {
                        long duration = System.currentTimeMillis() - startTime;
                        log.info("Gateway Response: traceId={} method={} path={} status={} duration={}ms user={}",
                                traceId,
                                exchange.getRequest().getMethod(),
                                exchange.getRequest().getURI().getPath(),
                                exchange.getResponse().getStatusCode(),
                                duration,
                                username);
                    }));
                });
    }

    @Override
    public int getOrder() {
        return -1; // Run early
    }
}
