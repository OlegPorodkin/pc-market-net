let productApi = Vue.resource("/products{/id}");
let subcategoriesApi = Vue.resource("/subcategories{/id}");

function getIndex(list, id) {
    for (let i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

Vue.component('add-product', {
    props: ['products', 'productAttr'],
    data: function () {
        return {
            id:'',
            subcategories: [],
            name: '',
            description: '',
            subcategory: null,
            count: '',
            price: '',
            files: [],
        }
    },
    watch:{
        productAttr: function (newVal, oldVal) {
            this.id = newVal.id;
            this.name = newVal.name;
            this.description = newVal.description;
            this.count = newVal.count;
            this.price = newVal.price;
            this.subcategory = newVal.subcategory;
        }
    },
    template:
        '<div>' +
        '   <div class="form-group">' +
        '       <label for="nameProduct">Название продукта:</label>' +
        '       <input type="text" class="form-control" id="nameProduct" placeholder="Название продукта" v-model="name"/>' +
        '   </div>' +
        '   <div class="form-group">' +
        '       <label for="description">Описание:</label>' +
        '       <textarea type="text" class="form-control" id="description" placeholder="Описание" v-model="description" rows="3"/>' +
        '   </div>' +
        '   <div class="form-group">' +
        '   <label for="controlSelect">Выберите категорию товара:</label>' +
        '   <select class="form-control" v-model="subcategory">' +
        '       <option v-for="sub in subcategories" :value="sub">{{ sub.name }}</option>' +
        '   </select>' +
        '   </div>' +
        '   <div class="form-group">' +
        '       <label for="count">Ведите кол-во:</label>' +
        '       <input type="number" class="form-control" id="count" placeholder="Количество" v-model="count"/>' +
        '   </div>' +
        '   <div class="form-group">' +
        '       <label for="price">Ведите цену:</label>' +
        '       <input type="number" class="form-control" id="price" placeholder="Цена" v-model="price"/>' +
        '   </div>' +
        '   <a href="" class="btn btn-primary" @click="save">Добавить</a>' +
        '</div>',
    created: function () {
        subcategoriesApi.get().then(result => {
            result.json().then(
                data => data.forEach(d => this.subcategories.push(d))
            )
        })
    },
    methods: {
        previewFiles() {
            this.files = this.$refs.myFiles.files
        },
        save: function () {
            let product = {
                name: this.name,
                description: this.description,
                count: this.count,
                price: this.price,
                subcategory: {
                    id: this.subcategory.id,
                },
                file: this.file
            };

            if (this.id){
                productApi.update({id: this.id}, product).then(result => {
                    result.json().then(data => {
                        let index = getIndex(this.products, data.id);
                        this.products.splice(index, 1, data);
                        this.id = '';
                        this.name = '';
                        this.description = '';
                        this.subcategory = null;
                        this.count = '';
                        this.price = '';
                    })
                })
            }else {
                console.log(this.file);
                productApi.save({}, product).then(
                    result => result.json().then(data => {
                        this.products.push(data);
                        this.id = '';
                        this.name = '';
                        this.description = '';
                        this.subcategory = null;
                        this.count = '';
                        this.price = '';
                    })
                )
            }
        }
    },
});

Vue.component('row-product', {
    props: ['product', 'prods', 'editProduct'],
    template:
        '<div class="card mb-2">' +
        '   <div hidden>{{product.id}}</div>' +
        '   <h5 class="card-header">' +
        '       {{product.name}}' +
        '   </h5>' +
        '   <div class="card-body">' +
        '       <h5 class="card-title">{{product.subcategory.name}}</h5> ' +
        '       <p>' +
        '           <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">\n' +
        '           Описание товара' +
        '           </button>' +
        '       </p>' +
        '       <div class="collapse" id="collapseExample">' +
        '           <div class="card card-body">' +
        '               {{product.description}}' +
        '           </div>' +
        '       </div> ' +
        '       <p class="card-text">Количество: {{product.count}}</p> ' +
        '       <button class="btn btn-primary"  @click="edit">Редактировать</button>' +
        '       <button class="btn btn-secondary"  @click="del">Удалить</button>' +
        '   </div>' +
        '   <div class="card-footer">' +
        '       <h5 class="card-title">{{product.price}} &#8381</h5>' +
        '   </div>' +
        '</div>',
    methods: {
        edit:function () {
            this.editProduct(this.product);
        },
        del:function () {
            productApi.remove({id: this.product.id}).then(result => {
                if(result.ok){
                    this.prods.splice(this.prods.indexOf(this.product), 1)
                }
            })
        },
    }
});

Vue.component('list-product', {
    props: ['prods', 'profile'],
    data: function(){
        return{
            product: null,
        }
    },
    template:
        '<div>' +
        '<div v-if="profile && (profile.roles.includes(\'ADMIN\') || profile.roles.includes(\'SUPER_ADMIN\'))">' +
        '    <add-product :products="prods" :productAttr="product"/></div>' +
        '    <hr>' +
        '    Комплектующие' +
        '    <row-product v-for="product in prods" ' +
        '                   :key="product.id" ' +
        '                   :product="product" ' +
        '                   :prods="prods" ' +
        '                   :editProduct="editProduct"/>' +
        '</div>',
    methods:{
        editProduct: function (product) {
            this.product = product;
        }
    }
});

let admin = new Vue({
    el: '#admin',
    template:
        '<div>' +
            '<nav class="navbar navbar-expand-lg navbar-light bg-light">' +
            '    <a class="navbar-brand" href="/">PC Market</a>' +
            '    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">' +
            '        <span class="navbar-toggler-icon"></span>' +
            '    </button>' +
            '    <div class="collapse navbar-collapse" id="navbarSupportedContent">' +
            '        <ul class="navbar-nav mr-auto">' +
            '            <li class="nav-item">' +
            '                <a class="nav-link" href="/">Главная</a>' +
            '            </li>' +
            '            <li class="nav-item" v-if="profile.roles.includes(\'SUPER_ADMIN\')">' +
            '                <a class="nav-link" href="/admin/users">Управление пользователями</a>' +
            '            </li>' +
            '            <li class="nav-item">' +
            '                <a class="nav-link" href="/report">Отчетность</a>' +
            '            </li>' +
            '        </ul>' +
            '        <span v-if="profile" class="navbar-text">{{ profile.username }}' +
            '           <span class="navbar-text mr-3" v-if="profile.roles.includes(\'SUPER_ADMIN\')">[СУПЕР АДМИН]</span>' +
            '           <span class="navbar-text mr-3" v-else="profile.roles.includes(\'ADMIN\')">[АДМИН]</span>' +
            '        </span>' +
            '        <span v-else class="navbar-text">unknown</span>' +
            '        <form v-if="profile" action="/logout" method="post">' +
            '           <button type="submit" class="btn btn-primary">Выйти</button>' +
            '        </form>' +
            '    </div>' +
            '</nav>' +
            '<div class="container mt-3">' +
                '<list-product :profile="profile" :prods="products"></list-product>'+
            '</div>' +
        '</div>',
    data: {
        profile: adminInfo.profile,
        products: adminInfo.products,
    },
});