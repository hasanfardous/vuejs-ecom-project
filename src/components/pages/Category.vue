<template>
  <div>
    <modal modalHeading="Add New Category" :cond="showingAddModal" @modalClose="showingAddModal = false">
      <table>
        <tr>
          <td>Category Name</td>
          <td><input type="text" id="newCatName" class="" v-model="newCategory.name" placeholder="Category Name"></td>
        </tr>
      
        <tr>
          <td>Category Description</td>
          <td>
            <textarea v-model="newCategory.description" placeholder="Write Category Description"></textarea>
          </td>
        </tr>
      
        <tr>
          <td></td>
          <td>
            <button class="btnSave" @click="addNewCategory()">Save</button>
          </td>
        </tr>
      </table>
    </modal>

    <modal modalHeading="Edit Category" :cond="showingEditModal" @modalClose="showingEditModal = false">
      <table>
        <tr>
          <td>Category Name</td>
          <td><input type="text" id="newCatName" class="" v-model="clickedCategory.name" placeholder="Category Name"></td>
        </tr>
      
        <tr>
          <td>Category Description</td>
          <td>
            <textarea v-model="clickedCategory.description" placeholder="Write Category Description"></textarea>
          </td>
        </tr>
      
        <tr>
          <td></td>
          <td>
            <button class="btnSave" @click="updateCategory()">Update</button>
          </td>
        </tr>
      </table>
    </modal>

    <modal modalHeading="Are you sure?" :cond="showingDeleteModal" @modalClose="showingDeleteModal = false">
      <h2>
        You are going to delete '{{ clickedCategory.name }}'
      </h2>
      
      <table>
        <tr>
          <td></td>
          <td></td>
        </tr>
        
        <tr>
          <td>
            <button class="btnSave" @click="deleteCategory()">Yes</button>
            <button class="btnClose" @click="showingDeleteModal = false">No</button>
          </td>
        </tr>
      </table>
    </modal>

    <h2 class="fleft">Category</h2>
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

      <tr v-for="category in categories">
        <td>{{category._id}}</td>
        <td>{{category.name}}</td>
        <td>{{category.description}}</td>
        <td><button class="edit" @click="showingEditModal = true; clickedCategory = category">Edit</button></td>
        <td><button class="delete" @click="showingDeleteModal = true; clickedCategory = category">Delete</button></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Category',

  data () {
    return {
      showingAddModal: false,
      showingEditModal: false,
      showingDeleteModal: false,
      newCategory: {
        name: '',
        description: ''
      },
      clickedCategory: {},
      categories: []
      
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init(){
      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.get('http://localhost:3002/products/category').then(res=>{
        this.$eventBus.$emit('loadingStatus', false);
        
        if (res.data.error) {
          this.$izitoast.error({
            title: 'Error',
            message: res.data.message
          });
        } else{
          console.log(res);

          this.categories = res.data.all_cats;
        };
      });
    },

    addNewCategory(){
      console.log(this.newCategory);

      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/products/category/add_new', this.newCategory).then(res=>{
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
          };
      });
    },

    updateCategory(){
      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/products/category/update', this.clickedCategory).then(res=>{
          this.$eventBus.$emit('loadingStatus', false);
          this.showingEditModal = false;
          console.log(res);
          if (res.data.error) {
            this.$izitoast.error({
              title: 'Error',
              message: res.data.message
            });
            this.clickedCategory = {}
          } else{
            // localStorage.setItem("token", res.data.token);
            this.$izitoast.success({
              title: 'Success',
              message: res.data.message
            });
            this.clickedCategory = {};
            this.init();
          };
      });
    },

    deleteCategory(){
      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/products/category/delete', this.clickedCategory).then(res=>{
          this.$eventBus.$emit('loadingStatus', false);
          this.showingDeleteModal = false;
          console.log(res);
          if (res.data.error) {
            this.$izitoast.error({
              title: 'Error',
              message: res.data.message
            });
            this.clickedCategory = {}
          } else{
            // localStorage.setItem("token", res.data.token);
            this.$izitoast.success({
              title: 'Success',
              message: res.data.message
            });
            this.clickedCategory = {};
            this.init();
          };
      });
    }
  }
}
</script>
