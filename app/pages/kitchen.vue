<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Kitchen Sink UI Showcase</h1>
        <div class="header-actions">
          <span class="user-info">{{ user?.display_name || user?.email }}</span>
          <NuxtLink to="/profile" class="profile-link">
            Profile
          </NuxtLink>
          <ThemeToggle />
          <button class="logout-button" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- Typography Section -->
      <section class="section">
        <h2 class="section-title">Typography</h2>
        <UCard>
          <h1>Heading 1 - Main Title</h1>
          <h2>Heading 2 - Section Title</h2>
          <h3>Heading 3 - Subsection Title</h3>
          <h4>Heading 4 - Minor Heading</h4>
          <h5>Heading 5 - Small Heading</h5>
          <h6>Heading 6 - Smallest Heading</h6>
          <p>Regular paragraph text with <strong>bold text</strong>, <em>italic text</em>, <u>underlined text</u>, and <a href="#">a link</a>.</p>
          <p class="text-muted">Muted text for secondary information.</p>
          <blockquote>This is a blockquote. It's used for quotations or callouts.</blockquote>
          <code>inline-code-example</code>
        </UCard>
      </section>

      <!-- Buttons Section -->
      <section class="section">
        <h2 class="section-title">Buttons</h2>
        <div class="dashboard-grid">
          <UCard>
            <template #header>
              <h3>Primary Buttons</h3>
            </template>
            <div class="button-grid">
              <UButton>Default</UButton>
              <UButton size="xs">Extra Small</UButton>
              <UButton size="sm">Small</UButton>
              <UButton size="lg">Large</UButton>
              <UButton size="xl">Extra Large</UButton>
              <UButton disabled>Disabled</UButton>
              <UButton loading>Loading</UButton>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Button Colors</h3>
            </template>
            <div class="button-grid">
              <UButton color="primary">Primary</UButton>
              <UButton color="secondary">Secondary</UButton>
              <UButton color="success">Success</UButton>
              <UButton color="info">Info</UButton>
              <UButton color="warning">Warning</UButton>
              <UButton color="error">Error</UButton>
              <UButton color="neutral">Neutral</UButton>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Button Variants</h3>
            </template>
            <div class="button-grid">
              <UButton variant="solid">Solid</UButton>
              <UButton variant="outline">Outline</UButton>
              <UButton variant="soft">Soft</UButton>
              <UButton variant="subtle">Subtle</UButton>
              <UButton variant="ghost">Ghost</UButton>
              <UButton variant="link">Link</UButton>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Block Buttons</h3>
            </template>
            <div class="space-y-3">
              <UButton block>Block Button</UButton>
              <UButton block variant="outline">Block Outline</UButton>
              <UButton block variant="soft">Block Soft</UButton>
            </div>
          </UCard>
        </div>
      </section>

      <!-- Links Section -->
      <section class="section">
        <h2 class="section-title">Links</h2>
        <UCard>
          <div class="link-showcase">
            <ULink to="/">Home Link</ULink>
            <ULink to="/profile">Profile Link</ULink>
            <ULink to="/kitchen" inactive-class="text-muted">Inactive Link</ULink>
            <ULink href="https://nuxt.com" external target="_blank">External Link</ULink>
            <ULink raw to="#" class="text-error hover:underline">Error Link</ULink>
            <ULink raw to="#" class="text-success hover:underline">Success Link</ULink>
            <ULink raw to="#" class="text-warning hover:underline">Warning Link</ULink>
          </div>
        </UCard>
      </section>

      <!-- Cards Section -->
      <section class="section">
        <h2 class="section-title">Cards</h2>
        <div class="dashboard-grid">
          <UCard>
            <template #header>
              <h3>Simple Card</h3>
            </template>
            <p>This is a simple card with a header and some content.</p>
          </UCard>

          <UCard>
            <template #header>
              <h3>Card with Footer</h3>
            </template>
            <p>This card has both a header and a footer.</p>
            <template #footer>
              <div class="card-footer">
                <UButton size="sm">Action</UButton>
                <UButton size="sm" variant="ghost">Cancel</UButton>
              </div>
            </template>
          </UCard>

          <UCard>
            <h3>Card without Header</h3>
            <p>This card has no header slot, just content.</p>
          </UCard>

          <UCard>
            <template #header>
              <h3>Stats Card</h3>
            </template>
            <div class="stats">
              <div class="stat-item">
                <div class="stat-value">1,234</div>
                <div class="stat-label">Users</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">567</div>
                <div class="stat-label">Posts</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">89</div>
                <div class="stat-label">Comments</div>
              </div>
            </div>
          </UCard>
        </div>
      </section>

      <!-- Forms Section -->
      <section class="section">
        <h2 class="section-title">Form Elements</h2>
        <div class="dashboard-grid">
          <UCard>
            <template #header>
              <h3>Text Inputs</h3>
            </template>
            <div class="form-group">
              <label>Default Input</label>
              <UInput placeholder="Enter text..." />
            </div>
            <div class="form-group">
              <label>Email Input</label>
              <UInput type="email" placeholder="email@example.com" />
            </div>
            <div class="form-group">
              <label>Disabled Input</label>
              <UInput disabled placeholder="Disabled" />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Textarea & Select</h3>
            </template>
            <div class="form-group">
              <label>Textarea</label>
              <UTextarea placeholder="Enter long text..." :rows="3" />
            </div>
            <div class="form-group">
              <label>Select</label>
              <USelect :items="['Option 1', 'Option 2', 'Option 3']" placeholder="Select an option" />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Checkboxes & Radio</h3>
            </template>
            <div class="form-group">
              <UCheckbox label="Checkbox Option 1" default-value />
              <UCheckbox label="Checkbox Option 2" />
              <UCheckbox label="Disabled Checkbox" disabled />
            </div>
            <div class="form-group">
              <URadioGroup v-model="radioValue" :items="[
                { label: 'Radio Option 1', value: '1' },
                { label: 'Radio Option 2', value: '2' }
              ]" />
            </div>
          </UCard>
        </div>
      </section>

      <!-- Alerts Section -->
      <section class="section">
        <h2 class="section-title">Alerts & Notifications</h2>
        <div class="space-y-3">
          <UAlert color="primary" variant="subtle" title="Info" description="This is an informational message." icon="i-lucide-info" />
          <UAlert color="success" variant="subtle" title="Success" description="Operation completed successfully!" icon="i-lucide-check-circle" />
          <UAlert color="warning" variant="subtle" title="Warning" description="Please check your input." icon="i-lucide-alert-triangle" />
          <UAlert color="error" variant="subtle" title="Error" description="Something went wrong." icon="i-lucide-x-circle" />
        </div>
      </section>

      <!-- Badges Section -->
      <section class="section">
        <h2 class="section-title">Badges & Tags</h2>
        <UCard>
          <div class="badge-showcase">
            <UBadge color="neutral" variant="solid" label="Default" />
            <UBadge color="primary" variant="solid" label="Primary" />
            <UBadge color="success" variant="solid" label="Success" />
            <UBadge color="warning" variant="solid" label="Warning" />
            <UBadge color="error" variant="solid" label="Error" />
            <UBadge color="info" variant="solid" label="Info" />
            <UBadge color="neutral" variant="outline" label="Outline" />
          </div>
        </UCard>
      </section>

      <!-- Lists Section -->
      <section class="section">
        <h2 class="section-title">Lists</h2>
        <div class="dashboard-grid">
          <UCard>
            <template #header>
              <h3>Unordered List</h3>
            </template>
            <ul>
              <li>First item in the list</li>
              <li>Second item in the list</li>
              <li>Third item with nested list:
                <ul>
                  <li>Nested item 1</li>
                  <li>Nested item 2</li>
                </ul>
              </li>
              <li>Fourth item in the list</li>
            </ul>
          </UCard>

          <UCard>
            <template #header>
              <h3>Ordered List</h3>
            </template>
            <ol>
              <li>First step</li>
              <li>Second step</li>
              <li>Third step with nested:
                <ol>
                  <li>Substep 1</li>
                  <li>Substep 2</li>
                </ol>
              </li>
              <li>Fourth step</li>
            </ol>
          </UCard>
        </div>
      </section>

      <!-- Table Section -->
      <section class="section">
        <h2 class="section-title">Table</h2>
        <UCard>
          <UTable :columns="tableColumns" :data="tableRows" />
        </UCard>
      </section>

      <!-- Code Block Section -->
      <section class="section">
        <h2 class="section-title">Code Blocks</h2>
        <UCard>
          <template #header>
            <h3>Code Example</h3>
          </template>
          <p>Inline code: <code>const x = 10;</code></p>
          <pre><code>// JavaScript Example
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');</code></pre>
        </UCard>
      </section>

      <!-- Dividers & Spacing -->
      <section class="section">
        <h2 class="section-title">Dividers & Spacing</h2>
        <UCard>
          <p>Content above divider</p>
          <USeparator />
          <p>Content below divider</p>
          <USeparator />
          <p>Another section with different spacing</p>
        </UCard>
      </section>

      <!-- Loading States -->
      <section class="section">
        <h2 class="section-title">Loading States</h2>
        <div class="dashboard-grid">
          <UCard>
            <template #header>
              <h3>Loading Buttons</h3>
            </template>
            <div class="button-grid">
              <UButton loading>Loading</UButton>
              <UButton loading size="lg">Large Loading</UButton>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Skeleton Loading</h3>
            </template>
            <div class="space-y-3">
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-[60%]" />
            </div>
          </UCard>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { h, resolveComponent } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { logout, user } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}

