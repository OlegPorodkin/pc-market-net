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
        save: function () {
            let product = {
                name: this.name,
                description: this.description,
                count: this.count,
                price: this.price,
                subcategory: {
                    id: this.subcategory.id,
                },
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
            '<h2>Название:</h2><br>{{product.name}}<br> ' +
            '<h2>Подтип товара:</h2><br>{{product.subcategory.name}}<br> ' +
            '<h2>Описание:</h2><br>{{product.description}}<br> ' +
            '<h2>Количество:</h2><br>{{product.count}}<br> ' +
            '<h2>Цена:</h2><br>{{product.price}}<br>' +
            '<hr>' +
            '<span style="position: absolute; right: 0">' +
                '<div>' +
                    '<input type="button" value="Редактировать" @click="edit">' +
                    '<input type="button" value="Удалить" @click="del">' +
                '</div>' +
            '</span>' +
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
        '<div style="position: relative; width: 800px;">' +
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
            '<div>' +
                '<a href="/">На главную</a>' +
                '<a href="/admin/users">Управление пользователями</a>' +
                '<a >{{ profile.username }}' +
                    '<a v-if="profile.roles.includes(\'SUPER_ADMIN\')">[СУПЕР_АДМИН]</a>' +
                    '<a v-else="profile.roles.includes(\'ADMIN\')">[АДМИН]</a>' +
                '</a>' +
                '<a v-if="profile" href="/logout">Logout</a> ' +
            '</div>' +
            '<div>' +
                '<list-product :profile="profile" :prods="products"></list-product>'+
            '</div>' +
        '</div>',
    data: {
        profile: adminInfo.profile,
        products: adminInfo.products,
    },
});