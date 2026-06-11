  <template>
    <div>
      <!-- Muestra el CRUD o el Formulario según el estado -->
      <ComprasRealizadasView
        v-if="!showForm"
        @open-add="showForm = true"
      />

      <RegistroComprasView
        v-if="showForm"
        @close="showForm = false"
      />
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'
  import ComprasRealizadasView from '../views/ComprasRealizadasView.vue'  // ajusta la ruta
  import RegistroComprasView from './RegistroComprasView.vue';
  const showForm = ref(false)
  </script>