// Radio group model
const radioValue = ref('1')

// Table data
const tableColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name'
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email'))
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role'
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')
      const color = status === 'Active' ? 'success' : status === 'Pending' ? 'warning' : 'error'
      return h(resolveComponent('UBadge'), { color, label: status })
    }
  }
]

const tableRows = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Pending' },
  { name: 'Alice Williams', email: 'alice@example.com', role: 'Moderator', status: 'Inactive' }
]
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.dashboard-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  color: var(--text);
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.profile-link {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.profile-link:hover {
  background: var(--bg-hover);
}


.logout-button:hover {
  background: var(--bg-hover);
}

.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Section Styles */
.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.75rem;
  color: var(--text);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Typography Styles */
:deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
  color: var(--text);
  margin-top: 0;
}

:deep(h1) { font-size: 2.5rem; margin-bottom: 1rem; }
:deep(h2) { font-size: 2rem; margin-bottom: 0.875rem; }
:deep(h3) { font-size: 1.5rem; margin-bottom: 0.75rem; }
:deep(h4) { font-size: 1.25rem; margin-bottom: 0.625rem; }
:deep(h5) { font-size: 1.125rem; margin-bottom: 0.5rem; }
:deep(h6) { font-size: 1rem; margin-bottom: 0.5rem; }

