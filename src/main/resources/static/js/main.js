let productApi = Vue.resource("/products{/id}");

Vue.component("order-list",{
    data: function(){
        return{
            productsOrder:[]
        }
    },
    template:
        '<div>' +
            '<a type="button" href="/order">Корзина</a><label content="productsOrder.length">{{ [productsOrder.length] }}</label>' +
            '<a></a>' +
        '</div>',
    mounted() {
        if (localStorage.getItem('productsOrder')) {
            try {
                this.productsOrder = JSON.parse(localStorage.getItem('productsOrder'));
            } catch(e) {
                localStorage.removeItem('productsOrder');
            }
        }
    },
});

Vue.component('row-product', {
    props: ['product', 'prods', 'saveProduct'],
    data: function(){
      return{
          products: []
      }
    },
    template:
        '<div>' +
        '<div hidden>{{product.id}}</div>' +
        'Название: {{product.name}}<br> ' +
        'Подтип товара: {{product.subcategory.name}}<br> ' +
        'Описание: {{product.description}}<br> ' +
        // 'Количество: {{product.count}}<br> ' +
        'Цена: {{product.price}}<br>' +
        '<input type="button" value="Купить" @click="saveProduct(product)">' +
        '<hr>' +
        '</div>',
});

Vue.component('list-product', {
    props: ['prods', 'profile', 'saveProduct'],
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
                ':saveProduct="saveProduct" ' +
                ':product="product" ' +
                ':prods="prods" />' +
        '</div>',
});

let app = new Vue({
    el: '#app',
    template:
        '<div>' +
            '<a v-if="profile != null && (profile.roles.includes(\'ADMIN\') || profile.roles.includes(\'SUPER_ADMIN\'))">' +
                '<a href="/admin">Консоль администратора</a>' +
            '</a>'+
            '<a v-if="profile">{{ profile.username }}</a>' +
            '<a v-if="!profile" href="/login">Sign in</a> ' +
            '<a v-if="!profile" href="/registration">Sign up</a> ' +
            '<a v-if="profile" href="/logout">Logout</a> ' +

            '<order-list />' +
            '<list-product :saveProduct="buy" :profile="profile" :prods="products"/>' +
        '</div>',
    data: {
        productsOrder:[],
        ordersList:{
            products: [],
            address: '',
            email: '',
            user: null,
        },
        products: productData.products,
        profile: productData.profile,
    },
    mounted() {
        if (localStorage.getItem('productsOrder')) {
            try {
                this.productsOrder = JSON.parse(localStorage.getItem('productsOrder'));
            } catch(e) {
                localStorage.removeItem('productsOrder');
            }
        }
    },
    methods: {
        buy: function (product) {
            this.productsOrder.push(product);
            this.saveProds();
        },
        saveProds() {
            const parsed = JSON.stringify(this.productsOrder);
            localStorage.setItem('productsOrder', parsed);
        }
    },
});