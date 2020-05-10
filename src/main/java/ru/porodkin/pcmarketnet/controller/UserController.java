package ru.porodkin.pcmarketnet.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.service.UserService;

@RestController
@RequestMapping("/admin")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    public User saveUser(@RequestBody User user) {
        String password = user.getPassword();
        user.setPassword(passwordEncoder.encode(password));
        return userService.save(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable("id") User userFromDb, @RequestBody User user) {
        BeanUtils.copyProperties(user, userFromDb, "id", "password");


        if (userFromDb.getPassword().equals(user.getPassword())){
            userFromDb.setPassword(user.getPassword());
        }else {
            userFromDb.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        System.out.println(user.getPassword());
        System.out.println(userFromDb.getPassword());

        return userService.save(userFromDb);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable("id") User user) {
        userService.delete(user);
    }

}
