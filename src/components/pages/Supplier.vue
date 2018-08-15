<template>
  <div>
    <modal modalHeading="Add New Supplier" :cond="showingAddModal" @modalClose="showingAddModal = false">
      <table>
        <tr>
          <td>Supplier Name</td>
          <td><input type="text" id="newSuppName" class="" v-model="newSupplier.name" placeholder="Supplier Name"></td>
        </tr>
      
        <tr>
          <td>Supplier Description</td>
          <td>
            <textarea v-model="newSupplier.description" placeholder="Write Supplier Description"></textarea>
          </td>
        </tr>
      
        <tr>
          <td></td>
          <td>
            <button class="btnSave" @click="addNewSupplier()">Save</button>
          </td>
        </tr>
      </table>
    </modal>

    <modal modalHeading="Edit Supplier" :cond="showingEditModal" @modalClose="showingEditModal = false">
      <table>
        <tr>
          <td>Supplier Name</td>
          <td><input type="text" id="newSuppName" class="" v-model="clickedSupplier.name" placeholder="Supplier Name"></td>
        </tr>
      
        <tr>
          <td>Supplier Description</td>
          <td>
            <textarea v-model="clickedSupplier.description" placeholder="Write Supplier Description"></textarea>
          </td>
        </tr>
      
        <tr>
          <td></td>
          <td>
            <button class="btnSave" @click="updateSupplier()">Update</button>
          </td>
        </tr>
      </table>
    </modal>

    <modal modalHeading="Are you sure?" :cond="showingDeleteModal" @modalClose="showingDeleteModal = false">
      <h2>
        You are going to delete '{{ clickedSupplier.name }}'
      </h2>
      
      <table>
        <tr>
          <td></td>
          <td></td>
        </tr>
        
        <tr>
          <td>
            <button class="btnSave" @click="deleteSupplier()">Yes</button>
            <button class="btnClose" @click="showingDeleteModal = false">No</button>
          </td>
        </tr>
      </table>
    </modal>

    <h2 class="fleft">Supplier</h2>
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

      <tr v-for="supplier in suppliers">
        <td>{{supplier._id}}</td>
        <td>{{supplier.name}}</td>
        <td>{{supplier.description}}</td>
        <td><button class="edit" @click="showingEditModal = true; clickedSupplier = supplier">Edit</button></td>
        <td><button class="delete" @click="showingDeleteModal = true; clickedSupplier = supplier">Delete</button></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Supplier',

  data () {
    return {
      showingAddModal: false,
      showingEditModal: false,
      showingDeleteModal: false,
      newSupplier: {
        name: '',
        description: ''
      },
      clickedSupplier: {},
      suppliers: []
      
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init(){
      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.get('http://localhost:3002/suppliers').then(res=>{
        this.$eventBus.$emit('loadingStatus', false);
        
        if (res.data.error) {
          this.$izitoast.error({
            title: 'Error',
            message: res.data.message
          });
        } else{
          console.log(res);

          this.suppliers = res.data.all_suppliers;
        };
      });
    },

    addNewSupplier(){
      console.log(this.newSupplier);

      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/suppliers/add_new', this.newSupplier).then(res=>{
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
            this.newSupplier = {}
          };
      });
    },

    updateSupplier(){
      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/suppliers/update', this.clickedSupplier).then(res=>{
          this.$eventBus.$emit('loadingStatus', false);
          this.showingEditModal = false;
          console.log(res);
          if (res.data.error) {
            this.$izitoast.error({
              title: 'Error',
              message: res.data.message
            });
            this.clickedSupplier = {}
          } else{
            // localStorage.setItem("token", res.data.token);
            this.$izitoast.success({
              title: 'Success',
              message: res.data.message
            });
            this.clickedSupplier = {};
            this.init();
          };
      });
    },

    deleteSupplier(){
      this.$eventBus.$emit('loadingStatus', true);
      this.$axios.post('http://localhost:3002/suppliers/delete', this.clickedSupplier).then(res=>{
          this.$eventBus.$emit('loadingStatus', false);
          this.showingDeleteModal = false;
          console.log(res);
          if (res.data.error) {
            this.$izitoast.error({
              title: 'Error',
              message: res.data.message
            });
            this.clickedSupplier = {}
          } else{
            // localStorage.setItem("token", res.data.token);
            this.$izitoast.success({
              title: 'Success',
              message: res.data.message
            });
            this.clickedSupplier = {};
            this.init();
          };
      });
    }
  }
}
</script>
