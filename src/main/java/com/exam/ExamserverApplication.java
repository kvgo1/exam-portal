package com.exam;

import com.exam.model.Role;
import com.exam.model.User;
import com.exam.model.UserRole;
import com.exam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.sql.SQLOutput;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class ExamserverApplication implements CommandLineRunner {
	@Autowired
  private UserService userService;
    //@Autowired
	//private BCryptPasswordEncoder bCryptPasswordEncoder;

	public static void main(String[] args) {

		SpringApplication.run(ExamserverApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {


		  System.out.println("starting code");
		// Delete existing admin user if exists
		try {
			User existingUser = userService.getUser("admin");
			if (existingUser != null) {
				userService.deleteUser(existingUser.getId());
				System.out.println("Deleted existing admin user");
			}
		} catch (Exception e) {
			System.out.println("No existing admin user found");
		}
		  User user = new User();

		// Instead of creating new Role, use existing one
		Role role1 = userService.getRoleByName("ADMIN");
		if (role1 == null) {
			role1 = new Role();
			role1.setRoleName("ADMIN");
		}

// Remove the line: role1.setRoleId(44L); // Don't set ID manually
		//Role role1 = new Role();
		//role1.setRoleId(44L);
		//role1.setRoleName("ADMIN");


		user.setFirstname("kavya");
		  user.setLastname("Verma");
		  user.setUsername("admin");
		  //user.setPassword(this.bCryptPasswordEncoder.encode("123"));
		user.setPassword("123");
		  user.setEmail("kavya78388@gmail.com");
		  user.setProfile("default.png");


		  Set<UserRole> userRoleSet = new HashSet<>();
		  UserRole userRole = new UserRole();
		  userRole.setRole(role1);
		  userRole.setUser(user);

		  userRoleSet.add(userRole);
		  User user1 = this.userService.createUser(user, userRoleSet);
		  System.out.println(user1.getUsername());

		//System.out.println("Stored password: " + user1.getPassword());
		//System.out.println("Match with 123? " + bCryptPasswordEncoder.matches("123", user1.getPassword()));



	}
}
