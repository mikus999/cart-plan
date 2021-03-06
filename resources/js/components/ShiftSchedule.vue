<template>
  <v-card width="100%" :loading="pageLoad">
    <v-card-title>
      <v-icon left>{{ icons.mdiCalendarMultiselect }}</v-icon>
      {{ $t('schedules.available_shifts') }}
    </v-card-title>


    <v-toolbar flat extended height="80">
      <v-select outlined :value="schedule" :items="schedules" item-value="id" item-text="date_start" return-object
        @change="changeSchedule" :prepend-icon="icons.mdiCalendarWeekBegin" :label="$t('schedules.week_of')" class="mt-10">

        <template v-slot:selection="{ item }">
          <div v-if="item">
            <v-icon :color="item.status == 1 ? 'primary' : 'grey'">{{ item.status == 1 ? icons.mdiLockOpenVariant : icons.mdiLock }}</v-icon>
            {{ item.date_start | formatDate }} - {{ $dayjs(item.date_start).add(7, 'd') | formatDate }}
          </div>
        </template>

        <template v-slot:item="{ item }">
          <div v-if="item">
            <v-icon :color="item.status == 1 ? 'primary' : 'grey'">{{ item.status == 1 ? icons.mdiLockOpenVariant : icons.mdiLock }}</v-icon>
            {{ item.date_start | formatDate }} - {{ $dayjs(item.date_start).add(7, 'd') | formatDate }}
          </div>
        </template>
      </v-select>

      <template v-slot:extension>
        <v-icon class="mr-2">{{ icons.mdiTune }}</v-icon>

        <v-switch 
          v-model="filter_shifts" 
          :label="$t('shifts.show_according_to_availability')" 
          hide-details
        />
      </template>

    </v-toolbar>

    <v-tabs 
      v-if="schedule !== null" 
      v-model="tab" 
      centered 
      align-with-title 
      fixed-tabs 
      show-arrows
      class="mt-6"
    >
      <v-tab 
        v-for="n in 7" 
        :key="n"
        :disabled="filterShifts(filter_shifts ? shifts_available : shifts, n).length == 0"
      >
        <v-badge 
          color="secondary" 
          :value="filterShifts(filter_shifts ? shifts_available : shifts, n) ? filterShifts(filter_shifts ? shifts_available : shifts, n).length : null" 
          :content="filterShifts(filter_shifts ? shifts_available : shifts, n) ? filterShifts(filter_shifts ? shifts_available : shifts, n).length : null" 
          offset-x="-3px"
        >
          {{ dayOfWeek(n) }}
        </v-badge>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="n in 7" :key="n">
        <v-row class="ma-2">
          <ShiftCard 
            v-for="shift in filterShifts(filter_shifts ? shifts_available : shifts, n)" 
            :key="shift.id" 
            :shift="shift" 
            :width="cardWidth" 
            class="ma-3"
          ></ShiftCard>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { helper, scheduling } from '~/mixins/helper'
import ShiftCard from '~/components/ShiftCard.vue'

export default {
  middleware: ['auth', 'teams'],
  layout: 'sidebar',
  mixins: [helper, scheduling],
  components: {
    ShiftCard
  },

  data () {
    return {
      tab: 0,
      schedules: null,
      hover: false,
      filter_shifts: true,
      pageLoad: true
    }
  },

  computed: {
    ...mapGetters({
      schedule: 'scheduling/schedule',
      shifts: 'scheduling/shifts',
      user_shifts: 'scheduling/user_shifts',
      shifts_available: 'scheduling/shifts_available',
      shift_conflicts: 'scheduling/shift_conflicts',
    }),

    cardWidth () {
      var width = null

      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          width = '100%'
          break
        case 'sm':
          width = '29%'
          break
        case 'md':
          width = '22%'
          break
        case 'xl':
          width = '16%'
          break
        default:
          width = '22%'
      }

      return width
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      await this.getUserShifts()
      this.pageLoad = false
    },

    async getUserShifts () {
      await axios.get('/api/user/shifts')
        .then(response => {
          this.storeUserShifts(response.data.data.shifts)
          this.getSchedData()
        })
    },

    async getSchedData () {
      await axios.get('/api/schedules/' + this.team.id)
        .then(response => {
          this.schedules = response.data.data.schedules

          // Filter schedules to only show those with status of 1 (ASSIGNMENTS) or 2 (FINAL)
          this.schedules = this.schedules.filter(sched => ["1","2"].indexOf(sched.status) > -1)
                  
          const prevWeek = this.$dayjs().subtract(8, 'd').format('YYYY-MM-DD')
          this.schedules = this.schedules.filter(sched => (sched.date_start >= prevWeek))

          if (this.schedules[0] !== undefined) {
            this.storeSchedule(this.schedules[0])
            this.getShiftData()
          }
        })
    },

    async getShiftData () {
      await axios.get('/api/schedules/' + this.schedule.id + '/shifts')
        .then(response => {
          this.storeShifts(response.data.data.shifts)
          this.storeShiftsAvailable(this.filterShiftsAvailability(response.data.data.shifts, this.user))
          this.checkConflictsAllUserShifts()

          for (var n = 1; n <= 7; n++) {
            if (this.filterShifts(this.shifts_available, n).length > 0) {
              this.tab = (n - 1)
              break
            }
          }
        })
    },

    async changeSchedule(value) {
      this.pageLoad = true
      await this.storeSchedule(value)
      await this.getShiftData()
      this.pageLoad = false
    },

    dayOfWeek (daynum) {
      var days = []
      days = this.$dayjs().localeData().weekdaysShort()
      days[7] = days[0]
      return days[daynum]
    },

    filterShifts (shifts, day) {
      var filtered = []

      if (shifts !== null) {
        filtered = shifts.filter(s => this.$dayjs(s.time_start).isoWeekday() == day)
      }
      return filtered
    }
  }

}
</script>