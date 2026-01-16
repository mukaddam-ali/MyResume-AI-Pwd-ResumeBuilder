# z.ai Replication Prompt for "LoneStar Resume"

**Project Goal:**
Create a modern, client-side, ATS-friendly resume builder application called "LoneStar Resume". The application allows users to fill out their professional details, preview their resume in real-time with different templates, and download a high-quality PDF.

**Tech Stack:**
*   **Framework:** Next.js 16+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (v4) with `tailwindcss-animate` and `tailwind-merge`
*   **UI Components:** Shadcn UI (Radix Primitives)
*   **State Management:** Zustand (with persistence middleware)
*   **Drag & Drop:** @dnd-kit (Core, Sortable, Utilities)
*   **Animations:** Framer Motion
*   **PDF Generation:** @react-pdf/renderer (using `usePDF` hook)
*   **Icons:** Lucide React
*   **Forms:** React Hook Form + Zod (optional but recommended)

---

## 1. Core Data Structure (Zustand Store)
Create a centralized store (`useResumeStore`) using Zustand. It should persist to `localStorage`.
**State Interface:**
*   `personalInfo`: { fullName, email, phone, location, linkedin, website, github, summary }
*   `education`: Array of { id, school, degree, startDate, endDate, current }
*   `experience`: Array of { id, company, role, startDate, endDate, current, description }
*   `projects`: Array of { id, name, description, technologies, link }
*   `skills`: String (comma-separated)
*   `customSections`: Array of { id, title, items: [{ id, name, date, city, description }] }
*   `sectionOrder`: Array of strings (e.g., `['personal', 'experience', 'education', ...]`) to manage layout order.
*   `selectedTemplate`: String ('classic', 'modern', 'minimalist', 'github', 'creative')
*   `themeColor`: Hex string (e.g., `#112e51`)

**Actions:**
*   CRUD operations for all sections (add, remove, update).
*   `reorderSections(newOrder)`: To update the vertical order of resume sections.
*   `loadExampleData()`: To populate the store with dummy data for demonstration.

## 2. Page Structure & UI

### Landing Page (`app/page.tsx`)
*   **Hero Section:** High-impact heading "Build a Resume That Gets You Hired", gradient text, call-to-action buttons ("Build My Resume", "View Templates"). Use Framer Motion for entrance animations (fade-in, slide-up).
*   **Feature List:** A grid of cards showcasing features like "Instant Preview", "ATS Friendly", "PDF Export".
*   **Live Preview Mockup:** An animated 3D-tilted card showing a mock resume interface.

### Editor Page (`app/editor/page.tsx`)
*   **Layout:** A two-column layout.
    *   **Left Panel (Editor):** Scrollable form area.
    *   **Right Panel (Preview):** Live rendering of the resume.

#### Editor Panel Components
*   **Tabs/Navigation:** Use `dnd-kit` to create a sortable horizontal tab bar. Users can drag tabs to reorder the sections on the actual resume.
*   **Forms:**
    *   Dedicated forms for *Personal Info*, *Education*, *Experience*, *Projects*, *Skills*.
    *   **Add Custom Section:** Button to create arbitrary sections (e.g., "Volunteering").
*   **Rich Text:** Use a simple textarea that supports basic formatting or Markdown parsing for descriptions.

#### Preview Panel Components
*   **Header:** "Live Preview" title and a **Download PDF** button.
*   **Download Button:** Use `@react-pdf/renderer`'s `usePDF` hook. Renders a button that says "Preparing PDF..." while generating, then "Download PDF". Ensure the filename is dynamic (e.g., `John_Doe_Resume.pdf`).
*   **Live Resume Viewer:**
    *   Renders the resume stats as HTML/CSS for immediate feedback.
    *   Scales using a CSS transform to fit the screen width (`scale(0.8)` etc.).
    *   **Templates:** Implement 5 distinct designs:
        *   *Classic:* Standard layout, top-down.
        *   *Modern:* Sidebar with dark background for contact/skills, white main area.
        *   *Minimalist:* Clean typography, lots of whitespace, serif fonts.
        *   *Github:* Dark mode, monospace font, looks like code/IDE.
        *   *Creative:* Bold headers, colorful accents.

## 3. PDF Generation (`ResumeDocument.tsx`)
*   Replicate the exact same templates using `@react-pdf/renderer` primitives (`Page`, `View`, `Text`, `StyleSheet`).
*   **Crucial:** The PDF output must visually match the HTML preview logic.
*   Handle page breaks gracefully.

## 4. Key Behaviors
*   **Hydration:** Ensure the `DownloadResumeButton` handles client-side rendering correctly to avoid hydration mismatches (use `useState(false)` -> `useEffect(() => setIsClient(true))`).
*   **Responsiveness:** On mobile, stack the editor and preview vertically or use tabs to switch views.
*   **Theme Color:** Allow users to pick a primary accent color that updates both the HTML preview and the generated PDF.

## 5. Implementation Details
*   Use `lucide-react` for icons (Download, Plus, Trash, GripVertical).
*   Use `shadcn/ui` for Buttons, Tabs, Inputs, and Dialogs.
*   Structure the project with clear separation: `components/editor`, `components/preview`, `store`, `lib`.

**Prompt End.**
