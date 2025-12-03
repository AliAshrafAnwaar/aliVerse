import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ThemeToggle from '@/Components/ThemeToggle';
import LanguageToggle from '@/Components/LanguageToggle';
import { Toaster } from '@/Components/ui/toaster';
import { Container, Flex, Stack, Box } from '@/Components/Layout';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '@/Components/Footer';

export default function PublicLayout({ user, children, portfolioOwner }) {
    const { props } = usePage();
    const { t } = useTranslation();

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    
    // Use provided portfolioOwner or fallback to fetching user ID 1 data from props
    const footerOwner = portfolioOwner || props.portfolioOwner || user;

    return (
        <Box  className="min-h-screen bg-background flex flex-col">
            <Box as="nav" className="border-b border-border bg-card p-2">
                <Container>
                    <Flex justify="between" align="center" className="h-16">
                        {/* Logo and Navigation - Left */}
                        <Flex align="center">
                            <Flex align="center" className="shrink-0">
                                <Link href="/">
                                    <Flex align="center" className="gap-2">
                                        <ApplicationLogo className="w-12 sm:w-12 flex-shrink-0" />
                                        <Box as="span" className="font-bold text-sm sm:text-lg truncate max-w-[120px] sm:max-w-none">
                                            {t('common.long_welcome')}
                                        </Box>
                                    </Flex>
                                </Link>
                            </Flex>

                            <Box className="hidden lg:ms-6 lg:flex gap-4 xl:gap-8">
                                <NavLink href={route('home')} active={route().current('home')}>
                                    {t('navigation.home')}
                                </NavLink>
                                <NavLink href={route('posts.index')} active={route().current('posts.index')}>
                                    {t('navigation.blog')}
                                </NavLink>
                                <NavLink href={route('contact.index')} active={route().current('contact.index')}>
                                    {t('navigation.contact')}
                                </NavLink>
                            </Box>
                        </Flex>

                        {/* Right Buttons - User Actions */}
                        <Flex align="center" className="gap-1 sm:gap-2">
                            {user ? (
                                <Box className="hidden sm:block">
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
                                            {user.is_admin && (
                                                <Dropdown.Link href={route('admin.dashboard')}>
                                                    {t('navigation.admin')}
                                                </Dropdown.Link>
                                            )}
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                {t('auth.logout')}
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </Box>
                            ) : (
                                <Box className="hidden sm:block">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-2 sm:px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {t('common.login')}
                                    </Link>
                                </Box>
                            )}

                            <Flex align="center" className="hidden sm:flex gap-1 sm:gap-2">
                                <ThemeToggle />
                                <LanguageToggle />
                            </Flex>

                            <Flex align="center" className="-me-2 lg:hidden">
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
                            </Flex>
                        </Flex>
                    </Flex>
                </Container>

                <Box
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " lg:hidden"
                    }
                >
                    <Stack spacing="1" className="pt-2 pb-3">
                        <ResponsiveNavLink href={route('home')}>
                            {t('navigation.home')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('posts.index')}>
                            {t('navigation.blog')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('contact.index')}>
                            {t('navigation.contact')}
                        </ResponsiveNavLink>
                    </Stack>

                    {user ? (
                        <Box className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <Box className="px-4">
                                <Box className="font-medium text-base text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </Box>
                                <Box className="font-medium text-sm text-gray-500 dark:text-gray-400 break-all">
                                    {user.email}
                                </Box>
                            </Box>

                            <Stack spacing="1" className="mt-3">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    {t('navigation.profile')}
                                </ResponsiveNavLink>
                                {user.is_admin && (
                                    <ResponsiveNavLink href={route('admin.dashboard')}>
                                        {t('navigation.admin')}
                                    </ResponsiveNavLink>
                                )}
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    {t('auth.logout')}
                                </ResponsiveNavLink>
                            </Stack>

                            {/* Mobile Theme and Language Toggles */}
                            <Flex className="mt-3 px-4 gap-2 sm:hidden">
                                <ThemeToggle />
                                <LanguageToggle />
                            </Flex>
                        </Box>
                    ) : (
                        <Box className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <Stack spacing="1" className="mt-3">
                                <ResponsiveNavLink href={route('login')}>
                                    {t('common.login')}
                                </ResponsiveNavLink>
                            </Stack>

                            {/* Mobile Theme and Language Toggles for guests */}
                            <Flex className="mt-3 px-4 gap-2 sm:hidden">
                                <ThemeToggle />
                                <LanguageToggle />
                            </Flex>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Main Content */}
            <Box as="main" className="flex-1">
                {children}
            </Box>

            {/* Footer - Only render if we have portfolio owner data */}
            {footerOwner && <Footer portfolioOwner={footerOwner} />}

            <Toaster />
        </Box>
    );
}
