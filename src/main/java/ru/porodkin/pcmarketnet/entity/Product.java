package ru.porodkin.pcmarketnet.entity;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Length(max = 512, message = "Product name is to long(should not exceed 500 character)")
    @Column(name = "name")
    private String name;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "subcategory_id")
    private Subcategory subcategory;

    @Length(max = 4096, message = "Description to long(should not exceed 4K character)")
    @Column(name = "description")
    private String description;

    @Column(name = "count")
    private Long count;

    @NotNull
    @Column(name = "price")
    private Long price;

    @ManyToOne
    private Order order;

    @Column(name = "file_name")
    private String fileName;

    @Transient
    private byte[] file;
}
