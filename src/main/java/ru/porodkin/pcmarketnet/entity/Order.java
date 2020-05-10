package ru.porodkin.pcmarketnet.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@Entity(name = "ord")
public class Order implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Product> products;

    private String address;

    @Email
    @Column(name = "email")
    private String email;

    private ZonedDateTime orderDate;

    @ManyToOne(fetch = FetchType.EAGER)
    private User user;
}
