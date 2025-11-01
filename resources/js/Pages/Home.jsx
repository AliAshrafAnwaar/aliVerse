import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Home as HomeIcon, User, ExternalLink, Eye, Calendar, Github, ArrowRight } from 'lucide-react';

export default function HomePage() {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout user={user} header={t('navigation.home', 'Home')}>
            <Head title={t('navigation.home', 'Home')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Simple Welcome Section */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold mb-2">
                                    {t('home.welcome_back', 'Welcome back')}, {user.name}! 👋
                                </h1>
                                <p className="text-lg opacity-90">
                                    {t('home.user_welcome_message', 'Explore your portfolio and discover amazing projects and content.')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <Link href="/portfolio">
                                <CardHeader className="text-center">
                                    <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <CardTitle className="text-lg">{t('navigation.portfolio')}</CardTitle>
                                    <CardDescription>
                                        {t('home.view_portfolio_desc', 'Your personal portfolio')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <Link href="/projects">
                                <CardHeader className="text-center">
                                    <ExternalLink className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                    <CardTitle className="text-lg">{t('navigation.projects')}</CardTitle>
                                    <CardDescription>
                                        {t('home.browse_projects_desc', 'Discover amazing projects')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <Link href="/blog">
                                <CardHeader className="text-center">
                                    <Eye className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                    <CardTitle className="text-lg">{t('navigation.blog')}</CardTitle>
                                    <CardDescription>
                                        {t('home.read_blog_desc', 'Read latest articles')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <Link href="/contact">
                                <CardHeader className="text-center">
                                    <Github className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                                    <CardTitle className="text-lg">{t('navigation.contact')}</CardTitle>
                                    <CardDescription>
                                        {t('home.contact_desc', 'Get in touch with us')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                    </div>

                    {/* User Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                {t('home.your_profile', 'Your Profile')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {t('home.member_since', 'Member since')}: {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link href="/profile">
                                    <Button variant="outline" size="sm">
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                        {t('home.edit_profile', 'Edit Profile')}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
