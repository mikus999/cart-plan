import axios from 'axios'
import Cookies from 'js-cookie'
import * as types from '../mutation-types'

// state
export const state = {
  user: null,
  roles: null,
  siteRoles: null,
  teams: null,
  team: localStorage.getItem('team') ? localStorage.getItem('team') : null,
  token: Cookies.get('token')
}

// getters
export const getters = {
  user: state => state.user,
  roles: state => state.roles,
  siteRoles: state => state.siteRoles,
  teams: state => state.teams,
  team: state => state.team,
  hasTeam: state => state.hasTeam,
  token: state => state.token,
  check: state => state.user !== null,
  isSuperAdmin: state => state.roles['global'].indexOf('super_admin') >= 0
}

// mutations
export const mutations = {
  [types.SAVE_TOKEN] (state, { token, remember }) {
    state.token = token
    Cookies.set('token', token, { expires: remember ? 365 : null })
  },

  [types.FETCH_USER_SUCCESS] (state, { user }) {
    state.user = user
    state.roles = user.roles
    state.teams = user.teams
    state.hasTeam = user.teams !== null
  },

  [types.FETCH_USER_FAILURE] (state) {
    state.token = null
    Cookies.remove('token')
  },

  [types.FETCH_TEAMS] (state, payload) {
    state.teams = payload
  },

  [types.FETCH_SITEROLES] (state, { siteRoles }) {
    state.siteRoles = siteRoles
  },
  
  [types.LOGOUT] (state) {
    state.user = null
    state.roles = null
    state.token = null

    Cookies.remove('token')
  },

  [types.UPDATE_USER] (state, { user }) {
    state.user = user
  },

  [types.SET_TEAM] (state, payload) {
    state.team = payload
  },

  [types.SET_HASTEAM] (state, payload) {
    state.hasTeam = payload > 0
  },
}

// actions
export const actions = {
  saveToken ({ commit, dispatch }, payload) {
    commit(types.SAVE_TOKEN, payload)
  },

  fetchUser ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/user')
      .then(response => {
        const { data } = response
        commit(types.FETCH_USER_SUCCESS, { user: data })

        const objTeams = data.teams
        Object.keys(objTeams).forEach(function (item) {
          var objTeam = objTeams[item]

          if (objTeam.pivot.default_team === 1) {
            // call setTeam
          }
        });

        resolve()
      })
      .catch(error => {
        commit(types.FETCH_USER_FAILURE)
        reject()
      })
    })
  },

  fetchSiteRoles ({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/roles')
      .then(response => {
        commit(types.FETCH_SITEROLES, { siteRoles: response.data })

        resolve()
      })
    })
  },


  async setTeam ({ commit }, team) {  
    if (team !== undefined) {
      await axios({
        method: 'post',      
        url: '/api/teams/default/update',
        data: {
          teamid: team.id
        }
      })
      .then(response => {
        commit(types.SET_TEAM, team)
      })
    }
  },

  updateUser ({ commit }, payload) {
    commit(types.UPDATE_USER, payload)
  },

  async logout ({ commit }) {
    try {
      await axios.post('/api/logout')
    } catch (e) { }

    commit(types.LOGOUT)
  },

  async fetchOauthUrl (ctx, { provider }) {
    const { data } = await axios.post(`/api/oauth/${provider}`)

    return data.url
  }
}
