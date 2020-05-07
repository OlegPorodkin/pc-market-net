package ru.porodkin.pcmarketnet.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import ru.porodkin.pcmarketnet.entity.Order;
import ru.porodkin.pcmarketnet.entity.Role;
import ru.porodkin.pcmarketnet.entity.User;

import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.Date;

@Component
public class OrderSpecification {

    public Specification<Order> byEmail(String email){
        return (root, query, cb) -> {
            return cb.and(cb.like(root.get("email"), "%"+email+"%"));
        };
    };

    public Specification<Order> byAddress(String address){
        return (root, query, cb) -> {
            return cb.and(cb.like(root.get("address"), "%"+address+"%"));
        };
    };

    public Specification<Order> byTimeAfter(String timeAfter){

        LocalDate date = LocalDate.parse(timeAfter);
        System.out.println(date.atStartOfDay(ZoneId.systemDefault()));

        return (root, query, cb) -> {
            return cb.and(
                    cb.lessThanOrEqualTo(
                            root.get("orderDate"), date.atStartOfDay(ZoneId.systemDefault())
                    )
            );
        };
    };

    public Specification<Order> byTimeBefore(String timeBefore){

        LocalDate date = LocalDate.parse(timeBefore);
        System.out.println(date.atStartOfDay(ZoneId.systemDefault()));

        return (root, query, cb) -> {
            return cb.and(
                    cb.greaterThanOrEqualTo(
                            root.get("orderDate"), date.atStartOfDay(ZoneId.systemDefault())
                    )
            );
        };
    };

    public Specification<Order> byUserName(String userName){
        return (root, query, cb) -> {
            query.distinct(true);

            Root<Order> order = root;

            Subquery<User> userSubquery = query.subquery(User.class);
            Root<User> user = userSubquery.from(User.class);

            Expression<Collection<Order>> userOrders = user.get("orders");
            userSubquery.select(user);

            userSubquery.where(cb.equal(user.get("username"),userName), cb.isMember(order, userOrders));

            return cb.exists(userSubquery);
        };
    };

    public Specification<Order> findAll() {
        return (root, query, cb) -> cb.conjunction();
    }
}
