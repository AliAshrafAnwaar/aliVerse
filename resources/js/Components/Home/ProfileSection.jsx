import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
    Github, 
    Linkedin, 
    Twitter, 
    Mail, 
    User, 
    ArrowRight, 
    MapPin 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function ProfileSection({ portfolioOwner, isVisible }) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-12 items-center">
            {/* Left: Text Content */}
            <div className={`col-span-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    {portfolioOwner.name}
                </h1>
                
                {portfolioOwner.position && (
                    <h2 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
                        {portfolioOwner.position}
                    </h2>
                )}
                
                {portfolioOwner.bio && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {portfolioOwner.bio}
                    </p>
                )}

                {portfolioOwner.location && (
                    <div className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-5 h-5" />
                        <span>{portfolioOwner.location}</span>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Button size="lg" className="group" asChild>
                        <Link href="/contact">
                            <Mail className="w-5 h-5 mr-2" />
                            {t('home.get_in_touch')}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/portfolio/show">
                            <User className="w-5 h-5 mr-2" />
                            {t('home.view_portfolio')}
                        </Link>
                    </Button>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                    {portfolioOwner.github_url && (
                        <a 
                            href={portfolioOwner.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-all hover:scale-110"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    {portfolioOwner.linkedin_url && (
                        <a 
                            href={portfolioOwner.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all hover:scale-110"
                        >
                            <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </a>
                    )}
                    {portfolioOwner.twitter_url && (
                        <a 
                            href={portfolioOwner.twitter_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-all hover:scale-110"
                        >
                            <Twitter className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        </a>
                    )}
                </div>
            </div>

            {/* Right: Profile Image */}
            <div className={`col-span-3 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                <div className="relative w-full max-w-md mx-auto">
                    {/* Profile Image - PNG with transparent background */}
                    {portfolioOwner.avatar ? (
                        <img 
                            src={portfolioOwner.avatar_url} 
                            alt={portfolioOwner.name}
                            className="w-auto h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                            <User className="w-32 h-32 text-white" />
                        </div>
                    )}
                    
                    {/* Floating status badge */}
                    <div className="absolute mt-20 -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold">{t('home.available')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
