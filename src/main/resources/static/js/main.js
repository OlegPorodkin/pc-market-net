let productApi = Vue.resource("/products{/id}");
let subcategoriesApi = Vue.resource("/subcategories{/id}");

Vue.component('add-product', {
    props: ['products'],
    data: function () {
        return {
            subcategories: [],
            name: '',
            description: '',
            subcategory: {},
            count: '',
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
            console.log(product);
            console.log(this.subcategory);
            productApi.save({}, product).then(
                result => result.json().then(data => {
                    this.products.push(data)
                })
            )
        }
    },
});

Vue.component('row-product', {
    props: ['product', 'prods'],
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
    template:
        '<div>' +
        '<row-product v-for="product in prods" ' +
            ':key="product.id" ' +
            ':product="product" ' +
            ':prods="prods" />' +
        '</div>',
});

let app = new Vue({
    el: '#app',
    template:
        '<div>' +
        'Добавить новый елемент' +
        '<add-product :products="products"/>' +
        '<hr>' +
        'Список комплектующих' +
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