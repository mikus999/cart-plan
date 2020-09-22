// Components


function page (path) {
  return () => import(/* webpackChunkName: '' */ `~/pages/${path}`).then(m => m.default || m)
}

export default [
  { path: '/', name: 'default', component: page('home.vue'), meta: { roles: [], auth: false } },
  { path: '/home', name: 'home', component: page('home.vue'), meta: { roles: ['publisher', 'elder'], auth: true } },

  { path: '/login', name: 'login', component: page('auth/login.vue'), meta: { roles: [], auth: false } },
  { path: '/register', name: 'register', component: page('auth/register.vue'), meta: { roles: [], auth: false } },
  { path: '/password/reset', name: 'password.request', component: page('auth/password/email.vue'), meta: { roles: [], auth: false } },
  { path: '/password/reset/:token', name: 'password.reset', component: page('auth/password/reset.vue'), meta: { roles: [], auth: false } },
  { path: '/email/verify/:id', name: 'verification.verify', component: page('auth/verification/verify.vue'), meta: { roles: [], auth: false } },
  { path: '/email/resend', name: 'verification.resend', component: page('auth/verification/resend.vue'), meta: { roles: [], auth: false } },

  { path: '/account/settings', name: 'account.index', component: page('account/index.vue'), meta: { roles: [], auth: true } },
  { path: '/team/join', name: 'teams.join', component: page('teams/join.vue'), meta: { roles: [], auth: true } },
  { path: '/team/settings', name: 'teams.index', component: page('teams/index.vue'), meta: { roles: [], auth: true } },
  { path: '/team/locations', name: 'teams.locations', component: page('teams/locations.vue'), meta: { roles: [], auth: true } },

  { path: '/schedule/edit/:id', name: 'schedules.edit', component: page('schedules/edit.vue'), meta: { roles: [], auth: true }, props: true },
  { path: '/schedule/assignments/:id', name: 'schedules.assignments', component: page('schedules/assignments.vue'), meta: { roles: [], auth: true }, props: true },
  { path: '/schedule/', name: 'schedules.index', component: page('schedules/index.vue'), meta: { roles: [], auth: true } },

  { path: '/translation', name: 'translation.index', component: page('translation/index.vue'), meta: { roles: ['translator'], auth: true }},

  { path: '/notfound', name: 'notfound', component: page('errors/404.vue'), meta: { roles: [], auth: false } },
  { path: '/accessdenied', name: 'accessdenied', component: page('errors/403.vue'), meta: { roles: [], auth: false } }

]
