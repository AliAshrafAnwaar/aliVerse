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
                                    <div className="flex items-center">
                                        <ApplicationLogo className="h-12 w-12" />
                                        <span className="font-bold text-lg mx-2 ">{t('common.long_welcome')}</span>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:space-x-8">
                                <NavLink href={route('home')} active={route().current('home')}>
                                    {t('navigation.home')}
                                </NavLink>
                                <NavLink href={route('portfolio')} active={route().current('portfolio')}>
                                    {t('navigation.portfolio')}
                                </NavLink>
                                <NavLink href={route('projects.index')} active={route().current('projects.index')}>
                                    {t('navigation.projects')}
                                </NavLink>
                                <NavLink href={route('posts.index')} active={route().current('posts.index')}>
                                    {t('navigation.blog')}
                                </NavLink>
                                <NavLink href={route('contact.index')} active={route().current('contact.index')}>
                                    {t('navigation.contact')}
                                </NavLink>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-1 h-4 w-4"
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

                            <div className="ms-3 flex items-center gap-2">
                                <ThemeToggle />
                                <LanguageToggle />
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        {"showingNavigationDropdown" ? (
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
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('home')}>
                            {t('navigation.home')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('portfolio')}>
                            {t('navigation.portfolio')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('projects.index')}>
                            {t('navigation.projects')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('posts.index')}>
                            {t('navigation.blog')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('contact.index')}>
                            {t('navigation.contact')}
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
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
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            <Toaster />
        </div>
    );
}
