let usersApi = Vue.resource("/admin/users{/id}");

function getIndex(list, id) {
    for (let i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

Vue.component('role-checkbox', {
    props:['value', 'val'],
    template:
        '<div>' +
        '<label>' +
        '<input type="checkbox" :value="val" v-model="model">' +
        '<slot></slot>' +
        '</label>' +
        '</div>',
    computed:{
        model: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
    },
});

Vue.component('add-user',{
    props:['users', 'userAttr'],
    template:
        '<div>' +
            '<input type="text" placeholder="Имя пользователя" v-model="user.username">' +
            '<input type="password" placeholder="Пароль" v-model="user.password">' +
            '<input type="email" placeholder="email" v-model="user.email">' +
            '<input type="text" placeholder="адрес" v-model="user.address">' +
            '<role-checkbox v-for="(role, id) in roles" v-model="user.roles" :val="role" :key="id">{{ role }}</role-checkbox>' +
            '<label><input type="checkbox" value="active" v-model="user.active">isActive</label>' +
            '<input type="button" value="save" @click="save"/>' +
        '</div>',
    data: function () {
        return{
            roles: allUser.roles,
            password:'',
            user:{
              id:'',
              username:'',
              password:'',
              password2:'',
              email:'',
              address:'',
              roles:[],
              active: ''
            },
        }
    },
    watch:{
        userAttr: function (newVal, oldVal) {
            this.user.id = newVal.id;
            this.user.username = newVal.username;
            this.user.password = newVal.password;
            this.user.password2 = newVal.password;
            this.user.email = newVal.email;
            this.user.address = newVal.address;
            this.user.roles = newVal.roles;
        },
    },
    methods:{
        save: function () {
            let user = {
                username: this.user.username,
                password: this.user.password,
                password2: this.user.password,
                email: this.user.email,
                address: this.user.address,
                roles: this.user.roles,
                active: this.user.active,
            };

            if (this.user.id){
                usersApi.update({id: this.user.id}, user).then(result => {
                    result.json().then(data => {
                        let index = getIndex(this.users, data.id);
                        this.users.splice(index, 1, data);
                        this.user.id='';
                        this.user.username='';
                        this.user.password='';
                        this.user.password2='';
                        this.user.email='';
                        this.user.address='';
                        this.user.roles=[];
                        this.user.active= ''
                    })
                })
            }else {
                usersApi.save({}, user).then(result =>{
                    result.json().then(data =>{
                        this.users.push(data);
                        this.user.id='';
                        this.user.username='';
                        this.user.password='';
                        this.user.password2='';
                        this.user.email='';
                        this.user.address='';
                        this.user.roles=[];
                        this.user.active= ''
                    })
                })
            }
        }
    },
});

Vue.component('row-user', {
    props: ['usr', 'users', 'editUser'],
    template:
        '<div>' +
            '<div hidden>{{usr.id}}</div>' +
            '{{usr.username}} ' +
            '{{usr.email}} ' +
            '{{usr.active}} ' +
            '{{usr.address}} ' +
            '<span>' +
                '<div>' +
                    '<input type="button" value="Рдактировать" @click="edit">' +
                    '<input type="button" value="Удалить" @click="del">' +
                '</div>' +
            '</span>' +
        '</div>',
    methods: {
        edit: function () {
            this.editUser(this.usr);
        },
        del: function () {
            usersApi.remove({id: this.usr.id}).then(result => {
                if(result.ok){
                    this.users.splice(this.users.indexOf(this.usr), 1)
                }
            })
        }
    },
});

Vue.component('user-list', {
    props: ['users'],
    template:
        '<div>' +
            'Добавить:<br>' +
            '<add-user :users="users" :userAttr="user"></add-user>' +
            'Пользователи:<br>' +
            '<row-user v-for="user in users" :usr="user" :users="users" :editUser="editUser" :key="user.id"/>' +
        '</div>',
    data: function () {
        return {
            user: null,
        }
    },
    methods: {
        editUser: function (user) {
            this.user = user;
        }
    }
});

let userConsole = new Vue({
    el: '#user_console',
    template:
        '<div>' +
        '<a href="/">На главную</a>' +
        '<a href="/admin">Консоль администратора</a>' +
        '<hr>' +
        '<user-list :users="users"></user-list>' +
        '</div>',
    data: {
        users: allUser.users,
    },
});