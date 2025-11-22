import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ThemeToggle from '@/Components/ThemeToggle';
import LanguageToggle from '@/Components/LanguageToggle';
import { Toaster } from '@/Components/ui/toaster';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '@/Components/Footer';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <div className="flex items-center gap-2">
                                        <ApplicationLogo className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0" />
                                        <span className="font-bold text-sm sm:text-lg truncate max-w-[120px] sm:max-w-none">{t('common.long_welcome')}</span>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden lg:ms-6 lg:flex lg:space-x-4 xl:space-x-8">
                                <NavLink href={route('home')} active={route().current('home')}>
                                    {t('navigation.home')}
                                </NavLink>
                                <NavLink href={route('posts.index')} active={route().current('posts.index')}>
                                    {t('navigation.blog')}
                                </NavLink>
                                <NavLink href={route('contact.index')} active={route().current('contact.index')}>
                                    {t('navigation.contact')}
                                </NavLink>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {user && (
                                <div className="hidden sm:block">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-2 sm:px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    <span className="hidden md:inline">{user.name}</span>
                                                    <span className="md:hidden">{user.name.split(' ')[0]}</span>

                                                <svg
                                                    className="ms-1 sm:ms-2 -me-1 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            {t('navigation.profile')}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            {t('auth.logout')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )}

                            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                                <ThemeToggle />
                                <LanguageToggle />
                            </div>

                            <div className="-me-2 flex items-center lg:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-500 dark:focus:text-gray-100 transition duration-150 ease-in-out"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        {showingNavigationDropdown ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " lg:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('home')}>
                            {t('navigation.home')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('posts.index')}>
                            {t('navigation.blog')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('contact.index')}>
                            {t('navigation.contact')}
                        </ResponsiveNavLink>
                    </div>

                    {user && (
                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500 dark:text-gray-400 break-all">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    {t('navigation.profile')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    {t('auth.logout')}
                                </ResponsiveNavLink>
                            </div>

                            {/* Mobile Theme and Language Toggles */}
                            <div className="mt-3 px-4 flex items-center gap-2 sm:hidden">
                                <ThemeToggle />
                                <LanguageToggle />
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {header && (
                <header className="bg-card shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* Footer - Only render if user exists */}
            {user && <Footer portfolioOwner={user} />}

            <Toaster />
        </div>
    );
}
