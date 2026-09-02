package com.example.backend.security;

import com.example.backend.exception.OperationType;
import com.example.backend.exception.TokenException;
import com.example.backend.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, TokenBlacklistService tokenBlacklistService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = jwtTokenProvider.getJwtFromCookies(request);
        if(StringUtils.hasText(token)){
            try{
                if(StringUtils.hasText(token) &&
                        jwtTokenProvider.validateToken(token) &&
                        !tokenBlacklistService.isTokenBlacklisted(token)){
                    TokenDetails tokenDetails = jwtTokenProvider.decodeToken(token);
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            tokenDetails.getUserId(),
                            null,
                            Collections.singleton(new SimpleGrantedAuthority(tokenDetails.getRole())));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }else{
                    throw new TokenException("Invalid or expired token.", OperationType.RETRIEVAL);
                }
            }catch (TokenException ex){
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("Token validation failed: " + ex.getMessage());
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

}