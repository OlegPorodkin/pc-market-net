package ru.porodkin.pcmarketnet.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Data
@Entity(name = "ord")
public class Order implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToMany(mappedBy = "order")
    private Set<Product> products;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
