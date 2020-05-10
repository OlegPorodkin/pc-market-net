insert into usr (active, email, username, password, id)
values (true, 'test_super_admin@test.tu', 'superadmin', 'sa', 1);
insert into user_role (user_id, roles)
values (1, 'SUPER_ADMIN');