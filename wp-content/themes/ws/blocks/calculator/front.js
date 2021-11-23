import Vue from 'vue/dist/vue.esm.js'

if (document.querySelector('.front-end .wp-block-ws-calculator')) {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const calc = new Vue({
    el: '.front-end .wp-block-ws-calculator',
    data: {
      step: 0,
      totalSteps: document.querySelectorAll('.slides li').length,
      data: {}
    },
    created: function() {
      const selects = document.querySelectorAll('select')
      const fieldsets = document.querySelectorAll('fieldset')
      const hiddens = document.querySelectorAll('input[type=hidden]')
      hiddens.forEach(hidden => {
        this.data[hidden.name] = hidden.value
      })
      selects.forEach(select => {
        this.data[select.name] = select.value
      })
      fieldsets.forEach(fieldset => {
        const radios = fieldset.querySelectorAll('input[type=radio]')
        const checkboxes = fieldset.querySelectorAll('input[type=checkbox]')
        let value = []
        radios.forEach(radio => {
          if (radio.checked) {
            value = radio.value
          }
        })
        checkboxes.forEach(checkbox => {
          if (checkbox.checked) {
            value.push(checkbox.value)
          }
        })
        this.data[fieldset.id] = value
      })
    },
    methods: {
      changeStep: function(s) {
        if (s < this.step) {
          this.step = s
          return
        }
        const fields = this.$refs[this.step].querySelectorAll('input, textarea, select')
        fields.forEach(field => {
          field.classList.remove('invalid')
          if ((field.tagName.toLowerCase() === 'input' && field.type !== 'radio' && field.type !== 'checkbox') || field.tagName.toLowerCase() === 'textarea') {
            if (!field.getAttribute('placeholder')) {
              if (!this.data[field.name]) {
                field.classList.add('invalid')
              }
            }
          }
          if (field.tagName.toLowerCase() === 'select') {
            if (!this.data[field.name]) {
              field.classList.add('invalid')
            }
          }
          if (field.type === 'radio' || field.type === 'checkbox') {
            if (!this.data[field.name] || this.data[field.name].length === 0) {
              document.querySelector('#' + field.name).classList.add('invalid')
            }
            else {
              document.querySelector('#' + field.name).classList.remove('invalid')
            }
          }
        })
        if (this.$refs[this.step].querySelector('.invalid')) {
          return
        }
        this.step = s
      }
    },
    watch: {
    }
  })
}
