<script setup lang="ts">
import { ref } from 'vue';

interface Tag {
  name: string;
  checked: boolean;
  color: string;
}

const tags = ref<Tag[]>([
  { name: 'School', checked: true, color: '#3b82f6' },
  { name: 'Work', checked: true, color: '#10b981' },
  { name: 'Birthdays', checked: true, color: '#ef4444' },
]);

function toggleChecked(tag: Tag) {
  tag.checked = !tag.checked;
}

function checkboxName(tagName: string): string {
  return `tag-${tagName.toLowerCase()}`;
}
</script>

<template>
  <div class="event-tags">
    <span class="title">{{ $t('tagsTitle') }}:</span>
    <label v-for="tag in tags" :key="tag.name" class="tag-label" :style="{ '--tag-color': tag.color }">
      <input
        type="checkbox"
        :id="checkboxName(tag.name)"
        :name="checkboxName(tag.name)"
        :checked="tag.checked"
        @change="toggleChecked(tag)"
        hidden
      />
      <span class="custom-checkbox" />
      <span class="tag-name">{{ tag.name }}</span>
    </label>
  </div>
</template>

<style scoped>
.event-tags {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  > .title {
    align-self: center;
    font-weight: bold;
  }
}

.tag-label {
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

.tag-name {
  font-weight: 500;
}

.custom-checkbox {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: var(--small-border-radius);
  border: 2px solid var(--tag-color);
}

input:checked + .custom-checkbox {
  background-color: var(--tag-color);
}
</style>
