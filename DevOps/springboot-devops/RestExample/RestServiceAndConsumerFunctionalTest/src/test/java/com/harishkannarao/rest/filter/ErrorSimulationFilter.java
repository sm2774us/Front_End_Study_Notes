package com.harishkannarao.rest.filter;

import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ErrorSimulationFilter extends OncePerRequestFilter {
    public static final String NAME = "errorSimulationFilterBean";
    public static final String PATH = "/simulate-filter-error";

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) {
        throw new RuntimeException("artificial exception simulation outside controller");
    }
}
