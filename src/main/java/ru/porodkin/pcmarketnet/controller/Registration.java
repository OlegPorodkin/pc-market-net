package ru.porodkin.pcmarketnet.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.porodkin.pcmarketnet.entity.Role;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.repository.UserRepo;

import javax.validation.Validator;
import java.util.Collections;

@Controller
@RequestMapping("/registration")
public class Registration {
    private final UserRepo userRepo;
    private final Validator validator;

    public Registration(UserRepo userRepo, Validator validator) {
        this.userRepo = userRepo;
        this.validator = validator;
    }

    @GetMapping
    public String registration(){
        return "registration";
    }

    @PostMapping
    public String addUser(User user, Model model){
        System.out.println(user);

        User userFromDb = userRepo.findByUsername(user.getUsername());
        if (userFromDb != null){
            model.addAttribute("message", "User is exist!");
            return "registration";
        }

        if(!validator.validate(user).isEmpty()){
            if (!validator.validateProperty(user, "username").isEmpty()) {
                validator.validateProperty(user, "username")
                        .forEach(mess -> model.addAttribute("usernameMess", mess.getMessage()));
            }
            if (!validator.validateProperty(user, "password").isEmpty()) {
                validator.validateProperty(user, "password")
                        .forEach(mess -> model.addAttribute("passwordMess", mess.getMessage()));
            }
            if (!validator.validateProperty(user, "password2").isEmpty()) {
                validator.validateProperty(user, "password2")
                        .forEach(mess -> model.addAttribute("password2Mess", mess.getMessage()));
            }

            if (!validator.validateProperty(user, "email").isEmpty()) {
                validator.validateProperty(user, "email")
                        .forEach(mess -> model.addAttribute("emailMess", mess.getMessage()));
            }
            return "registration";
        }

        if (!user.getPassword().equals(user.getPassword2())){
            model.addAttribute("message", "Пароли не совпадают");
            return "registration";
        }

        user.setActive(true);
        user.setRoles(Collections.singleton(Role.USER));
        userRepo.save(user);

        return "redirect:/login";
    }
}
