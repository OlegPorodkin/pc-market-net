let productApi = Vue.resource("/products{/id}");

function sortedProductFromArr(list, index){
    let result = [];
    for (let i = 0; i < list.length; i++) {
        if(list[i].subcategory.category.id === index){
            result.push(list[i])
        }
    }
    return result;
}

Vue.component("order-list",{
    data: function(){
        return{
            productsOrder:[]
        }
    },
    template:
        '<div>' +
            // '<a type="button" href="/order">Корзина</a>' +
        '    <form action="/order" method="get">' +
        '       <button type="submit" class="btn btn-primary">Корзина' +
        '       <span class="badge badge-light">{{ productsOrder.length }}</span>' +
        '       </button>' +
        '    </form>' +
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
        '<div class="card mb-2">' +
        '<div hidden>{{product.id}}</div>' +
        '   <h5 class="card-header">' +
        '       {{product.name}}' +
        '   </h5>' +
        '   <div class="card-body">' +
        '       <h5 class="card-title">{{product.subcategory.name}}</h5> ' +
        '       <p class="card-text">{{product.description}}</p> ' +
        '       <a href="" class="btn btn-primary"  @click="saveProduct(product)">Купить</a>' +
        '   </div>' +
        '   <div class="card-footer">' +
        '       <h5 class="card-title">{{product.price}} &#8381</h5>' +
        '   </div>' +
        '</div>',
});

Vue.component('list-product', {
    props: ['prods', 'profile', 'saveProduct', 'category'],
    data: function(){
        return{
            product: null,
        }
    },
    template:
        '<div>' +
            '<h4>{{ category.name }}</h4>' +
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
        '<nav class="navbar navbar-expand-lg navbar-light bg-light">' +
        // '    <a class="navbar-brand" href="/">PC Market</a>' +
        '    <div class="btn-group">' +
        '       <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '           PC Market' +
        '       </button>' +
        '       <div class="dropdown-menu">' +
        '           <a class="dropdown-item" v-for="category in cats" @click="initCat(category)">{{ category.name }}</a>' +
        '       </div>' +
        '    </div>' +
        '    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">' +
        '        <span class="navbar-toggler-icon"></span>' +
        '    </button>' +
        '    <div class="collapse navbar-collapse" id="navbarSupportedContent">' +
        '        <ul class="navbar-nav mr-auto">' +
        '            <li class="nav-item">' +
        '                <a class="nav-link" href="/">Главная</a>' +
        '            </li>' +
        '            <li class="nav-item">' +
        '                <a class="nav-link" v-if="!profile" href="/login">Авторизация</a> ' +
        '            </li>' +
        '            <li class="nav-item">' +
        '                <a class="nav-link" v-if="!profile" href="/registration">Регистрация</a>' +
        '            </li>' +
        '            <li class="nav-item">' +
        '                <a class="nav-link" v-if="profile != null && (profile.roles.includes(\'ADMIN\') || profile.roles.includes(\'SUPER_ADMIN\'))" href="/admin">Консоль администратора</a>' +
        '            </li>' +
        '        </ul>' +
        '        <span v-if="profile" class="navbar-text mr-3">{{ profile.username }}</span>' +
        '        <span v-else class="navbar-text mr-3">unknown</span>' +
        '        <form v-if="profile" action="/logout" method="post">' +
        '           <button type="submit" class="btn btn-primary mr-3">Выйти</button>' +
        '        </form>' +
        '        <order-list/>' +
        '    </div>' +
        '</nav>' +
        '<div class="container mt-3">' +
        '   <span v-if="!sortProduct">' +
        '       <div class="list-group">' +
        '           <a class="list-group-item list-group-item-action list-group-item-secondary" v-for="category in cats" @click="initCat(category)">{{ category.name }}</a>' +
        '       </div>' +
        '   </span>' +
        '   <span v-else>' +
        '        <list-product :saveProduct="buy" :profile="profile" :category="category" :prods="sortProduct"/>' +
        '   </span>' +
        '</div>' +
        '</div>',
    data: {
        category:'',
        productsOrder:[],
        ordersList:{
            products: [],
            address: '',
            email: '',
            user: null,
        },
        sortProduct:'',
        products: productData.products,
        profile: productData.profile,
        subcats: productData.subcat,
        cats: productData.cat,
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
        initCat: function(cat){
            this.category = cat;
            this.sortProduct = sortedProductFromArr(this.products, this.category.id);
        },
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