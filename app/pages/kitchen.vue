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
              <h3>Button Variants</h3>
            </template>
            <div class="button-grid">
              <UButton color="primary">Primary</UButton>
              <UButton variant="outline">Outline</UButton>
              <UButton variant="soft">Soft</UButton>
              <UButton variant="ghost">Ghost</UButton>
              <UButton variant="link">Link</UButton>
              <UButton color="gray">Gray</UButton>
              <UButton color="red">Red</UButton>
              <UButton color="green">Green</UButton>
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
            <NuxtLink to="/">Home Link</NuxtLink>
            <NuxtLink to="/profile">Profile Link</NuxtLink>
            <a href="#">External Link</a>
            <a href="#" class="link-muted">Muted Link</a>
            <a href="#" class="link-danger">Danger Link</a>
            <a href="#" class="link-success">Success Link</a>
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
              <input type="text" placeholder="Enter text..." class="input">
            </div>
            <div class="form-group">
              <label>Email Input</label>
              <input type="email" placeholder="email@example.com" class="input">
            </div>
            <div class="form-group">
              <label>Disabled Input</label>
              <input type="text" disabled placeholder="Disabled" class="input">
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Textarea & Select</h3>
            </template>
            <div class="form-group">
              <label>Textarea</label>
              <textarea placeholder="Enter long text..." class="textarea" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Select</label>
              <select class="select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Checkboxes & Radio</h3>
            </template>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" checked>
                <span>Checkbox Option 1</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox">
                <span>Checkbox Option 2</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" disabled>
                <span>Disabled Checkbox</span>
              </label>
            </div>
            <div class="form-group">
              <label class="radio-label">
                <input type="radio" name="radio" checked>
                <span>Radio Option 1</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="radio">
                <span>Radio Option 2</span>
              </label>
            </div>
          </UCard>
        </div>
      </section>

      <!-- Alerts Section -->
      <section class="section">
        <h2 class="section-title">Alerts & Notifications</h2>
        <div class="space-y-3">
          <div class="alert alert-info">
            <strong>Info:</strong> This is an informational message.
          </div>
          <div class="alert alert-success">
            <strong>Success:</strong> Operation completed successfully!
          </div>
          <div class="alert alert-warning">
            <strong>Warning:</strong> Please check your input.
          </div>
          <div class="alert alert-error">
            <strong>Error:</strong> Something went wrong.
          </div>
        </div>
      </section>

      <!-- Badges Section -->
      <section class="section">
        <h2 class="section-title">Badges & Tags</h2>
        <UCard>
          <div class="badge-showcase">
            <span class="badge badge-default">Default</span>
            <span class="badge badge-primary">Primary</span>
            <span class="badge badge-success">Success</span>
            <span class="badge badge-warning">Warning</span>
            <span class="badge badge-error">Error</span>
            <span class="badge badge-info">Info</span>
            <span class="badge badge-outline">Outline</span>
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
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td>Admin</td>
                  <td><span class="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>User</td>
                  <td><span class="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>Bob Johnson</td>
                  <td>bob@example.com</td>
                  <td>User</td>
                  <td><span class="badge badge-warning">Pending</span></td>
                </tr>
                <tr>
                  <td>Alice Williams</td>
                  <td>alice@example.com</td>
                  <td>Moderator</td>
                  <td><span class="badge badge-error">Inactive</span></td>
                </tr>
              </tbody>
            </table>
          </div>
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
          <hr class="divider">
          <p>Content below divider</p>
          <hr class="divider">
          <p>Another section with different spacing</p>
        </UCard>
      </section>

      <!-- Loading States -->
      <section class="section">
        <h2 class="section-title">Loading States</h2>
        <div class="dashboard-grid">
          <UCard>
            <template #header>
              <h3>Spinners</h3>
            </template>
            <div class="spinner-showcase">
              <div class="spinner"></div>
              <div class="spinner spinner-lg"></div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3>Skeleton Loading</h3>
            </template>
            <div class="skeleton-showcase">
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text" style="width: 60%;"></div>
            </div>
          </UCard>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { logout, user } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}
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

.logout-button {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
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

:deep(a) {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

:deep(a:hover) {
  color: #2563eb;
  text-decoration: underline;
}

.link-muted {
  color: var(--text-muted) !important;
}

.link-danger {
  color: #ef4444 !important;
}

.link-success {
  color: #10b981 !important;
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

.input, .textarea, .select {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus, .textarea:focus, .select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-label, .radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  color: var(--text);
}

.checkbox-label input, .radio-label input {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
}

/* Alert Styles */
.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
  margin-bottom: 1rem;
}

.alert-info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: var(--text);
}

.alert-success {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--text);
}

.alert-warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: var(--text);
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--text);
}

/* Badge Styles */
.badge-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-default {
  background: var(--bg-secondary);
  color: var(--text);
  border: 1px solid var(--border);
}

.badge-primary {
  background: #3b82f6;
  color: white;
}

.badge-success {
  background: #10b981;
  color: white;
}

.badge-warning {
  background: #f59e0b;
  color: white;
}

.badge-error {
  background: #ef4444;
  color: white;
}

.badge-info {
  background: #06b6d4;
  color: white;
}

.badge-outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
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

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--border);
}

.table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: var(--text);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.table tbody tr:hover {
  background: var(--bg-hover);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

/* Divider Styles */
.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5rem 0;
}

/* Loading Styles */
.spinner-showcase {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--border);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-lg {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.skeleton-showcase {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-hover) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.25rem;
}

.skeleton-text {
  height: 1rem;
  width: 100%;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

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

  .table-container {
    font-size: 0.875rem;
  }
}
</style>
