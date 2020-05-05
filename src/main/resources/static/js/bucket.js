let orderApi = Vue.resource("/order{/id}");

function getIndex(list, id) {
   for (let i = 0; i < list.length; i++ ) {
      if (list[i].id === id) {
         return i;
      }
   }
   return -1;
}
function validateEmail(email) {
   let pattern  = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return pattern .test(email);
}

Vue.component('detail',{
   props:['address', 'email'],
   template:
       '<div>' +
         '<input type="text" placeholder="address" >' +
         '<input type="text" placeholder="email" >' +
       '</div>',
   methods:{

   },
});

Vue.component('order-row',{
   props:['prod', 'del'],
   template:
       '<div>' +
            '<div hidden>{{prod.id}}</div>' +
            'Название: {{prod.name}} ' +
            'Подтип товара: {{prod.subcategory.name}} ' +
            'Описание: {{prod.description}} ' +
            'Количество: {{prod.count}} ' +
            'Цена: {{prod.price}}' +
            '<input type="button" value="Удалить" @click="del(prod)">' +
            '<hr>' +
       '</div>',

});

Vue.component('order-list', {
   props:['productsOrder', 'del', 'delAll'],
   template:
       '<div>' +
         '<input type="button" value="Удалить все" @click="delAll">' +
         '<order-row v-for="(prod, index) in productsOrder" :prod="prod" :del="del" :key="index"/>' +
       '</div>',
});

let bucket = new Vue({
   el: '#bucket',
   template:
       '<div>' +
            '<a href="/">На главную</a>'+
            '<a v-if="profile">{{ profile.username }}</a>' +
            '<a v-if="!profile" href="/login">Sign in</a> ' +
            '<a v-if="!profile" href="/registration">Sign up</a> ' +
            '<a v-if="profile" href="/logout">Logout</a> ' +
            '<a v-if="productsOrder != null && productsOrder.length != 0">' +
               '<order-list :productsOrder="productsOrder" :del="del" :delAll="delAll"/>' +
               '<div>' +
                  '<a v-if="!profile">' +
                     '<a v-if="address === null">{{massageAddressFill}}</a>'+
                     '<input type="text" placeholder="address" v-model="address">' +
                     '<a v-if="email === null">{{massageEmailFill}}</a>'+
                     '<input type="email" placeholder="email" v-model="email">' +
                  '</a>' +
                  '<a v-else-if>' +
                     '<input type="button" value="Оформить заказ" @click="completeOrder">' +
                  '</a>' +
               '</div>'+
            '</a>' +
            '<a v-else>' +
               '<label>Корзина пуста</label>' +
               '<a href="/">Перейти в каталог</a>' +
            '</a>' +
       '</div>',
   data: {
      massageAddressFill: 'Поле не заполнено',
      massageEmailFill: 'Поле не заполнено',
      address: null,
      email: null,
      profile: profile,
      productsOrder: JSON.parse(localStorage.getItem('productsOrder')),
   },
   methods:{
      delAll:function(){
         this.productsOrder = [];
         this.saveProds();
      },
      del: function (product) {
         let index = getIndex(this.productsOrder, product.id);

         this.productsOrder.splice(index, 1);

         this.saveProds();
      },
      saveProds() {
         const parsed = JSON.stringify(this.productsOrder);
         localStorage.setItem('productsOrder', parsed);
      },
      completeOrder: function () {
         let order;
         massageAddressFill =  'Поле не заполнено';
         massageEmailFill = 'Поле не заполнено';

         if (this.profile != null){
            this.address = this.profile.address;
            this.email = this.profile.email;
         }else if(this.address == null || this.email == null){
            if(this.address != null){
               this.address= null;
            }
            if(this.email != null){
               this.email = null;
            }
            return;
         }else {
            console.log('profile null')
         }

         if (!validateEmail(this.email)){
            this.email = null;
            this.massageEmailFill = 'Email заполнен не коректно';
            console.log('return f');
            return;
         }

         if(!this.profile){
            order = {
               products: this.productsOrder,
               address: this.address,
               email: this.email,
               user: null,
            }
         }else {
            order = {
               products: this.productsOrder,
               address: this.profile.address,
               email: this.profile.email,
               // user: this.profile,
            }
         }
         console.log(order);

         this.email = null;
         this.address = null;

         orderApi.save({}, order).then(
             localStorage.clear(),
             window.location.href = "/"
         )
      }
   }
});