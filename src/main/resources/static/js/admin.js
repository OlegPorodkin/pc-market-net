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
            '<input type="text" placeholder="Название продукта" v-model="name"/>' +
            '<input type="text" placeholder="Описание" v-model="description"/>' +
            '<select v-model="subcategory">' +
                '<option v-for="sub in subcategories" :value="sub">{{ sub.name }}</option>' +
            '</select>' +
            '<input type="number" placeholder="Количество" v-model="count"/>' +
            '<input type="number" placeholder="Цена" v-model="price"/>' +
            '<input type="file" id="file" ref="myFiles" class="custom-file-input" @change="previewFiles" multiple>' +
            '<input type="button" value="save" @click="save"/>' +
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
        '<div>' +
            '<div hidden>{{product.id}}</div>' +
            'Название: {{product.name}}<br> ' +
            'Подтип товара: {{product.subcategory.name}}<br> ' +
            'Описание: {{product.description}}<br> ' +
            // 'Количество: {{product.count}}<br> ' +
            'Цена: {{product.price}}<br>' +
            '<span style="position: absolute; right: 0">' +
                '<div>' +
                    '<input type="button" value="Редактировать" @click="edit">' +
                    '<input type="button" value="Удалить" @click="del">' +
                '</div>' +
            '</span>' +
            '<hr>' +
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
        '<div v-if="profile && (profile.roles.includes(\'ADMIN\') || profile.roles.includes(\'SUPER_ADMIN\'))">Добавить новый елемент' +
        '<add-product :products="prods" :productAttr="product"/></div>' +
        '<hr>' +
        'Комплектующие' +
        '<row-product v-for="product in prods" ' +
        ':key="product.id" ' +
        ':product="product" ' +
        ':prods="prods" ' +
        ':editProduct="editProduct"/>' +
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