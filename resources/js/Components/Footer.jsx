import React from 'react';
import { Link } from '@inertiajs/react';
import { Github, Linkedin, Twitter, Mail, Heart, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer({ portfolioOwner }) {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { 
            name: 'GitHub', 
            url: portfolioOwner?.github_url, 
            icon: Github,
            color: 'hover:text-gray-900 dark:hover:text-white' 
        },
        { 
            name: 'LinkedIn', 
            url: portfolioOwner?.linkedin_url, 
            icon: Linkedin,
            color: 'hover:text-blue-600 dark:hover:text-blue-400' 
        },
        { 
            name: 'Twitter', 
            url: portfolioOwner?.twitter_url, 
            icon: Twitter,
            color: 'hover:text-sky-500 dark:hover:text-sky-400' 
        },
        { 
            name: 'Email', 
            url: portfolioOwner?.email ? `mailto:${portfolioOwner.email}` : null, 
            icon: Mail,
            color: 'hover:text-red-600 dark:hover:text-red-400' 
        },
    ];

    const quickLinks = [
        { name: t('footer.home'), href: '/' },
        { name: t('footer.portfolio'), href: '/portfolio' },
        { name: t('footer.projects'), href: '/projects' },
        { name: t('footer.blog'), href: '/blog' },
        { name: t('footer.contact'), href: '/contact' },
    ];

    return (
        <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                    

                    {/* Brand Section - Moved to left */}
                    <div className="md:col-span-2 ">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {portfolioOwner?.name?.charAt(0) || 'P'}
                                </span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                {portfolioOwner?.name || 'Portfolio'}
                            </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                            {portfolioOwner?.bio || t('footer.default_bio')}
                        </p>
                        {portfolioOwner?.location && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                                📍 {portfolioOwner.location}
                            </p>
                        )}
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((link) => {
                                if (!link.url) return null;
                                const Icon = link.icon;
                                return (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-gray-600 dark:text-gray-400 ${link.color} transition-colors`}
                                        aria-label={link.name}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        {/* Quick Links Section - Moved to Left */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            {t('footer.quick_links')}
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Section - Moved to Left, Grouped with Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            {t('footer.resources')}
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/privacy"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {t('footer.privacy')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/terms"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {t('footer.terms')}
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {t('footer.hire_me')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                            © {currentYear} {portfolioOwner?.name || 'Portfolio'}. {t('footer.rights')}
                        </p>

                        {/* Made with love */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            {t('footer.made_with')}
                            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                            {t('footer.using')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
