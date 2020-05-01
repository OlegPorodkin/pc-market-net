package ru.porodkin.pcmarketnet.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "subcategory_id")
    private Subcategory subcategory;

    @Column(name = "description")
    private String description;

    @Column(name = "count")
    private Long count;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

}
