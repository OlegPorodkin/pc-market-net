let productApi = Vue.resource("/products{/id}");

Vue.component("order-list",{
    props: [],
    template:
        '<div>' +
            '<a href="/bucket">Корзина</a>' +
            '<a></a>' +
        '</div>',

});

Vue.component('row-product', {
    props: ['product', 'prods',],
    data: function(){
      return{
          testProd:[]
      }
    },
    template:
        '<div>' +
            '<div hidden>{{product.id}}</div>' +
            '<h3>Название:</h3><br>{{product.name}}<br> ' +
            '<h3>Подтип товара:</h3><br>{{product.subcategory.name}}<br> ' +
            '<h3>Описание:</h3><br>{{product.description}}<br> ' +
            '<h3>Количество:</h3><br>{{product.count}}<br> ' +
            '<h3>Цена:</h3><br>{{product.price}}<br>' +
        '<hr>' +
        '<input type="button" value="Купить" @click="test(product)">' +
        '</div>',
    methods: {
        test: function (product) {
            this.testProd.push(product);
            console.log(this.testProd)
        }
    },
});

Vue.component('list-product', {
    props: ['prods', 'profile'],
    data: function(){
        return{
            product: null,
        }
    },
    template:
        '<div style="position: relative; width: 800px;">' +
        '<hr>' +
        'Комплектующие' +
        '<row-product v-for="product in prods" ' +
            ':key="product.id" ' +
            ':product="product" ' +
            ':prods="prods" ' +
        '/>' +
        '</div>',
});

let app = new Vue({
    el: '#app',
    template:
        '<div>' +
            '<a v-if="profile != null && profile.roles.includes(\'ADMIN\')">' +
                '<a href="/admin">Консоль администратора</a>' +
            '</a>'+
            '<a v-if="profile">{{ profile.username }}</a>' +
            '<a v-if="!profile" href="/login">Sign in</a> ' +
            '<a v-if="!profile" href="/registration">Sign up</a> ' +
            '<a v-if="profile" href="/logout">Logout</a> ' +
            '<order-list></order-list>' +
            '<list-product :profile="profile" :prods="products"/>' +
        '</div>',
    data: {
        products: productData.products,
        profile: productData.profile,
    },
});