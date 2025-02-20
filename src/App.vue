<template>
  <div id ="app">
 
 
   <table class="table">
      <thead>
        <th>Identifier</th>
        <th>Status</th>
        <th>UserText1</th>
      </thead>
      <tbody>
        <tr v-for ="sample in samples" :key="sample.id" @dblclick="$data.sample = sample">
          <td>{{ sample.Identifier }}</td>
          <td>{{ sample.Status }}</td>
          <td>{{ sample.UserText1 }}</td>
          <td><button class = "btn btn-outline-danger btn-sm mx-1" @click="deleteSample(sample)">X</button></td>
        </tr>
      </tbody>
   </table> 
<br>
<br>
   <div class="container">
  <form @submit.prevent="submitForm">
    <div class="form-group d-flex justify-content-center">
      <input type = "text" class = "form-control w-35 me-2" style = "max-width: 350px" placeholder="Name" v-model = "sample.Identifier">
      <input type = "text" class = "form-control w-35 me-2" style = "max-width: 350px" placeholder="Identifier" v-model = "sample.Status">
      <input type = "text" class = "form-control w-35 me-2" style = "max-width: 150px" placeholder="UserText1" v-model = "sample.UserText1">
     
      <button class="btn btn-success">Submit</button>
    </div>  
  </form>
 </div>


  </div>
</template>

<script>

export default {
  name: 'App',
  data(){

    return {
      student:{},
      students: [],
      sample:{},
      samples: []//,
      //Statuses: []
    }
    
  },
  async created(){
    
   this.getSamples()
   //this.getStatuses()
  },

  methods: {

    async deleteSample(sample){
          
      await this.getSamples()
      try{
         await fetch(`http://192.168.12.24/api/samples/${sample.id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
             'Accept': 'application/json'
          },
          body: JSON.stringify(this.sample)
          
        })
        await this.getSamples()
      }
      catch (error) {
        console.error('Error deleting student:', error)
        alert('Failed to delete student. Please try again.')
      }
    },

    async editSample(){
      await this.getSamples()
      try {
        const response =await fetch(`http://192.168.12.24/api/samples/${this.sample.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
             'Accept': 'application/json'
          },
          body: JSON.stringify(this.sample)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const newSample = await response.json()
        this.samples.push(newSample)
        await this.getSamples()

        // Reset form
        this.sample = {
          Identifier: '',
          Status: '',
          UserText1: ''
        }
      } catch (error) {
        
        alert('Failed to edit sample. Please try again.')
        // Reset form
        this.sample = {
          Identifier: '',
          Status: '',
          UserText1: ''
        }
      }
   
    },


    submitForm(){
      if (this.sample.id === undefined){
          this.createSample()
      } else {
          this.editSample()
      }
    },

    async getStatuses(){
      var response = await fetch('http://192.168.12.24/api/students/')
      this.students = await response.json()
    },

    async getSamples(){
      var response = await fetch('http://192.168.12.24/api/samples/')
      this.samples = await response.json()
    },
    
    async createSample() {
      await this.getSamples()
      try {
        const response = await fetch('http://192.168.12.24/api/samples/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
             'Accept': 'application/json'
          },
          body: JSON.stringify(this.sample)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const newSample = await response.json()
        this.samples.push(newSample)
        await this.getSamples()

        // Reset form
        this.sample = {
          identifier: '',
          status: '',
          usertext1: ''
        }
      } catch (error) {
        console.error('Error creating student:', error)
        alert('Failed to create student. Please try again.')
        // Reset form
        this.sample = {
          identifier: '',
          status: '',
          usertext1: ''
        }
      }
    }
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
