# shadcn/ui Component Examples for aliVerse

## 🎨 How shadcn/ui Components Work

This guide shows you exactly how to use shadcn/ui components in your Laravel + React project.

---

## Components Installed

✅ **Button** - Interactive buttons with variants
✅ **Card** - Content containers with header, content, footer
✅ **Badge** - Status labels and tags
✅ **Alert** - Notification and information boxes

---

## 1. Button Component

### Import
```jsx
import { Button } from '@/Components/ui/button';
```

### Usage Examples
```jsx
// Default button
<Button>Click me</Button>

// Button variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>

// With icons from Lucide React
import { Plus, Trash2 } from 'lucide-react';

<Button>
    <Plus className="mr-2 h-4 w-4" />
    Add New
</Button>

<Button variant="destructive">
    <Trash2 className="mr-2 h-4 w-4" />
    Delete
</Button>
```

### Real Example from Dashboard
```jsx
<Button className="w-full" variant="default">
    {t('common.create')} New Project
</Button>
<Button className="w-full" variant="outline">
    View {t('dashboard.recent_activity')}
</Button>
```

---

## 2. Card Component

### Import
```jsx
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from '@/Components/ui/card';
```

### Usage Examples
```jsx
// Basic card
<Card>
    <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
    </CardHeader>
    <CardContent>
        <p>Card content</p>
    </CardContent>
    <CardFooter>
        <Button>Action</Button>
    </CardFooter>
</Card>

// Card with custom styling
<Card className="border-primary">
    <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Title with Icon
        </CardTitle>
    </CardHeader>
    <CardContent>
        Content here
    </CardContent>
</Card>
```

### Real Example from Dashboard
```jsx
<Card>
    <CardHeader>
        <CardTitle>{t('dashboard.quick_actions')}</CardTitle>
        <CardDescription>
            Common actions you can perform
        </CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
        <Button className="w-full" variant="default">
            {t('common.create')} New Project
        </Button>
        <Button className="w-full" variant="outline">
            View {t('dashboard.recent_activity')}
        </Button>
    </CardContent>
    <CardFooter>
        <Button variant="link" className="px-0">
            View All →
        </Button>
    </CardFooter>
</Card>
```

---

## 3. Badge Component

### Import
```jsx
import { Badge } from '@/Components/ui/badge';
```

### Usage Examples
```jsx
// Badge variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Custom color variants (added to your project)
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>

// With custom styling
<Badge className="text-lg px-4 py-2">Large Badge</Badge>
```

### Real Example from Dashboard
```jsx
<Badge variant={stat.variant} className="mt-2">
    {stat.change} from last month
</Badge>
```

---

## 4. Alert Component

### Import
```jsx
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
```

### Usage Examples
```jsx
// Basic alert
<Alert>
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
        You can add components to your app using the cli.
    </AlertDescription>
</Alert>

// Alert with icon
import { Info } from 'lucide-react';

<Alert>
    <Info className="h-4 w-4" />
    <AlertTitle>Information</AlertTitle>
    <AlertDescription>
        This is an informational message.
    </AlertDescription>
</Alert>

// Alert variants
<Alert variant="default">Default alert</Alert>
<Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>Something went wrong!</AlertDescription>
</Alert>
```

### Real Example from Dashboard
```jsx
<Alert>
    <Info className="h-4 w-4" />
    <AlertTitle>{t('dashboard.welcome_message', { name: 'User' })}</AlertTitle>
    <AlertDescription>
        This dashboard showcases shadcn/ui components with dark/light mode and multi-language support.
    </AlertDescription>
</Alert>
```

---

## 5. Using Lucide React Icons

### Import
```jsx
import { 
    Info, 
    TrendingUp, 
    Users, 
    Activity, 
    Plus, 
    Trash2,
    Edit,
    Save,
    X,
    Check,
    AlertCircle
} from 'lucide-react';
```

