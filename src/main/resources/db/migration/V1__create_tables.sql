create sequence hibernate_sequence start 1 increment 1;

create table category
(
    id   int8 not null,
    name varchar(255),
    primary key (id)
);

create table product
(
    id             int8 not null,
    count          int8,
    description    varchar(255),
    name           varchar(255),
    type           varchar(255),
    subcategory_id int8,
    primary key (id)
);

create table subcategory
(
    id          int8 not null,
    name        varchar(255),
    category_id int8,
    primary key (id)
);

alter table if exists product
    add constraint product_subcategory_id
    foreign key (subcategory_id) references subcategory;

alter table if exists subcategory
    add constraint subcategory_category_id
    foreign key (category_id) references category;
