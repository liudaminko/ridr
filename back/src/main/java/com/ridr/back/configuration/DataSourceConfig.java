package com.ridr.back.configuration;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    @Primary
    @Bean(name = "db1DataSource")
    @ConfigurationProperties(prefix = "spring.datasource.db1")
    public DataSource db1DataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "db2DataSource")
    @ConfigurationProperties(prefix = "spring.datasource.db2")
    public DataSource db2DataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "db3DataSource")
    @ConfigurationProperties(prefix = "spring.datasource.db3")
    public DataSource db3DataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    public JdbcTemplate jdbcTemplate1(@Qualifier("db1DataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean
    public JdbcTemplate jdbcTemplate2(@Qualifier("db2DataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
    @Bean
    public JdbcTemplate jdbcTemplate3(@Qualifier("db3DataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
