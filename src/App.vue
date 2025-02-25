<template>
  <div id="app">
    <nav class="navbar navbar-expand-md navbar-light bg-warning w-100">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Sample Management</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>

    <div class="container-fluid">
      <table class="table">
        <thead>
          <th>ID</th>
          <th>Identifier</th>
          <th>Status</th>
          <th>Material</th>
          <th>UserText1</th>
        </thead>
        <tbody>
          <tr v-for="sample in samples" :key="sample.id" @click="$data.sample = sample" @dblclick="getResults(sample.id)">
            <td>{{ sample.id }}</td>
            <td>{{ sample.Identifier }}</td>
            <td>{{ sample.Status_Name }}</td>
            <td>{{ sample.Material_Name }}</td>
            <td>{{ sample.UserText1 }}</td>
            <td><button class="btn btn-outline-danger btn-sm mx-1" @click="deleteSample(sample)">X</button></td>
          </tr>
        </tbody>
      </table>
      <br>

      <div class="container">
        <form @submit.prevent="submitForm">
          <div class="form-group d-flex justify-content-center">
            <input type="text" class="form-control w-35 me-2" style="max-width: 550px" placeholder="Name" v-model="sample.Identifier">

            <select v-model="sample.Event" class="form-control w-35 me-2" style="max-width: 150px">
              <option value="null">Select Event</option>
              <option v-for="event in events" :key="event.id" :value="event.id">{{ event.Name }}</option>
            </select>

            <select v-model="sample.Status" class="form-control w-35 me-2" style="max-width: 150px">
              <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.Name }}</option>
            </select>

            <select v-model="sample.Material" class="form-control w-35 me-2" style="max-width: 150px">
              <option value="null">Select Material</option>
              <option v-for="material in materials" :key="material.id" :value="material.id">{{ material.Name }}</option>
            </select>

            <input type="text" class="form-control w-35 me-2" style="max-width: 150px" placeholder="UserText1" v-model="sample.UserText1">
            
            <button class="btn btn-success">Submit</button>
          </div>
        </form>
      </div>

      <br>
      <table class="table">
        <thead>
          <th class="sample-id-column">SampleID</th>
          <th>Test</th>
          <th>Value</th>
        </thead>
        <tbody>
          <tr v-for="result in sample_results" :key="result.id">
            <td class="sample-id-column">{{ result.Sample }}</td>
            <td>{{ result.Test_Name }}</td>
            <td><input type="text" class="form-control value-input" v-model="result.ValueNum" @keyup.enter="updateResultValue(result)"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getFullUrl } from './config/api'

export default {
  name: 'App',
  data() {
    return {
      student:{},
      students: [],
      samples: [],
      statuses: [],
      materials: [],
      events: [],
      sample_results: [],
      sample: {
        id: null,
        Identifier: '',
        Status: null,
        Material: null,
        Event: null,
        UserText1: ''
      }
    }
  },
  created() {
    this.getSamples()
    this.getStatuses()
    this.getMaterials()
    this.getEvents()
  },

  methods: {
    async deleteSample(sample){
          
      await this.getSamples()
      try{
         await fetch(getFullUrl('SAMPLES', sample.id), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        await this.getSamples()
      } catch (error) {
        console.error('Error deleting sample:', error)
        alert('Failed to delete sample. Please try again.')
      }
    },

    async editSample(){
      await this.getSamples()
      try {
        const response = await fetch(getFullUrl('SAMPLES', this.sample.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Identifier: this.sample.Identifier,
            Status: this.sample.Status,
            Material: this.sample.Material,
            UserText1: this.sample.UserText1
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to edit sample')
        }

        await this.getSamples()

        // Reset form
        this.sample = {
          id: null,
          Identifier: '',
          Status: null,
          Material: null,
          UserText1: ''
        }
      } catch (error) {
        console.error('Error editing sample:', error)
        alert('Failed to edit sample. Please try again.')
        // Reset form
        this.sample = {
          id: null,
          Identifier: '',
          Status: null,
          Material: null,
          UserText1: ''
        }
      }
    },

    async submitForm() {
      if (this.sample.id) {
        await this.editSample()
      } else {
        await this.createSample()
      }
    },

    async getStatuses(){
      try {
        const response = await fetch(getFullUrl('STATUSES'))
        const data = await response.json()
        this.statuses = data
      } catch (error) {
        console.error('Error fetching statuses:', error)
      }
    },

    async getEvents(){
      try {
        const response = await fetch(getFullUrl('EVENTS'))
        const data = await response.json()
        this.events = data
      } catch (error) {
        console.error('Error fetching Events:', error)
      }
    },

    async getMaterials(){
      try {
        const response = await fetch(getFullUrl('MATERIALS'))
        const data = await response.json()
        this.materials = data
      } catch (error) {
        console.error('Error fetching materials:', error)
      }
    },

    async getSamples(){
      var response = await fetch(getFullUrl('SAMPLES'))
      this.samples = await response.json()
    },
    async getResults(sampleid){
      try {
        const response = await fetch(getFullUrl('SAMPLE_RESULTS', sampleid))
        const data = await response.json()
        this.sample_results = data
      } catch (error) {
        console.error('Error fetching sample results:', error)
      }
    },
    
    async updateResultValue(result) {
      try {
        const response = await fetch(getFullUrl('SAMPLE_RESULTS_UPDATE', result.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Sample: result.Sample,
            Test: result.Test,
            ValueNum: result.ValueNum
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update result value')
        }
        // Add visual feedback for successful update
        const input = document.activeElement;
        if (input) {
          input.blur(); // Remove focus from input
        }
      } catch (error) {
        console.error('Error updating result value:', error)
      }
    },

    async createSample(){
      await this.getSamples()
      try {
        const response = await fetch(getFullUrl('SAMPLES'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Identifier: this.sample.Identifier,
            Status: this.sample.Status,
            Material: this.sample.Material,
            UserText1: this.sample.UserText1
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create sample')
        }

        await this.getSamples()

        // Reset form
        this.sample = {
          id: null,
          Identifier: '',
          Status: null,
          Material: null,
          UserText1: ''
        }
      } catch (error) {
        console.error('Error creating student:', error)
        alert('Failed to create sample. Please try again.')
        // Reset form
        this.sample = {
          id: null,
          Identifier: '',
          Status: null,
          Material: null,
          UserText1: ''
        }
      }
    }
  }
}
</script>

<style>
.navbar {
  margin-bottom: 20px;
}

.table{
  margin: 10px;
  padding: 10px;
}

.table td, .table th {
  padding: 0.25rem;
  vertical-align: middle;
  line-height: 1;
}

.table tr {
  height: 2rem;
}

.sample-id-column {
  width: 20%;
  max-width: 20%;
}

.value-input {
  width: 10ch;
  min-width: 10ch;
  max-width: 10ch;
}

select.form-control {
  appearance: revert;
  -webkit-appearance: revert;
  -moz-appearance: revert;
  padding-right: 2rem;
}
</style>
