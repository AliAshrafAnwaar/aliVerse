import ApplicationFullLogo from '@/Components/ApplicationFullLogo';
import { Toaster } from '@/Components/ui/toaster';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  FolderOpen, 
  Phone, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  User,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function AdminLayout({ header, children }) {
  const user = usePage().props.auth.user;
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  
  // Initialize sidebar state from localStorage
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Save sidebar state to localStorage when it changes
  const handleSidebarCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/admin',
      icon: Home,
      current: route().current('admin.dashboard'),
    },
    {
      name: t('navigation.contact'),
      href: '/admin/contact/edit',
      icon: Phone,
      current: route().current('admin.contact.edit'),
    },
    {
      name: t('navigation.projects'),
      href: '/admin/projects',
      icon: FolderOpen,
      current: route().current('admin.projects.*'),
    },
    {
      name: t('navigation.blog'),
      href: '/admin/blog',
      icon: FileText,
      current: route().current('admin.posts.*'),
    },
    {
      name: t('navigation.users'),
      href: '/admin/users',
      icon: Users,
      current: route().current('admin.users.*'),
    },
    {
      name: t('navigation.settings'),
      href: '/admin/settings',
      icon: Settings,
      current: route().current('admin.settings.*'),
    },
  ];

  const userNavigation = [
    { name: t('navigation.profile'), href: '/profile' },
    { name: t('auth.logout'), href: '/logout', method: 'post' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-900/80 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
             onClick={() => setSidebarOpen(false)} />
        
        <div className={`fixed inset-y-0 left-0 z-50 bg-card shadow-xl transform transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
             style={{ width: '256px' }}>
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <Link href="/admin">
              <div className="flex items-center">
                <ApplicationFullLogo className="h-8 w-8" />
                <span className="font-bold text-lg ml-2">{t('common.admin_panel')}</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7 overflow-y-auto px-4 py-4">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                          item.current
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* User Section - Mobile */}
              <li className="mt-auto border-t border-border pt-4">
                <div className="px-2">
                  {/* User Profile with Popup */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                        <div className="flex items-center gap-3 w-full">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium text-foreground truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start" side="top">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.name}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          {t('navigation.profile')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleTheme}>
                        {theme === 'light' ? (
                          <Moon className="mr-2 h-4 w-4" />
                        ) : (
                          <Sun className="mr-2 h-4 w-4" />
                        )}
                        {t('common.toggle_theme')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleLanguage}>
                        <Globe className="mr-2 h-4 w-4" />
                        {t('common.toggle_language')} ({i18n.language.toUpperCase()})
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/logout" method="post" className="text-red-600 focus:text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          {t('auth.logout')}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Floating Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="bg-background/80 backdrop-blur-sm border-border"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            {!sidebarCollapsed ? (
              <Link href="/admin" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">A</span>
                </div>
                <span className="font-bold text-lg">{t('common.admin_panel', 'Admin')}</span>
              </Link>
            ) : (
              <Link href="/admin" className="flex items-center justify-center w-full">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">A</span>
                </div>
              </Link>
            )}
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSidebarCollapse}
                className="h-8 w-8 p-0"
                title={t('common.collapse_sidebar', 'Collapse')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Expand button when collapsed */}
          {sidebarCollapsed && (
            <div className="flex justify-center py-2 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSidebarCollapse}
                className="h-8 w-8 p-0"
                title={t('common.expand_sidebar', 'Expand')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7 px-2">
              <li>
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                          item.current
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                        title={sidebarCollapsed ? item.name : ''}
                      >
                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {!sidebarCollapsed && item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* User Section - Desktop */}
              <li className={`mt-auto border-t border-border ${sidebarCollapsed ? 'pt-2' : 'pt-4'}`}>
                <div className="px-2">
                  {/* User Profile with Popup */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start p-2 h-auto ${sidebarCollapsed ? 'justify-center' : ''}`}
                      >
                        <div className={`flex items-center gap-3 w-full ${sidebarCollapsed ? 'justify-center' : ''}`}>
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                          {!sidebarCollapsed && (
                            <>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {user.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user.email}
                                </p>
                              </div>
                              <ChevronDown className="h-4 w-4 shrink-0" />
                            </>
                          )}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start" side="top">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.name}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          {t('navigation.profile')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleTheme}>
                        {theme === 'light' ? (
                          <Moon className="mr-2 h-4 w-4" />
                        ) : (
                          <Sun className="mr-2 h-4 w-4" />
                        )}
                        {t('common.toggle_theme')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleLanguage}>
                        <Globe className="mr-2 h-4 w-4" />
                        {t('common.toggle_language')} ({i18n.language.toUpperCase()})
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/logout" method="post" className="text-red-600 focus:text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          {t('auth.logout')}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
