# React Hooks - The Complete Guide

Yo! This is your go-to guide for React hooks. Whether you're building components in the aliVerse portfolio or any other React project, this has everything you need.

---

## The Basics - Built-in Hooks

### 1. useState - Your State Manager

**What it does:** Stores values that can change and trigger re-renders.

```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <button onClick={() => setCount(count + 1)}>
            Clicks: {count}
        </button>
    );
}
```

**When to use:**
- Form inputs
- Toggle states (modals, dropdowns)
- Any value that changes based on user interaction

**Pro tips:**
```jsx
// For complex state updates, use callback form
setCount(prev => prev + 1);

// For object state
const [user, setUser] = useState({ name: '', email: '' });
setUser(prev => ({ ...prev, name: 'Ali' }));

// For arrays
const [items, setItems] = useState([]);
setItems(prev => [...prev, newItem]);
```

**Real example from your codebase:**
```jsx
// From ContactForm.jsx
const [data, setData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
});
```

---

### 2. useEffect - Side Effects Handler

**What it does:** Runs code after render. Perfect for API calls, subscriptions, DOM manipulation.

```jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // Runs when userId changes
        fetchUser(userId).then(setUser);
        
        // Cleanup function (optional)
        return () => {
            console.log('Component unmounting or userId changed');
        };
    }, [userId]); // Dependency array
    
    return <div>{user?.name}</div>;
}
```

**Dependency array patterns:**
```jsx
// Runs on EVERY render (usually avoid this)
useEffect(() => { });

// Runs ONCE on mount
useEffect(() => { }, []);

// Runs when `id` or `name` changes
useEffect(() => { }, [id, name]);
```

**When to use:**
- Fetching data on component mount
- Setting up subscriptions/event listeners
- Syncing with external systems
- DOM measurements

---

### 3. useRef - Persistent Values Without Re-renders

**What it does:** Holds a mutable value that doesn't trigger re-renders when changed.

```jsx
import { useRef, useEffect } from 'react';

function VideoPlayer() {
    const videoRef = useRef(null);
    
    const handlePlay = () => {
        videoRef.current.play();
    };
    
    return (
        <video ref={videoRef} src="video.mp4" />
    );
}
```

**When to use:**
- Accessing DOM elements directly
- Storing previous values
- Storing timeout/interval IDs
- Any value that shouldn't trigger re-render

**Examples:**
```jsx
// Store previous value
const prevCount = useRef(count);
useEffect(() => {
    prevCount.current = count;
});

// Focus an input
const inputRef = useRef(null);
useEffect(() => {
    inputRef.current?.focus();
}, []);
```

---

### 4. useContext - Prop Drilling Solution

**What it does:** Access values from a context without passing props through every level.

```jsx
// Creating context (usually in separate file)
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');
    
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Using context
function ThemedButton() {
    const { theme, setTheme } = useContext(ThemeContext);
    
    return (
        <button 
            style={{ background: theme === 'dark' ? '#333' : '#fff' }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            Toggle Theme
        </button>
    );
}
```

**Real example from your codebase:**
```jsx
// From contexts/ThemeContext.jsx
const { theme, setTheme } = useContext(ThemeContext);
```

---

### 5. useMemo - Expensive Calculation Caching

**What it does:** Caches the result of an expensive calculation.

```jsx
import { useMemo } from 'react';

function ExpensiveList({ items, filter }) {
    const filteredItems = useMemo(() => {
        console.log('Filtering...');
        return items.filter(item => item.includes(filter));
    }, [items, filter]); // Only recalculates when items or filter change
    
    return <ul>{filteredItems.map(item => <li key={item}>{item}</li>)}</ul>;
}
```

**When to use:**
- Complex calculations/filtering
- Large array transformations
- Creating objects/arrays passed to child components

**Don't overuse:** Only use when you have actual performance issues.

---

### 6. useCallback - Function Memoization

**What it does:** Returns a memoized version of a callback that only changes if dependencies change.

```jsx
import { useCallback, memo } from 'react';

function ParentComponent() {
    const [count, setCount] = useState(0);
    
    // Without useCallback, this creates a new function every render
    const handleClick = useCallback(() => {
        console.log('Button clicked');
    }, []); // Empty deps = same function reference always
    
    return <ChildComponent onClick={handleClick} />;
}

// Child component wrapped with memo benefits from useCallback
const ChildComponent = memo(({ onClick }) => {
    console.log('Child rendered');
    return <button onClick={onClick}>Click me</button>;
});
```

**When to use:**
- Passing callbacks to optimized child components (wrapped with `memo`)
- Callbacks used as dependencies in other hooks
- Event handlers in frequently re-rendering components

---

### 7. useReducer - Complex State Logic

**What it does:** Like useState but for complex state logic with multiple sub-values.

```jsx
import { useReducer } from 'react';

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { ...state, count: state.count + state.step };
        case 'decrement':
            return { ...state, count: state.count - state.step };
        case 'setStep':
            return { ...state, step: action.payload };
        case 'reset':
            return initialState;
        default:
            throw new Error('Unknown action');
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
            <input 
                type="number" 
                value={state.step}
                onChange={e => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
            />
        </div>
    );
}
```

**When to use:**
- Multiple related state values
- Complex state transitions
- When next state depends on previous state
- When you want to centralize state logic

---

## Inertia.js Specific Hooks

Since you're using Inertia with React, here are the hooks you should know:

### usePage - Access Page Props

