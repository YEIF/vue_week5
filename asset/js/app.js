import pagination from './components/pagination.js'
import userProductModal from './components/userProductModal.js'
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate
const { required, email, min, max, numeric } = VeeValidateRules
const { localize, loadLocaleFromURL } = VeeValidateI18n

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('max', max)
defineRule('numeric', numeric)
loadLocaleFromURL('./zh_TW.json')
configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true
})
const apiUrl = 'https://vue3-course-api.hexschool.io/v2'
const apiPath = 'clothes'
const app = Vue.createApp({
  components: {
    pagination,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
    userProductModal
  },
  data () {
    return {
      carts: {},
      product: {},
      products: [],
      pagination: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
          message: ''
        }
      },
      isLoadingItem: ''
    }
  },
  methods: {
    getProducts (page = 1) {
      const url = `${apiUrl}/api/${apiPath}/products/?page=${page}`
      axios.get(url)
        .then((res) => {
          // console.log(res)
          this.products = res.data.products
          this.pagination = res.data.pagination
        })
        .catch((err) => {
          console.dir(err.data)
        })
    },
    getProduct (id) {
      this.isLoadingItem = id
      const url = `${apiUrl}/api/${apiPath}/product/${id}`
      axios.get(url)
        .then((res) => {
          this.isLoadingItem = ''
          this.product = res.data.product
          this.$refs.userProductModal.openModal()
        })
        .catch((err) => {
          console.dir(err)
        })
    },
    updateCart (cart) {
      this.isLoadingItem = cart.id
      const url = `${apiUrl}/api/${apiPath}/cart/${cart.id}`
      const data = {
        product_id: cart.product_id,
        qty: cart.qty
      }
      axios.put(url, { data })
        .then((res) => {
          this.isLoadingItem = ''
          this.getCarts()
        })
        .catch((err) => {
          console.dir(err)
        })
    },
    addToCart (id, qty = 1) {
      const data = {
        product_id: id,
        qty: qty
      }
      this.isLoadingItem = 'add' + id
      const url = `${apiUrl}/api/${apiPath}/cart/`
      this.$refs.userProductModal.hideModal()
      axios.post(url, { data })
        .then((res) => {
          this.isLoadingItem = ''
          this.getCarts()
        })
        .catch((err) => {
          console.dir(err)
        })
    },
    getCarts () {
      const url = `${apiUrl}/api/${apiPath}/cart/`
      axios.get(url)
        .then((res) => {
          this.carts = res.data.data
        })
        .catch((err) => {
          console.dir(err)
        })
    },
    delCart (id) {
      this.isLoadingItem = id
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`
      axios.delete(url)
        .then((res) => {
          this.isLoadingItem = ''
          this.getCarts()
        })
        .catch((err) => {
          console.dir(err)
        })
    },
    delAllCarts () {
      const url = `${apiUrl}/api/${apiPath}/carts`
      axios.delete(url)
        .then((res) => {
          this.getCarts()
        })
        .catch((err) => {
          console.dir(err)
        })
    },
    sendOrder () {
      const url = `${apiUrl}/api/${apiPath}/order`
      const order = this.form
      axios.post(url, { data: order }).then((response) => {
        alert(response.data.message)
        this.$refs.form.resetForm()
        this.getCarts()
      }).catch((err) => {
        alert(err.data.message)
      })
    }
  },
  mounted () {
    this.getProducts()
    this.getCarts()
  }

})
app.mount('#app')