:deep(p) {
  color: var(--text);
  line-height: 1.6;
  margin: 0.5rem 0;
}

.text-muted, :deep(.text-muted) {
  color: var(--text-muted);
}

:deep(blockquote) {
  border-left: 4px solid var(--border);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--text-muted);
  font-style: italic;
}

:deep(code) {
  background: var(--bg-secondary);
  color: var(--text);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
}

:deep(pre) {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

:deep(pre code) {
  background: none;
  padding: 0;
}

/* Button Styles */
.button-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* Link Styles */
.link-showcase {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Card Styles */
.card-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
  font-weight: 500;
}


/* Badge Styles */
.badge-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* List Styles */
:deep(ul), :deep(ol) {
  color: var(--text);
  line-height: 1.8;
  padding-left: 1.5rem;
}

:deep(li) {
  margin-bottom: 0.5rem;
}

:deep(ul ul), :deep(ol ol) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}



/* Loading Styles - handled by Nuxt UI components */

/* Nuxt UI Card overrides for dashboard */
:deep([class*="Card"]) {
  border-color: var(--border) !important;
}

[data-theme="dark"] :deep([class*="Card"]) {
  background-color: var(--bg-secondary) !important;
}

/* Ensure proper spacing */
.space-y-3 > * {
  margin-bottom: 0.75rem;
}

.space-y-3 > *:last-child {
  margin-bottom: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-content h1 {
    font-size: 1.25rem;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .button-grid {
    flex-direction: column;
  }

}
</style>
