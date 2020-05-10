create sequence hibernate_sequence start 1 increment 1;

create table category
(
    id   int8 not null,
    name varchar(255),
    primary key (id)
);

create table ord
(
    id         bigserial not null,
    address    varchar(255),
    email      varchar(255),
    order_date timestamp,
    user_id    int8,
    primary key (id)
);

create table ord_products
(
    ord_id      int8 not null,
    products_id int8 not null
);

create table product
(
    id             int8         not null,
    count          int8,
    description    varchar(4096),
    file_name      varchar(255),
    name           varchar(512) not null,
    price          int8         not null,
    order_id       int8,
    subcategory_id int8         not null,
    primary key (id)
);

create table subcategory
(
    id          int8 not null,
    name        varchar(255),
    category_id int8,
    primary key (id)
);

create table user_role
(
    user_id int8 not null,
    roles   varchar(255)
);

create table usr
(
    id       int8    not null,
    active   boolean not null,
    address  varchar(255),
    email    varchar(255),
    password varchar(255),
    username varchar(255),
    primary key (id)
);

create table usr_orders
(
    user_id   int8 not null,
    orders_id int8 not null
);

alter table if exists ord_products
    add constraint UK_ord_products_products_id unique (products_id);

alter table if exists usr_orders
    add constraint UK_usr_orders_orders_id unique (orders_id);

alter table if exists ord
    add constraint ord_user_id foreign key (user_id) references usr;

alter table if exists ord_products
    add constraint ord_products_products_id foreign key (products_id) references product;

alter table if exists ord_products
    add constraint ord_products_ord_id foreign key (ord_id) references ord;

alter table if exists product
    add constraint product_order_id foreign key (order_id) references ord;

alter table if exists product
    add constraint product_subcategory_id foreign key (subcategory_id) references subcategory;

alter table if exists subcategory
    add constraint subcategory_category_id foreign key (category_id) references category;

alter table if exists user_role
    add constraint user_role_user_id foreign key (user_id) references usr;

alter table if exists usr_orders
    add constraint usr_orders_orders_id foreign key (orders_id) references ord;

alter table if exists usr_orders
    add constraint usr_orders_user_id foreign key (user_id) references usr;