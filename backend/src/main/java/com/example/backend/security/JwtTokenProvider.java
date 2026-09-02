package com.example.backend.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.example.backend.exception.OperationType;
import com.example.backend.exception.TokenException;
import com.example.backend.model.Role;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpiration}")
    private int jwtExpiration;

    public String generateToken(Long id, Role role){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return JWT.create()
                .withSubject(id.toString())
                .withIssuedAt(now)
                .withExpiresAt(expiryDate)
                .withClaim("role", role.getName())
                .sign(Algorithm.HMAC512(jwtSecret));
    }

    public Boolean validateToken(String token){
        try{
            Algorithm algorithm = Algorithm.HMAC512(jwtSecret);
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(token);
            return true;
        }catch(JWTVerificationException ex){
            throw new TokenException("Invalid token: " + ex.getMessage(), OperationType.RETRIEVAL);
        }
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("TOKEN")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public LocalDateTime getExpiryFromToken(String token) {
        DecodedJWT jwt = JWT.require(Algorithm.HMAC512(jwtSecret.getBytes()))
                .build()
                .verify(token);
        Date expiryDate = jwt.getExpiresAt();
        return expiryDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    public TokenDetails decodeToken(String token){
        try{
            DecodedJWT jwt = JWT.require(Algorithm.HMAC512(jwtSecret.getBytes()))
                    .build()
                    .verify(token);

            return new TokenDetails(
                    Long.parseLong(jwt.getSubject()),
                    jwt.getClaim("role").asString()
            );
        }catch (JWTVerificationException ex){
            throw new TokenException("Failed to decode token", OperationType.RETRIEVAL);
        }
    }
}
