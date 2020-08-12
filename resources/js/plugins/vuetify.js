import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.lightBlue.darken2,
        secondary: colors.lightBlue.darken4,
        accent: colors.lightBlue.accent4,
      }
    }
  }
})
