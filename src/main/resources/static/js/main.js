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
        }
    },
    watch:{
        productAttr: function (newVal, oldVal) {
            this.id = newVal.id;
            this.name = newVal.name;
            this.description = newVal.description;
            this.count = newVal.count;
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
        // '<subcategory-select :subcategories="subcategories" :val="subcategory"/>' +
        '<input type="number"v-model="count"/><br/>' +
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
                    })
                })
            }else {
                productApi.save({}, product).then(
                    result => result.json().then(data => {
                        this.products.push(data)
                        this.id = '';
                        this.name = '';
                        this.description = '';
                        this.subcategory = null;
                        this.count = '';
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
        '<div hidden>{{product.id}}</div>{{product.name}} {{product.subcategory.name}} {{product.description}} {{product.count}}' +
        '<span style="position: absolute; right: 0">' +
        '<input type="button" value="Редактировать" @click="edit">' +
        '<input type="button" value="Удалить" @click="del">' +
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
    props: ['prods'],
    data: function(){
        return{
            product: null,
        }
    },
    template:
        '<div>' +
        'Добавить новый елемент' +
        '<add-product :products="prods" :productAttr="product"/>' +
        '<hr>' +
        'Список комплектующих' +
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

let app = new Vue({
    el: '#app',
    template:
        '<div>' +
        '<list-product :prods="products"/>' +
        '</div>',
    data: {
        products: [],
    },
    created: function () {
        productApi.get().then(result => {
            result.json().then(data => data.forEach(pr => this.products.push(pr)))
        })
    }
});