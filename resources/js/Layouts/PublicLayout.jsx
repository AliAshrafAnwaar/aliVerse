import ApplicationFullLogo from '@/Components/ApplicationFullLogo';
import { Toaster } from '@/Components/ui/toaster';
import { Link } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';
import LanguageToggle from '@/Components/LanguageToggle';
import { useTranslation } from 'react-i18next';

export default function PublicLayout({ children }) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation Header */}
            <nav className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <div className="flex items-center">
                                        <ApplicationFullLogo className="h-10 w-10" />
                                        <span className="font-bold text-lg mx-2">{t('common.long_welcome')}</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <LanguageToggle />
                            
                            {/* Navigation Links */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/"
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    {t('navigation.home')}
                                </Link>
                                <Link
                                    href="/projects"
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    {t('navigation.projects')}
                                </Link>
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    {t('navigation.blog')}
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary border-b-2 border-primary"
                                >
                                    {t('navigation.contact')}
                                </Link>
                            </div>

                            {/* Auth Links */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-foreground hover:text-primary hover:bg-secondary transition-colors"
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary hover:bg-primary/90 transition-colors"
                                >
                                    {t('auth.register')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu */}
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-foreground hover:text-primary hover:bg-secondary hover:border-primary transition-colors"
                        >
                            {t('navigation.home')}
                        </Link>
                        <Link
                            href="/projects"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-foreground hover:text-primary hover:bg-secondary hover:border-primary transition-colors"
                        >
                            {t('navigation.projects')}
                        </Link>
                        <Link
                            href="/blog"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-foreground hover:text-primary hover:bg-secondary hover:border-primary transition-colors"
                        >
                            {t('navigation.blog')}
                        </Link>
                        <Link
                            href="/contact"
                            className="block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium text-primary bg-secondary transition-colors"
                        >
                            {t('navigation.contact')}
                        </Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-border">
                        <div className="flex items-center px-4 space-x-2">
                            <div className="flex-1">
                                <Link
                                    href="/login"
                                    className="block text-base font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {t('auth.register')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card mt-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>&copy; 2024 {t('common.app_name')}. {t('common.all_rights_reserved')}.</p>
                    </div>
                </div>
            </footer>

            <Toaster />
        </div>
    );
}
