<script lang="ts" setup>
import { inject } from "vue"
import VLink from "../components/VLink.vue"
import { useTheme } from "../composables/useTheme"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import {
  faSun,
  faMoon,
  faLowVision,
} from "@fortawesome/free-solid-svg-icons"

interface Props {
  title?: string
}

const props = defineProps<Props>()
const currentPath = inject("currentPath")
const { theme, highContrast, toggleTheme, toggleHighContrast } = useTheme()
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <nav class="navbar">
      <div :class="[currentPath == '/plan' ? 'container-fluid' : 'container']">
        <VLink class="btn btn-link" to="/">
          <img src="../assets/logo_pev2.svg" alt="" style="height: 1.5rem" />
        </VLink>
        <div v-if="props?.title" class="text-center ms-auto">
          {{ props?.title }}
        </div>
        <VLink class="btn btn-secondary ms-auto" to="/">New Plan</VLink>
        <VLink class="btn btn-link" to="/about">About</VLink>
        <button
          class="btn btn-link theme-toggle"
          @click="toggleHighContrast"
          :class="{ active: highContrast }"
          :title="highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'"
        >
          <FontAwesomeIcon :icon="faLowVision" />
        </button>
        <button
          class="btn btn-link theme-toggle"
          @click="toggleTheme"
          :disabled="highContrast"
          :title="
            highContrast
              ? 'Disabled while high contrast is active'
              : theme === 'light'
                ? 'Switch to dark mode'
                : 'Switch to light mode'
          "
        >
          <FontAwesomeIcon :icon="theme === 'light' ? faMoon : faSun" />
        </button>
      </div>
    </nav>
    <slot></slot>
  </div>
</template>

<style scoped>
.theme-toggle.active {
  color: var(--color-link, #0d6efd);
}
.theme-toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