```jsx
import { usePage } from '@inertiajs/react';

function Header() {
    const { auth, flash } = usePage().props;
    
    return (
        <nav>
            {auth.user ? (
                <span>Welcome, {auth.user.name}</span>
            ) : (
                <a href="/login">Login</a>
            )}
            {flash.success && <div className="alert">{flash.success}</div>}
        </nav>
    );
}
```

### useForm - Form Handling Made Easy

```jsx
import { useForm } from '@inertiajs/react';

function ContactForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: ''
    });
    
    const submit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => reset()
        });
    };
    
    return (
        <form onSubmit={submit}>
            <input 
                value={data.name}
                onChange={e => setData('name', e.target.value)}
            />
            {errors.name && <span>{errors.name}</span>}
            
            <button disabled={processing}>
                {processing ? 'Sending...' : 'Send'}
            </button>
        </form>
    );
}
```

### useRemember - Persist Form State

```jsx
import { useRemember } from '@inertiajs/react';

function Filters() {
    const [filters, setFilters] = useRemember({
        search: '',
        category: ''
    }, 'filters'); // Key for localStorage
    
    // Filters persist even after navigation
}
```

---

## Custom Hooks in Your Project

### use-toast (Already exists in your project)

```jsx
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
    const { toast } = useToast();
    
    const handleSave = () => {
        // Do something
        toast({
            title: 'Success!',
            description: 'Your changes have been saved.',
            variant: 'default' // or 'destructive'
        });
    };
}
```

---

## Custom Hooks You Should Create

### useLocalStorage

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function 
                ? value(storedValue) 
                : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    
    return [storedValue, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

### useDebounce

```jsx
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => clearTimeout(timer);
    }, [value, delay]);
    
    return debouncedValue;
}

// Usage - perfect for search inputs
function SearchInput() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    
    useEffect(() => {
        if (debouncedSearch) {
            // API call here - only fires after 300ms of no typing
            fetchResults(debouncedSearch);
        }
    }, [debouncedSearch]);
}
```

### useMediaQuery

```jsx
// hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);
    
    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);
        
        const listener = (e) => setMatches(e.matches);
        media.addEventListener('change', listener);
        
        return () => media.removeEventListener('change', listener);
    }, [query]);
    
    return matches;
}

// Usage
function ResponsiveComponent() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
    
    return isMobile ? <MobileView /> : <DesktopView />;
}
```

### useFetch (for non-Inertia API calls)

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network error');
                const json = await response.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [url]);
    
    return { data, loading, error };
}

// Usage
function ProjectsList() {
    const { data, loading, error } = useFetch('/api/v1/projects');
    
    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <ProjectGrid projects={data} />;
}
```

### useOnClickOutside

```jsx
// hooks/useOnClickOutside.js
import { useEffect, useRef } from 'react';

export function useOnClickOutside(handler) {
    const ref = useRef(null);
    
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [handler]);
    
    return ref;
}

// Usage - great for dropdowns/modals
function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useOnClickOutside(() => setIsOpen(false));
    
    return (
        <div ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
            {isOpen && <DropdownMenu />}
        </div>
    );
}
```

### useToggle

```jsx
// hooks/useToggle.js
import { useState, useCallback } from 'react';

export function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);
    
    const toggle = useCallback(() => setValue(v => !v), []);
    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);
    
    return { value, toggle, setTrue, setFalse };
}

// Usage
function Modal() {
    const { value: isOpen, toggle, setFalse: close } = useToggle();
    
    return (
        <>
            <button onClick={toggle}>Open Modal</button>
            {isOpen && (
                <div className="modal">
                    <button onClick={close}>Close</button>
                </div>
            )}
        </>
    );
}
```

---

## Rules of Hooks

1. **Only call hooks at the top level** - Don't call them inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Components or custom hooks
3. **Name custom hooks starting with "use"** - `useMyHook`, not `myHook`

```jsx
// WRONG
if (someCondition) {
    const [state, setState] = useState(false); // DON'T DO THIS
}

// RIGHT
const [state, setState] = useState(false);
if (someCondition) {
    // use state here
}
```

---

## Performance Tips

1. **Use React.memo for expensive components**
   ```jsx
   const ExpensiveComponent = memo(({ data }) => {
       // Only re-renders if `data` changes
   });
   ```

2. **useCallback + memo = Power combo**
   ```jsx
   const Parent = () => {
       const handleClick = useCallback(() => {}, []);
       return <MemoizedChild onClick={handleClick} />;
   };
   ```

3. **useMemo for derived data**
   ```jsx
   const sortedItems = useMemo(() => 
       [...items].sort((a, b) => a.name.localeCompare(b.name)),
       [items]
   );
   ```

4. **Lazy state initialization**
   ```jsx
   // Instead of
   const [state] = useState(expensiveComputation());
   
   // Do this
   const [state] = useState(() => expensiveComputation());
   ```

---

## Quick Reference Cheat Sheet

| Hook | Use Case |
|------|----------|
| `useState` | Simple state that triggers re-render |
| `useEffect` | Side effects (API calls, subscriptions) |
| `useRef` | DOM access, mutable values without re-render |
| `useContext` | Access context values |
| `useMemo` | Cache expensive calculations |
| `useCallback` | Memoize functions |
| `useReducer` | Complex state logic |
| `useForm` (Inertia) | Form handling with Laravel |
| `usePage` (Inertia) | Access page props and flash messages |

---

That's it! You now know more about hooks than 90% of React devs. Go build something awesome! 🚀

*Last updated: November 2024*
