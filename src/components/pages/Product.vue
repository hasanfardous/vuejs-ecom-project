<template>
  <div>
    <modal modalHeading="Add New Product" :cond="showingAddModal" @modalClose="showingAddModal = false">
      <table>
        <tr>
          <td>Product Name</td>
          <td><input type="text" id="newCatName" class="" v-model="newProduct.name" placeholder="Product Name"></td>
        </tr>

        <tr>
          <td>Product Category</td>
          <td>
            <select id="prodCat" v-model="newProduct.category">
              <option value="">--Select Category--</option>
              <option v-for="c in all_categories" value="c._id">
                {{c.name}}
              </option>
            </select>
          </td>
        </tr>

        <tr>
          <td>Product Supplier</td>
          <td>
            <select id="prodSupp" v-model="newProduct.supplier">
              <option value="">--Select Supplier--</option>
              <option v-for="s in all_suppliers" value="s._id">
                {{s.name}}
              </option>
            </select>
          </td>
        </tr>

        <tr>
          <td>Product Image</td>
          <td>
            <input type="file" @change="select_image">
          </td>
        </tr>

        <tr>
          <td></td>
          <td>
            <progress :value="percentage" max="100" v-if="percentage != 0 && percentage != 100"></progress>
            <span v-if="percentage != 0 && percentage != 100">{{percentage}} %</span><br><br>
            <img :src="newProduct.image" width="100" alt="Product Image">
          </td>
        </tr>

        

        <tr>
          <td>Product Description</td>
          <td>
            <textarea v-model="newProduct.description" placeholder="Write Product Description"></textarea>
          </td>
        </tr>
      
        <tr>
          <td></td>
          <td>
            <button class="btnSave" @click="addNewProduct()">Save</button>
          </td>
        </tr>
      </table>
    </modal>

    <modal modalHeading="Edit Product" :cond="showingEditModal" @modalClose="showingEditModal = false">
      <table>
        <tr>
          <td>Product Name</td>
          <td><input type="text" id="newProductName" class="" v-model="clickedProduct.name" placeholder="Product Name"></td>
        </tr>
      
        <tr>
          <td>Product Description</td>
          <td>
            <textarea v-model="clickedProduct.description" placeholder="Write Product Description"></textarea>
          </td>
        </tr>
      
        <tr>
          <td></td>
          <td>
            <button class="btnSave" @click="updateProduct()">Update</button>
          </td>
        </tr>
      </table>
    </modal>

    <modal modalHeading="Are you sure?" :cond="showingDeleteModal" @modalClose="showingDeleteModal = false">
      <h2>
        You are going to delete '{{ clickedProduct.name }}'
      </h2>
      
      <table>
        <tr>
          <td></td>
          <td></td>
        </tr>
        
        <tr>
          <td>
            <button class="btnSave" @click="deleteProduct()">Yes</button>
            <button class="btnClose" @click="showingDeleteModal = false">No</button>
          </td>
        </tr>
      </table>
    </modal>

    <h2 class="fleft">Product</h2>
    <button class="addBtn fright" @click="showingAddModal = true">Add New</button>
    <div class="clear"></div>
    <hr>

    <table class="nice-table">
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Description</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>

      <tr v-for="product in products">
        <td>{{product._id}}</td>
        <td>{{product.name}}</td>
        <td>{{product.description}}</td>
        <td><button class="edit" @click="showingEditModal = true; clickedProduct = product">Edit</button></td>
        <td><button class="delete" @click="showingDeleteModal = true; clickedProduct = product">Delete</button></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Product',

  data () {
    return {
      showingAddModal: false,
      showingEditModal: false,
      showingDeleteModal: false,
      newProduct: {
        name: '',
        category: '',
        supplier: '',
        price: 0,
        negotiable: true,
        image: '/static/img/logo.png',
        description: ''
      },
      clickedProduct: {},
      products: [],
      percentage: 0,
      all_categories: [],
      all_suppliers: []
      
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init(){
      this.$eventBus.$emit('loadingStatus', true);

      //Get product categories
      this.$axios.get('http://localhost:3002/products/category').then(res=>{
        this.$eventBus.$emit('loadingStatus', false);
        
        if (res.data.error) {
          this.$izitoast.error({
            title: 'Error',
            message: res.data.message
          });
        } else{
          console.log(res);

          this.all_categories = res.data.all_cats;
        };
      });

      //Get product suppliers
      this.$axios.get('http://localhost:3002/suppliers').then(res=>{
        this.$eventBus.$emit('loadingStatus', false);
        
        if (res.data.error) {
          this.$izitoast.error({
            title: 'Error',
            message: res.data.message
          });
        } else{
          console.log(res);

          this.all_suppliers = res.data.all_suppliers;
        };
      });


      //Get all products
      this.$axios.get('http://localhost:3002/products').then(res=>{
        this.$eventBus.$emit('loadingStatus', false);
        
        if (res.data.error) {
          this.$izitoast.error({
            title: 'Error',
            message: res.data.message
          });
        } else{
          console.log(res);

          this.products = res.data.all_products;
        };
      });
    },


    //Saving product image
    select_image(event){
      this.newProduct.image = event.target.files[0];
      const fd = new FormData();
      fd.append('singleImage', this.newProduct.image, this.newProduct.image.name);
      this.$axios.post('http://localhost:3002/products/add_image', fd, {
        onUploadProgress: uploadEvent => {
          this.percentage = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
        }
      }).then(res=>{
        console.log(res);
        this.newProduct.image = '../../../../' + res.data.imageUrl;
        
      });
    },


    //Add new product
    addNewProduct(){
      console.log(this.newProduct);

      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/products/add_new', this.newProduct).then(res=>{
          this.$eventBus.$emit('loadingStatus', false);
          this.showingAddModal = false;
          console.log(res);
          if (res.data.error) {
            this.$izitoast.error({
              title: 'Error',
              message: res.data.message
            });
          } else{
            // localStorage.setItem("token", res.data.token);
            this.$izitoast.success({
              title: 'Success',
              message: res.data.message
            });
            this.init();
            this.newProduct = {}
          };
      });
    },


    //Update product
    updateProduct(){
      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/products/update', this.clickedProduct).then(res=>{
          this.$eventBus.$emit('loadingStatus', false);
          this.showingEditModal = false;
          console.log(res);
          if (res.data.error) {
            this.$izitoast.error({
              title: 'Error',
              message: res.data.message
            });
            this.clickedProduct = {}
          } else{
            // localStorage.setItem("token", res.data.token);
            this.$izitoast.success({
              title: 'Success',
              message: res.data.message
            });
            this.clickedProduct = {};
            this.init();
          };
      });
    },


    //Delete product
    deleteProduct(){
      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/products/delete', this.clickedProduct).then(res=>{
          this.$eventBus.$emit('loadingStatus', false);
          this.showingDeleteModal = false;
          console.log(res);
          if (res.data.error) {
            this.$izitoast.error({
              title: 'Error',
              message: res.data.message
            });
            this.clickedProduct = {}
          } else{
            // localStorage.setItem("token", res.data.token);
            this.$izitoast.success({
              title: 'Success',
              message: res.data.message
            });
            this.clickedProduct = {};
            this.init();
          };
      });
    }
  }
}
</script>