### Usage with Components
```jsx
// In buttons
<Button>
    <Plus className="mr-2 h-4 w-4" />
    Add New
</Button>

// In card headers
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle>Stats</CardTitle>
    <TrendingUp className="h-4 w-4 text-muted-foreground" />
</CardHeader>

// In alerts
<Alert>
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Warning</AlertTitle>
</Alert>
```

### Icon List
View all icons at: https://lucide.dev/icons/

---

## 6. Theme-Aware Styling

All components automatically adapt to dark/light mode using CSS variables.

### Using Theme Colors
```jsx
// Background colors
className="bg-background"    // Main background
className="bg-card"          // Card background
className="bg-muted"         // Muted background
className="bg-primary"       // Primary color
className="bg-secondary"     // Secondary color
className="bg-accent"        // Accent color
className="bg-success"       // Success (green)
className="bg-warning"       // Warning (amber)
className="bg-info"          // Info (blue)
className="bg-destructive"   // Destructive (red)

// Text colors
className="text-foreground"           // Main text
className="text-muted-foreground"     // Muted text
className="text-primary-foreground"   // Primary text (on primary bg)
className="text-card-foreground"      // Card text

// Borders
className="border-border"    // Border color
className="border-primary"   // Primary border
```

### Example
```jsx
<Card className="bg-card border-border">
    <CardHeader className="bg-muted">
        <CardTitle className="text-foreground">
            Card with theme colors
        </CardTitle>
    </CardHeader>
    <CardContent className="text-muted-foreground">
        Content that adapts to theme
    </CardContent>
</Card>
```

---

## 7. Adding More Components

To add more shadcn/ui components to your project:

```bash
# Single component
npx shadcn@latest add dialog

# Multiple components
npx shadcn@latest add table select checkbox input textarea

# See all available components
npx shadcn@latest add
```

### Popular Components to Add
- `dialog` - Modal dialogs
- `table` - Data tables
- `input` - Form inputs
- `textarea` - Multi-line inputs
- `select` - Select dropdowns
- `checkbox` - Checkboxes
- `tabs` - Tab navigation
- `dropdown-menu` - Dropdown menus
- `toast` - Toast notifications
- `skeleton` - Loading skeletons

---

## 8. Complete Page Example

Here's a complete example combining multiple components:

```jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Info, Plus } from 'lucide-react';

export default function MyPage() {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    {t('mypage.title')}
                </h2>
            }
        >
            <Head title={t('mypage.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Alert */}
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Welcome!</AlertTitle>
                        <AlertDescription>
                            Get started by creating your first project.
                        </AlertDescription>
                    </Alert>

                    {/* Content Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Projects</CardTitle>
                                <CardDescription>
                                    Manage your portfolio projects
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="success">5 Active</Badge>
                                <Badge variant="warning" className="ml-2">2 Pending</Badge>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Project
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                                <CardDescription>
                                    Your performance overview
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <Badge variant="info">+12% this month</Badge>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

---

## 9. Customization Tips

### Custom Variants
You can extend component variants in the component files:

```jsx
// In badge.jsx, add a new variant
const badgeVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "...",
        // Add your custom variant
        custom: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
      },
    },
  }
)
```

### Custom Styling
Use Tailwind classes with `className`:

```jsx
<Button className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500">
    Gradient Button
</Button>

<Card className="hover:shadow-lg transition-shadow duration-300">
    Animated Card
</Card>
```

---

## Summary

- ✅ **Import** components from `@/Components/ui/[component]`
- ✅ **Use** Lucide React for icons
- ✅ **Style** with theme-aware classes (bg-background, text-foreground, etc.)
- ✅ **Combine** components to build complex UIs
- ✅ **Customize** with className and custom variants
- ✅ **Add** more components with `npx shadcn@latest add [component]`

Check the Dashboard page (`resources/js/Pages/Dashboard.jsx`) for working examples!
