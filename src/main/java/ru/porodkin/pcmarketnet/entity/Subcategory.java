package ru.porodkin.pcmarketnet.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Subcategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
