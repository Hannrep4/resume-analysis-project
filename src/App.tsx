import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

type Workload = 'Light' | 'Moderate' | 'Heavy' | 'Overwhelming'
type CompanionState = 'Thriving' | 'Neutral' | 'Stressed' | 'Overwhelmed'
type PetType = 'cat' | 'dog' | 'bunny' | 'bird' | 'turtle' | 'fish'
type StatusFilter = 'all' | 'active' | 'completed' | 'overdue'
type WorkloadFilter = 'all' | Workload
type TextScale = 'normal' | 'large' | 'x-large'

type Assignment = {
  id: string
  title: string
  course: string
  dueDate: string
  workload: Workload
  completed: boolean
}

type AccessibilitySettings = {
  textScale: TextScale
  darkMode: boolean
  highContrast: boolean
  reducedMotion: boolean
}

const WORKLOADS: Workload[] = ['Light', 'Moderate', 'Heavy', 'Overwhelming']

const COMPANION_COPY: Record<CompanionState, string> = {
  Thriving: 'You are in a steady rhythm. Keep going at your pace.',
  Neutral: 'This looks manageable. A small next step is enough.',
  Stressed: 'Things feel heavier right now. Start with one simple task.',
  Overwhelmed: 'Take it gently. One finished task is a meaningful reset.',
}

const PET_LABELS: Record<PetType, string> = {
  cat: 'Cat',
  dog: 'Dog',
  bunny: 'Bunny',
  bird: 'Bird',
  turtle: 'Turtle',
  fish: 'Fish',
}

const PET_OPTION_PREVIEW: Record<PetType, string> = {
  cat: '😺',
  dog: '🐶',
  bunny: '🐰',
  bird: '🐦',
  turtle: '🐢',
  fish: '🐠',
}

const PET_EXPRESSIONS: Record<PetType, Record<CompanionState, string>> = {
  cat: {
    Thriving: '😸',
    Neutral: '😺',
    Stressed: '😿',
    Overwhelmed: '🙀',
  },
  dog: {
    Thriving: '🐶✨',
    Neutral: '🐶',
    Stressed: '🐕‍🦺💭',
    Overwhelmed: '🐶...',
  },
  bunny: {
    Thriving: '🐰🌟',
    Neutral: '🐰',
    Stressed: '🐰💧',
    Overwhelmed: '🐰...',
  },
  bird: {
    Thriving: '🐦✨',
    Neutral: '🐦',
    Stressed: '🐦💭',
    Overwhelmed: '🐦...',
  },
  turtle: {
    Thriving: '🐢🌟',
    Neutral: '🐢',
    Stressed: '🐢💧',
    Overwhelmed: '🐢...',
  },
  fish: {
    Thriving: '🐠✨',
    Neutral: '🐠',
    Stressed: '🐠💭',
    Overwhelmed: '🐠...',
  },
}

type CompanionPetFieldsProps = {
  petName: string
  onPetNameChange: (value: string) => void
  petType: PetType
  onPetTypeChange: (value: PetType) => void
}

