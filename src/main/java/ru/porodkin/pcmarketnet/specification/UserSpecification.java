package ru.porodkin.pcmarketnet.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import ru.porodkin.pcmarketnet.entity.User;

@Component
public class UserSpecification {
    public Specification<User> findAll() {
        return (root, query, cb) -> cb.conjunction();
    }

    public Specification<User> byName(String user) {
        return (root, query, cb) -> {
            return cb.and(cb.like(root.get("username"), "%"+user+"%"));
        };
    }
}
