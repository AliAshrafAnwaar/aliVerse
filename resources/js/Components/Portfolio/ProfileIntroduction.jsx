import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { User, MapPin, Globe, Github, Linkedin, Twitter, Mail, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfileIntroduction({ portfolioOwner, stats }) {
    const { t } = useTranslation();

    return (
        <div className="relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl"></div>
            <div className="absolute inset-0 bg-grid-white/[0.05] rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {portfolioOwner.avatar ? (
                                <img 
                                    src={portfolioOwner.avatar_url} 
                                    alt={portfolioOwner.name}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl ring-4 ring-white/10"
                                />
                            ) : (
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20 shadow-2xl ring-4 ring-white/10">
                                    <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
                                </div>
                            )}
                            {/* Online indicator */}
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-white text-center lg:text-left">
                        {/* Name and Position */}
                        <div className="mb-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                                {portfolioOwner.name}
                            </h1>
                            {portfolioOwner.position && (
                                <p className="text-xl md:text-2xl text-white/90 font-light mb-3">
                                    {portfolioOwner.position}
                                </p>
                            )}
                            
                            {/* Location */}
                            {portfolioOwner.location && (
                                <div className="flex items-center justify-center lg:justify-start gap-2 text-white/80 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span>{portfolioOwner.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        {portfolioOwner.bio && (
                            <p className="text-lg text-white/90 mb-6 max-w-2xl leading-relaxed">
                                {portfolioOwner.bio}
                            </p>
                        )}

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                            {portfolioOwner.website && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                    asChild
                                >
                                    <a href={portfolioOwner.website} target="_blank" rel="noopener noreferrer">
                                        <Globe className="w-4 h-4 mr-2" />
                                        Website
                                    </a>
                                </Button>
                            )}
                            {portfolioOwner.github_url && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                    asChild
                                >
                                    <a href={portfolioOwner.github_url} target="_blank" rel="noopener noreferrer">
                                        <Github className="w-4 h-4 mr-2" />
                                        GitHub
                                    </a>
                                </Button>
                            )}
                            {portfolioOwner.linkedin_url && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                    asChild
                                >
                                    <a href={portfolioOwner.linkedin_url} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="w-4 h-4 mr-2" />
                                        LinkedIn
                                    </a>
                                </Button>
                            )}
                            {portfolioOwner.twitter_url && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                    asChild
                                >
                                    <a href={portfolioOwner.twitter_url} target="_blank" rel="noopener noreferrer">
                                        <Twitter className="w-4 h-4 mr-2" />
                                        Twitter
                                    </a>
                                </Button>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                <div className="text-3xl font-bold">{stats.total_projects}</div>
                                <div className="text-sm text-white/70 mt-1">{t('portfolio.projects', 'Projects')}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                <div className="text-3xl font-bold">{stats.total_skills}</div>
                                <div className="text-sm text-white/70 mt-1">{t('portfolio.skills', 'Skills')}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                <div className="text-3xl font-bold">{stats.total_experiences}</div>
                                <div className="text-sm text-white/70 mt-1">{t('portfolio.experience', 'Experience')}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                <div className="text-3xl font-bold">{stats.total_testimonials}</div>
                                <div className="text-sm text-white/70 mt-1">{t('portfolio.testimonials', 'Testimonials')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