function CompanionPetFields({ petName, onPetNameChange, petType, onPetTypeChange }: CompanionPetFieldsProps) {
  return (
    <>
      <label htmlFor="pet-name">Name</label>
      <input
        id="pet-name"
        required
        value={petName}
        onChange={(event) => onPetNameChange(event.target.value)}
      />

      <fieldset className="pet-picker" aria-label="Pick a pet">
        <legend>Pick an AssignMate</legend>
        <div className="pet-options" role="radiogroup" aria-label="Pet type options">
          {(Object.keys(PET_LABELS) as PetType[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`pet-option ${petType === option ? 'selected' : ''}`}
              role="radio"
              aria-checked={petType === option}
              onClick={() => onPetTypeChange(option)}
            >
              <span className="pet-option-preview" aria-hidden="true">
                {PET_OPTION_PREVIEW[option]}
              </span>
              <span className="pet-option-label">{PET_LABELS[option]}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </>
  )
}

type CompanionConfigurationPageProps = {
  petName: string
  petType: PetType
  onPetNameChange: (value: string) => void
  onPetTypeChange: (value: PetType) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function CompanionConfigurationPage({
  petName,
  petType,
  onPetNameChange,
  onPetTypeChange,
  onSubmit,
}: CompanionConfigurationPageProps) {
  return (
    <section className="configure-page" aria-labelledby="configure-title">
      <div className="configure-layout">
        <aside className="configure-copy card" aria-label="AssignMate setup overview">
          <p className="eyebrow">AssignMate setup</p>
          <h1 id="configure-title">Who's your AssignMate?</h1>
          <p className="configure-description">
            Start with a name, then choose an AssignMate you want to bring into the platform.
          </p>

          <div className="configure-preview" aria-label="AssignMate preview">
            <div className="companion-avatar configure-avatar" aria-hidden="true">
              <span className="companion-face">{PET_OPTION_PREVIEW[petType]}</span>
            </div>
            <div className="configure-preview-copy">
              <h2>{petName.trim() || 'Your AssignMate'}</h2>
            </div>
          </div>
        </aside>

        <form className="card configure-card" onSubmit={onSubmit}>
          <div className="assignment-form configure-form">
            <div className="configure-fields">
              <CompanionPetFields
                petName={petName}
                onPetNameChange={onPetNameChange}
                petType={petType}
                onPetTypeChange={onPetTypeChange}
              />
              <p className="configure-note">Your selected AssignMate will show up in your dashboard and change as you add and complete assignments!</p>
            </div>

            <div className="form-actions">
              <button type="submit" className="button-primary">
                Continue to Dashboard
              </button>
              <Link to="/" className="button-subtle">
                Back
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

function makeId() {
  return `${Date.now()}-${Math.round(Math.random() * 10_000)}`
}

function isOverdue(assignment: Assignment) {
  if (assignment.completed) return false
  const due = new Date(assignment.dueDate)
  const now = new Date()
  due.setHours(23, 59, 59, 999)
  return due.getTime() < now.getTime()
}

function getTodayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getCompanionState(assignments: Assignment[]): CompanionState {
  if (assignments.length === 0) return 'Neutral'

  const overdueCount = assignments.filter(isOverdue).length
  const completedCount = assignments.filter((item) => item.completed).length
  const heavyOpen = assignments.filter(
    (item) => !item.completed && (item.workload === 'Heavy' || item.workload === 'Overwhelming'),
  ).length
  const completionRate = completedCount / assignments.length

  if (overdueCount >= 3 || heavyOpen >= 4) return 'Overwhelmed'
  if (overdueCount >= 1 || heavyOpen >= 2) return 'Stressed'
  if (completionRate >= 0.6 && overdueCount === 0) return 'Thriving'
  return 'Neutral'
}

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [newAssignmentId, setNewAssignmentId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false)
  const [isPetNameOpen, setIsPetNameOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Assignment | null>(null)
  const [petName, setPetName] = useState('Miso')
  const [petType, setPetType] = useState<PetType>('cat')
  const [setupPetName, setSetupPetName] = useState('Miso')
  const [setupPetType, setSetupPetType] = useState<PetType>('cat')
  const [petNameDraft, setPetNameDraft] = useState('Miso')
  const [petTypeDraft, setPetTypeDraft] = useState<PetType>('cat')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [workloadFilter, setWorkloadFilter] = useState<WorkloadFilter>('all')
  const [formValues, setFormValues] = useState({
    title: '',
    course: '',
    dueDate: '',
    workload: 'Moderate' as Workload,
  })
  const [settings, setSettings] = useState<AccessibilitySettings>({
    textScale: 'normal',
    darkMode: false,
    highContrast: false,
    reducedMotion: false,
  })

  const companionState = useMemo(() => getCompanionState(assignments), [assignments])

  const assignmentStats = useMemo(() => {
    const todayKey = getTodayKey()
    const completed = assignments.filter((item) => item.completed).length
    const dueToday = assignments.filter((item) => !item.completed && item.dueDate === todayKey).length
    const dueLater = assignments.filter((item) => !item.completed && item.dueDate > todayKey).length
    return { completed, dueToday, dueLater }
  }, [assignments])

  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((item) => {
        if (workloadFilter !== 'all' && item.workload !== workloadFilter) return false
        if (statusFilter === 'all') return !item.completed
        if (statusFilter === 'completed') return item.completed
        if (statusFilter === 'active') return !item.completed
        if (statusFilter === 'overdue') return isOverdue(item)
        return true
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [assignments, statusFilter, workloadFilter])

  function resetForm() {
    setEditingId(null)
    setFormValues({
      title: '',
      course: '',
      dueDate: '',
      workload: 'Moderate',
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = {
      title: formValues.title.trim(),
      course: formValues.course.trim(),
      dueDate: formValues.dueDate,
      workload: formValues.workload,
    }
    if (!next.title || !next.course || !next.dueDate) return

    if (editingId) {
      setAssignments((items) =>
        items.map((item) => (item.id === editingId ? { ...item, ...next } : item)),
      )
    } else {
      const newId = makeId()
      setAssignments((items) => [
        ...items,
        {
          id: newId,
          completed: false,
          ...next,
        },
      ])
      setNewAssignmentId(newId)
      setTimeout(() => setNewAssignmentId(null), 500)
    }
    resetForm()
    setIsAssignmentFormOpen(false)
  }

  function startEditing(assignment: Assignment) {
    setEditingId(assignment.id)
    setFormValues({
      title: assignment.title,
      course: assignment.course,
      dueDate: assignment.dueDate,
      workload: assignment.workload,
    })
    setIsAssignmentFormOpen(true)
  }

  function handleDelete(assignment: Assignment) {
    setPendingDelete(assignment)
  }

  function confirmDelete() {
    if (!pendingDelete) return

    setAssignments((items) => items.filter((item) => item.id !== pendingDelete.id))
    if (editingId === pendingDelete.id) {
      resetForm()
    }
    setPendingDelete(null)
  }

  function toggleComplete(id: string) {
    setAssignments((items) =>
      items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    )
  }

  function handlePetNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextName = petNameDraft.trim()
    if (!nextName) return
    setPetName(nextName)
    setPetType(petTypeDraft)
    setIsPetNameOpen(false)
  }

  function handleSetupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextName = setupPetName.trim()
    if (!nextName) return
    setPetName(nextName)
    setPetType(setupPetType)
    navigate('/dashboard')
  }

  const appClasses = ['app-shell', settings.textScale]
  if (settings.darkMode) appClasses.push('dark-mode')
  if (settings.highContrast) appClasses.push('high-contrast')
  if (settings.reducedMotion) appClasses.push('reduced-motion')

  return (
    <div className={appClasses.join(' ')}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {location.pathname !== '/' && (
        <Link to="/" className="site-home-link" aria-label="Go to landing page">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M3 10.8 12 3l9 7.8M6.5 9.8V21h11V9.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}

      <button
        type="button"
        className="icon-trigger"
        aria-label="Open accessibility settings"
        onClick={() => setIsAccessibilityOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="4.5" r="2" fill="currentColor" />
          <path
            d="M12 7.5v4.5M5.5 10.5h13M9.5 20l2.5-4.5L14.5 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <main id="main-content">
        <div key={location.pathname} className="page-transition">
        <Routes>
          <Route
            path="/"
            element={
              <section className="landing" aria-labelledby="landing-title">
                <div className="landing-copy">
                  <h1 id="landing-title">AssignMates!</h1>
                  <p>Your supportive school assignment companion</p>
                  <div className="cta-row">
                    <Link
                      to="/configure"
                      className="button-primary"
                      onClick={() => {
                        setSetupPetName(petName)
                        setSetupPetType(petType)
                      }}
                    >
                      Let&apos;s get started
                    </Link>
                  </div>
                  <section className="landing-capabilities" aria-labelledby="capabilities-title">
                    <h2 id="capabilities-title">What we can do for you:</h2>
                    <div className="capability-pills" role="list" aria-label="AssignMates companion capabilities">
                      <article className="capability-pill" role="listitem" aria-label="Cat companion capability">
                        <div className="capability-portrait-shell" aria-hidden="true">
                          <span className="capability-portrait">😺</span>
                        </div>
                        <h3 className="capability-title">Break Work Into Steps</h3>
                        <p>I can help you break assignments into calmer, manageable steps.</p>
                      </article>

                      <article className="capability-pill" role="listitem" aria-label="Dog companion capability">
                        <div className="capability-portrait-shell" aria-hidden="true">
                          <span className="capability-portrait">🐶</span>
                        </div>
                        <h3 className="capability-title">Encourage Progress</h3>
                        <p>I can cheer you on and reflect your progress as tasks are completed.</p>
                      </article>

                      <article className="capability-pill" role="listitem" aria-label="Bunny companion capability">
                        <div className="capability-portrait-shell" aria-hidden="true">
                          <span className="capability-portrait">🐰</span>
                        </div>
                        <h3 className="capability-title">Organize Priorities</h3>
                        <p>I can help you organize due dates and surface what needs attention first.</p>
                      </article>
                    </div>
                  </section>
                </div>
              </section>
            }
          />

          <Route
            path="/configure"
            element={
              <CompanionConfigurationPage
                petName={setupPetName}
                petType={setupPetType}
                onPetNameChange={setSetupPetName}
                onPetTypeChange={setSetupPetType}
                onSubmit={handleSetupSubmit}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <section className="dashboard" aria-labelledby="dashboard-title">
                <div className="dashboard-header">
                  <h2 id="dashboard-title">Assignment Dashboard</h2>
                </div>

                  <section className="dashboard-top">
                    <section className="card stats-card" aria-labelledby="stats-title">
                      <h3 id="stats-title">Assignment Stats</h3>
                      <ul className="stats-list" aria-label="Assignment progress stats">
                        <li data-stat-type="completed">
                          <span className="stat-label">Completed</span>
                          <strong className="stat-value">{assignmentStats.completed}</strong>
                        </li>
                        <li data-stat-type="duetoday">
                          <span className="stat-label">Due today</span>
                          <strong className="stat-value">{assignmentStats.dueToday}</strong>
                        </li>
                        <li data-stat-type="duelater">
                          <span className="stat-label">Due later</span>
                          <strong className="stat-value">{assignmentStats.dueLater}</strong>
                        </li>
                      </ul>
                    </section>

                    <aside className="card companion-card" aria-live="polite">
                      <div className="companion-content">
                        <div className="companion-avatar" aria-hidden="true">
                          <span className="companion-face" data-emoji-count={PET_EXPRESSIONS[petType][companionState].length}>{PET_EXPRESSIONS[petType][companionState]}</span>
                        </div>
                        <div className="companion-message-col">
                          <div className="companion-title-row">
                            <h3><span className="pet-name-highlight">{petName}</span> is {companionState.toLowerCase()} and says:</h3>
                            <button
                              type="button"
                              className="companion-name-edit"
                              aria-label="Edit pet name"
                              onClick={() => {
                                setPetNameDraft(petName)
                                setPetTypeDraft(petType)
                                setIsPetNameOpen(true)
                              }}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path
                                  d="m4 20 4.5-1 9.2-9.2a1.7 1.7 0 0 0 0-2.4l-1.1-1.1a1.7 1.7 0 0 0-2.4 0L5 15.6 4 20Z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="companion-bubble">
                            <p>{COMPANION_COPY[companionState]}</p>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </section>

                  <section className="dashboard-bottom">
                    <section className="card add-trigger-card" aria-label="Add assignment">
                      <button
                        type="button"
                        className="add-square-button"
                        aria-label="Open add assignment form"
                        onClick={() => {
                          resetForm()
                          setIsAssignmentFormOpen(true)
                        }}
                      >
                        <span className="add-plus" aria-hidden="true">
                          +
                        </span>
                      </button>
                    </section>

                    <section className="card assignments-section" aria-labelledby="assignment-list-title">
                      <div className="assignments-header-row">
                        <h3 id="assignment-list-title">Assignments</h3>
                        <div className="filter-row">
                          <label htmlFor="status-filter">Status</label>
                          <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                          >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                          </select>

                          <label htmlFor="workload-filter">Workload</label>
                          <select
                            id="workload-filter"
                            value={workloadFilter}
                            onChange={(event) => setWorkloadFilter(event.target.value as WorkloadFilter)}
                          >
                            <option value="all">All</option>
                            {WORKLOADS.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="assignments-scroll-area">
                        {filteredAssignments.length === 0 ? (
                          <p className="empty-state">No assignments match this view right now.</p>
                        ) : (
                          <ul className="assignment-list" aria-label="Assignment list">
                            {filteredAssignments.map((item) => {
                              const overdue = isOverdue(item)
                              const isNew = item.id === newAssignmentId
                              return (
                                <li key={item.id} className={`assignment-card${isNew ? ' new-assignment' : ''}`}>
                                  <div className="assignment-main">
                                    <h4>{item.title}</h4>
                                    <p>{item.course}</p>
                                    <p>Due {item.dueDate}</p>
                                    <span className={`workload ${item.workload.toLowerCase()}`}>{item.workload}</span>
                                    {overdue && <p className="overdue">Overdue</p>}
                                  </div>

                                  <div className="assignment-actions">
                                    <button type="button" onClick={() => toggleComplete(item.id)}>
                                      {item.completed ? 'Mark active' : 'Mark complete'}
                                    </button>
                                    <button type="button" onClick={() => startEditing(item)}>
                                      Edit
                                    </button>
                                    <button type="button" onClick={() => handleDelete(item)}>
                                      Delete
                                    </button>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    </section>
                  </section>

                  {pendingDelete && (
                    <div
                      className="modal-overlay"
                      role="presentation"
                      onClick={() => setPendingDelete(null)}
                    >
                      <aside
                        className="modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Confirm delete assignment"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="modal-header">
                          <h3>Delete assignment?</h3>
                          <button
                            type="button"
                            className="button-subtle"
                            onClick={() => setPendingDelete(null)}
                            aria-label="Close delete confirmation"
                          >
                            Close
                          </button>
                        </div>
                        <p>
                          Remove <strong>{pendingDelete.title}</strong> from{' '}
                          <strong>{pendingDelete.course}</strong>? This action cannot be undone.
                        </p>
                        <div className="form-actions">
                          <button type="button" className="button-primary" onClick={confirmDelete}>
                            Delete assignment
                          </button>
                          <button
                            type="button"
                            className="button-subtle"
                            onClick={() => setPendingDelete(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </aside>
                    </div>
                  )}

                  {isAssignmentFormOpen && (
                    <div
                      className="modal-overlay"
                      role="presentation"
                      onClick={() => {
                        setIsAssignmentFormOpen(false)
                        resetForm()
                      }}
                    >
                      <aside
                        className="modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-label={editingId ? 'Edit assignment' : 'Add assignment'}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="modal-header">
                          <h3>{editingId ? 'Edit assignment' : 'Add assignment'}</h3>
                          <button
                            type="button"
                            className="button-subtle"
                            onClick={() => {
                              setIsAssignmentFormOpen(false)
                              resetForm()
                            }}
                            aria-label="Close assignment form"
                          >
                            Close
                          </button>
                        </div>

                        <form className="assignment-form" onSubmit={handleSubmit}>
                          <label htmlFor="title">Title</label>
                          <input
                            id="title"
                            required
                            value={formValues.title}
                            onChange={(event) =>
                              setFormValues((current) => ({ ...current, title: event.target.value }))
                            }
                          />

                          <label htmlFor="course">Class / Course</label>
                          <input
                            id="course"
                            required
                            value={formValues.course}
                            onChange={(event) =>
                              setFormValues((current) => ({ ...current, course: event.target.value }))
                            }
                          />

                          <label htmlFor="due-date">Due date</label>
                          <input
                            id="due-date"
                            type="date"
                            required
                            value={formValues.dueDate}
                            onChange={(event) =>
                              setFormValues((current) => ({ ...current, dueDate: event.target.value }))
                            }
                          />

                          <label htmlFor="workload">Workload</label>
                          <select
                            id="workload"
                            value={formValues.workload}
                            onChange={(event) =>
                              setFormValues((current) => ({
                                ...current,
                                workload: event.target.value as Workload,
                              }))
                            }
                          >
                            {WORKLOADS.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>

                          <div className="form-actions">
                            <button type="submit" className="button-primary">
                              {editingId ? 'Save changes' : 'Add assignment'}
                            </button>
                            <button
                              type="button"
                              className="button-subtle"
                              onClick={() => {
                                setIsAssignmentFormOpen(false)
                                resetForm()
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </aside>
                    </div>
                  )}

                {isPetNameOpen && (
                    <div
                      className="modal-overlay"
                      role="presentation"
                      onClick={() => {
                        setIsPetNameOpen(false)
                        setPetNameDraft(petName)
                        setPetTypeDraft(petType)
                      }}
                    >
                      <aside
                        className="modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Rename pet"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="modal-header">
                          <h3>Customize companion</h3>
                          <button
                            type="button"
                            className="button-subtle"
                            onClick={() => {
                              setIsPetNameOpen(false)
                              setPetNameDraft(petName)
                              setPetTypeDraft(petType)
                            }}
                            aria-label="Close rename pet dialog"
                          >
                            Close
                          </button>
                        </div>

                        <form className="assignment-form" onSubmit={handlePetNameSubmit}>
                          <CompanionPetFields
                            petName={petNameDraft}
                            onPetNameChange={setPetNameDraft}
                            petType={petTypeDraft}
                            onPetTypeChange={setPetTypeDraft}
                          />

                          <div className="form-actions">
                            <button type="submit" className="button-primary">
                              Save name
                            </button>
                            <button
                              type="button"
                              className="button-subtle"
                              onClick={() => {
                                setIsPetNameOpen(false)
                                setPetNameDraft(petName)
                                setPetTypeDraft(petType)
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </aside>
                    </div>
                  )}
              </section>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </main>

      {isAccessibilityOpen && (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={() => setIsAccessibilityOpen(false)}
        >
          <aside
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility settings"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Accessibility</h3>
              <button
                type="button"
                className="button-subtle"
                onClick={() => setIsAccessibilityOpen(false)}
                aria-label="Close accessibility settings"
              >
                Close
              </button>
            </div>
            <div className="settings-row">
              <label htmlFor="text-scale">Text size</label>
              <select
                id="text-scale"
                value={settings.textScale}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    textScale: event.target.value as TextScale,
                  }))
                }
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="x-large">Extra large</option>
              </select>
            </div>
            <div className="settings-row">
              <label htmlFor="dark-mode">Dark mode</label>
              <input
                id="dark-mode"
                type="checkbox"
                checked={settings.darkMode}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    darkMode: event.target.checked,
                  }))
                }
              />
            </div>
            <div className="settings-row">
              <label htmlFor="high-contrast">High contrast</label>
              <input
                id="high-contrast"
                type="checkbox"
                checked={settings.highContrast}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    highContrast: event.target.checked,
                  }))
                }
              />
            </div>
            <div className="settings-row">
              <label htmlFor="reduce-motion">Reduced motion</label>
              <input
                id="reduce-motion"
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    reducedMotion: event.target.checked,
                  }))
                }
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
