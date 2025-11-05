import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, ExternalLink, Github, Calendar, Eye } from 'lucide-react';

export default function Portfolio() {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout user={user} header={t('navigation.portfolio', 'Portfolio')}>
            <Head title={t('navigation.portfolio', 'Portfolio')} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* User Info Card */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                {user.name}
                            </CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Badge variant="secondary">
                                    {t('common.user', 'User')}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    {t('portfolio.member_since', 'Member since')}: {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <Link href="/projects">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ExternalLink className="w-5 h-5" />
                                        {t('portfolio.view_projects', 'View Projects')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('portfolio.browse_projects', 'Browse all available projects')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <Link href="/blog">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        {t('portfolio.read_blog', 'Read Blog')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('portfolio.latest_posts', 'Read the latest blog posts')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <Link href="/contact">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Github className="w-5 h-5" />
                                        {t('portfolio.contact_info', 'Contact Info')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('portfolio.get_in_touch', 'Get in touch with us')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                {t('portfolio.recent_activity', 'Recent Activity')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <p>{t('portfolio.no_recent_activity', 'No recent activity to show.')}</p>
                                <p className="text-sm mt-2">
                                    {t('portfolio.start_exploring', 'Start exploring the projects and blog posts!')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
