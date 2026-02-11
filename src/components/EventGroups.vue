<script setup lang="ts">
import { ref } from 'vue';

interface Group {
  name: string;
  checked: boolean;
  color: string;
}

const groups = ref<Group[]>([
  { name: 'School', checked: true, color: '#3b82f6' },
  { name: 'Work', checked: true, color: '#10b981' },
  { name: 'Birthdays', checked: true, color: '#ef4444' },
]);

function toggleChecked(group: Group) {
  group.checked = !group.checked;
}

function checkboxName(groupName: string): string {
  return `group-${groupName.toLowerCase()}`;
}
</script>

<template>
  <div class="event-groups">
    <span class="title">Tags:</span>
    <label v-for="group in groups" :key="group.name" class="group-label" :style="{ '--group-color': group.color }">
      <input
        type="checkbox"
        :id="checkboxName(group.name)"
        :name="checkboxName(group.name)"
        :checked="group.checked"
        @change="toggleChecked(group)"
        hidden
      />
      <span class="custom-checkbox" />
      <span class="group-name">{{ group.name }}</span>
    </label>
  </div>
</template>

<style scoped>
.event-groups {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  > .title {
    align-self: center;
    font-weight: bold;
  }
}

.group-label {
  display: flex;
  align-items: center;
  gap: 0.7rem;

  padding: 0.3rem 0.5rem;
  border-radius: var(--small-border-radius);

  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: var(--sidebar-hover-color);
  }
}

.group-name {
  font-weight: 500;
}

.custom-checkbox {
  width: 1rem;
  height: 1rem;
  border-radius: var(--small-border-radius);
  border: 3px solid var(--group-color);
}

input:checked + .custom-checkbox {
  background-color: var(--group-color);
}
</style>
