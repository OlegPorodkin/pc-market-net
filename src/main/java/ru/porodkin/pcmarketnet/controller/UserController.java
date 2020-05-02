package ru.porodkin.pcmarketnet.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.service.UserService;

@RestController
@RequestMapping("/admin")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public User saveUser(@RequestBody User user){
        System.out.println("POST_METHOD");
        return userService.save(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable("id") User userFromDb, @RequestBody User user){
        System.out.println("PUT_METHOD");
        BeanUtils.copyProperties(user, userFromDb, "id");
        return userService.save(userFromDb);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable("id") User user){
        userService.delete(user);
    }

}
