package ru.porodkin.pcmarketnet.entity;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
public class Category implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Length(max = 255, message = "Category name is to long(should not exceed 255 character)")
    @Column(name = "name")
    private String name;
}
