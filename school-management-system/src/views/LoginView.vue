<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
          <svg class="w-9 h-9 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white">Greenfield Academy</h1>
        <p class="text-indigo-200 mt-1">School Management System</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input v-model="form.email" type="email" required class="input-field" placeholder="you@school.edu" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPwd ? 'text' : 'password'" required class="input-field pr-10" placeholder="••••••••" />
              <button type="button" @click="showPwd = !showPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!showPwd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full justify-center flex items-center gap-2">
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <!-- Demo accounts -->
        <div class="mt-6 pt-6 border-t border-gray-100">
          <p class="text-xs text-gray-500 text-center mb-3 font-medium uppercase tracking-wide">Demo Accounts</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="demo in demoAccounts" :key="demo.role"
              @click="fillDemo(demo)"
              class="text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <div class="flex items-center gap-2">
                <div :class="`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${demo.color}`">
                  {{ demo.avatar }}
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">{{ demo.label }}</p>
                  <p class="text-xs text-gray-400">{{ demo.email }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <p class="text-center text-indigo-300 text-sm mt-6">
        © 2026 Greenfield Academy · School Management System v2.0
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPwd = ref(false)

const demoAccounts = [
  { role: 'admin', label: 'Administrator', email: 'admin@school.edu', password: 'admin123', avatar: 'AD', color: 'bg-indigo-600' },
  { role: 'teacher', label: 'Teacher', email: 'teacher@school.edu', password: 'teacher123', avatar: 'TC', color: 'bg-emerald-600' },
  { role: 'student', label: 'Student', email: 'student@school.edu', password: 'student123', avatar: 'ST', color: 'bg-amber-500' },
  { role: 'parent', label: 'Parent', email: 'parent@school.edu', password: 'parent123', avatar: 'PR', color: 'bg-rose-500' },
]

function fillDemo(demo) {
  form.value.email = demo.email
  form.value.password = demo.password
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  const result = auth.login(form.value.email, form.value.password)
  loading.value = false
  if (result.success) {
    router.push(`/${result.user.role}`)
  } else {
    error.value = result.error
  }
}
</script>
