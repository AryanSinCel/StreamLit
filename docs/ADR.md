# Architecture Decision Record (ADR) — MovieList

---

## Decision: PSD-scoped sessions with explicit rules in every prompt

**What:**  
Each PSD task was implemented as a **separate session**. Every session prompt explicitly attached relevant **`@rules/*.mdc`** files instead of relying only on globally applied / implicit rules.

**Context:**  
Relying on implicit or `alwaysApply` rules led to:

- AI **ignoring constraints** (e.g. using `axios` outside the API layer)
- **Architecture violations** (remote logic inside screens, incorrect layering)

AI tended to prioritise its defaults over implicit constraints.

**Prompt strategy:**

- **Initial:** Minimal prompts assuming rules would be followed → **incorrect outputs** (wrong layers, wrong imports)
- **Recovery:**
  - Attached **task-specific rule files** (`api`, `hooks`, `components`, `store`, `theming`)
  - Added explicit constraint:  
    _“Follow attached rules strictly over any assumptions”_
  - Standardised PSD session prompts to always include required rules

**Trade-offs:**

| Gave up | Gained |
|--------|--------|
| Shorter prompts and less repetition | **Consistent architecture enforcement** |
| Faster initial prompting | **Reduced rework and repeated violations** |

---

## Decision: UI-first implementation, then API integration

**What:**  
Built screens in **two phases**:

1. **UI-only** using static/mock data to match Stitch/PNG designs exactly  
2. **API integration** replacing mock data with real hooks without changing layout  

**Context:**  
Building UI and API together caused:

- Layout instability due to **loading/error states**
- Difficulty achieving **pixel-perfect design matching**
- Confusion between **UI issues vs data/state issues**

**Prompt strategy:**

- **Initial:** Combined UI + API → **broken layouts and inconsistencies**
- **Recovery:**
  - Phase A: _“Build UI only with static data, no API logic”_
  - Phase B: _“Replace mocks with real data, do not change layout”_
  - Ensured mock data matched API shape to avoid refactoring

**Trade-offs:**

| Gave up | Gained |
|--------|--------|
| Additional integration step (mock → real data) | **Accurate UI implementation** |
| Slight duplication in data wiring | **Clear separation of concerns** |
| Increased initial effort | **Simpler debugging and fewer regressions** |

---

## Decision: Navigation — Detail outside tab navigator (root stack)

**What:**  
Moved the **Detail screen outside the tab navigator** into a **root stack**, ensuring it renders full-screen without the bottom tab bar.

**Context:**  
Keeping Detail inside tabs caused:

- **Tab bar visible** on Detail (incorrect UX)
- Attempts to hide the tab bar being **hacky and unreliable**
- Risk of incorrect **back navigation behavior**

The spec requires stack-based navigation where back returns to the **previous screen**, not Home.

**Prompt strategy:**

- **Initial:** Tried hiding tab bar conditionally → inconsistent results
- **Recovery:**
  - Refactored navigation: Root Stack → Tabs → Screens
  - Pushed Detail on top of tabs
  - Updated navigation types and ensured correct back behavior using `goBack()`

**Trade-offs:**

| Gave up | Gained |
|--------|--------|
| Simpler navigation structure | **Correct full-screen Detail experience** |
| Lower initial complexity | **Proper stack-based back navigation** |

---

## Decision: Explicit component extraction instead of relying only on rules

**What:**  
Prompts explicitly required:

- Identifying repeated UI patterns  
- Extracting them into `src/components/common/`  
- Refactoring all usages to shared components  

**Context:**  
Even with component rules:

- AI still **duplicated UI code**
- UI became **inconsistent across screens**
- Rules alone were **not enforced strongly**

**Prompt strategy:**

- **Initial:** “Follow component rules” → duplication persisted
- **Recovery:**
  - Added explicit instructions:
    - _“Scan for repeated UI patterns”_
    - _“Extract reusable components”_
    - _“Refactor all usages”_
  - Applied across Home, Search, and Watchlist screens

**Trade-offs:**

| Gave up | Gained |
|--------|--------|
| Extra refactoring effort after initial implementation | **Consistent and reusable UI system** |
| Longer, more detailed prompts | **Improved maintainability and scalability** |

---