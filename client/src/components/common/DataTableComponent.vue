<!-- src/components/common/DataTableComponent.vue -->
<template>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td v-for="column in columns" :key="`${index}-${column.key}`">
              <slot :name="column.key" :item="item" :index="index">
                {{ getItemValue(item, column.key) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DataTableComponent',
    props: {
      columns: {
        type: Array,
        required: true
      },
      items: {
        type: Array,
        required: true
      }
    },
    setup() {
      const getItemValue = (item, key) => {
        // Поддержка вложенных свойств (например, 'user.name')
        if (key.includes('.')) {
          const keys = key.split('.');
          let value = item;
          
          for (const k of keys) {
            if (value === null || value === undefined) return '';
            value = value[k];
          }
          
          return value;
        }
        
        return item[key];
      };
      
      return {
        getItemValue
      };
    }
  }
  </script>
  
  <style scoped>
  .table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    text-align: center;
    font-weight: 700;
    padding: 0.3rem 1rem;
    background-color: rgb(219, 223, 246);
    color: var(--bold-text-color);
  }
  
  tr {
    padding-bottom: 10px;
  }
  
  tr:nth-child(2n + 1) {
    background-color: rgb(234, 234, 234);
  }
  
  tr:nth-child(2n + 2) {
    background-color: rgb(226, 237, 255);
  }
  
  td {
    padding: 10px;
    color: var(--light-text-color);
    text-align: center !important;
  }
  </style>