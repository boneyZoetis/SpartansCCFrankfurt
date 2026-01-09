package com.spartans.cricket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.boot.autoconfigure.domain.EntityScan(basePackages = "com.spartans.cricket.model")
@org.springframework.data.jpa.repository.config.EnableJpaRepositories(basePackages = "com.spartans.cricket.repository")
public class SpartansCricketApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpartansCricketApplication.class, args);
	}

}
