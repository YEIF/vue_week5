export default {
  template: `<div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span>{{isNew ? '新增產品':'編輯產品'}}</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-2">
              <div class="mb-3">
                <label for="imageUrl" class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                <img class="img-fluid" :src="tempProduct.imageUrl">
              </div>
              <h3 class="mb-3">多圖新增</h3>
              <!-- 判斷是不是一個陣列 ，並且有沒有值-->
              <div v-if="Array.isArray(tempProduct.imagesUrl)">
                <!-- 陣列有值就顯示 -->
                <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label">圖片網址</label>
                    <input v-model="tempProduct.imagesUrl[key]" type="text" class="form-control"
                      placeholder="請輸入圖片連結">
                  </div>
                  <img class="img-fluid" :src="image">
                </div>
                <div
                  v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
                  <button class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.push('')">
                    新增圖片
                  </button>
                </div>
                <div v-else>
                  <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                    刪除圖片
                  </button>
                </div>
              </div>
              <!-- tempProduct.imagesUrl 沒有值的時候 -->
              <div v-else>
                <button class="btn btn-outline-primary btn-sm d-block w-100" @click="createImagesUrl">
                  新增圖片
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="mb-3">
              <label for="title" class="form-label">標題</label>
              <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="tempProduct.title">
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="category" class="form-label">分類</label>
                <input id="category" type="text" class="form-control" placeholder="請輸入分類"
                  v-model="tempProduct.category">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">單位</label>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="tempProduct.unit">
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="origin_price" class="form-label">原價</label>
                <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價"
                  v-model="tempProduct.origin_price">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">售價</label>
                <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價"
                  v-model="tempProduct.price">
              </div>
            </div>
            <hr>

            <div class="mb-3">
              <label for="description" class="form-label">產品描述</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述"
                v-model="tempProduct.description">
              </textarea>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">說明內容</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容"
                v-model="tempProduct.content">
              </textarea>
            </div>
            <div class="mb-3">
              <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" :id="tempProduct.id"
                  v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
                <label class="form-check-label" :for="tempProduct.id"></label>
                <span class="text-success" v-if="tempProduct.is_enabled">啟用</span>
                <span class="text-danger" v-else>未啟用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" @click="closeModal">
          取消
        </button>
        <template v-if="isNew">
          <button type="button" class="btn btn-primary" @click="updateProduct">
            新增
          </button>
        </template>
        <template v-else>
          <button type="button" class="btn btn-primary" @click="updateProduct" >
            更新
          </button>
        </template>
      </div>
    </div>
  </div>`,
  props: ['tempProduct', 'isNew', 'currentPage'],
  data () {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'clothes'
    }
  },
  methods: {
    updateProduct () {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/`
      let method = 'post'
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
        method = 'put'
      }
      axios[method](url, { data: this.tempProduct })
        .then(res => {
          // this.getData()
          this.$emit('get-products', method === 'put' ? this.currentPage : 1)
          this.closeModal()
          alert(res.data.message)
        }).catch(err => {
          console.dir(err)
        })
    },
    closeModal () {
      this.$emit('close-modal')
    },
    createImagesUrl () {
      this.$emit('create-imagesurl')
    }
  }
}
