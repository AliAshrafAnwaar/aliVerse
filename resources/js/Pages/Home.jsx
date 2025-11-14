import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Home as HomeIcon, User, ExternalLink, Eye, Calendar, Github, ArrowRight, Lightbulb, Code, BookOpen, MessageSquare } from 'lucide-react';

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

                    {/* Journey Cards Section */}
                    <div className="mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('home.your_journey', 'Your Journey')}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                {t('home.journey_description', 'Discover the story behind your portfolio and what makes you unique')}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* The Problem Solver Card */}
                            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                            <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <CardTitle className="text-xl">
                                            {t('home.the_problem_solver', 'The Problem Solver')}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-base leading-relaxed">
                                        {t('home.problem_solver_description', 'You approach challenges with analytical thinking and creative solutions. Every project is an opportunity to innovate and push boundaries.')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-sm">
                                            {t('home.analytical_mindset', 'Analytical Mindset')}
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            {t('home.learn_more', 'Learn More')}
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* The Builder Card */}
                            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-green-500">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                            <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <CardTitle className="text-xl">
                                            {t('home.the_builder', 'The Builder')}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-base leading-relaxed">
                                        {t('home.builder_description', 'You transform ideas into reality through clean code and thoughtful design. Your portfolio showcases projects that solve real problems and make an impact.')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-sm">
                                            {t('home.creative_execution', 'Creative Execution')}
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                            <Link href="/projects">
                                                {t('home.view_projects', 'View Projects')}
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* The Learner Card */}
                            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-purple-500">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <CardTitle className="text-xl">
                                            {t('home.the_learner', 'The Learner')}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-base leading-relaxed">
                                        {t('home.learner_description', 'You stay curious and continuously expand your skillset. From cutting-edge technologies to timeless principles, learning drives your growth.')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-sm">
                                            {t('home.continuous_growth', 'Continuous Growth')}
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                            <Link href="/portfolio">
                                                {t('home.explore_skills', 'Explore Skills')}
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Let's Connect Card */}
                            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-orange-500">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                                            <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <CardTitle className="text-xl">
                                            {t('home.lets_connect', "Let's Connect")}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-base leading-relaxed">
                                        {t('home.connect_description', 'Your journey is just getting started. Whether it\'s collaboration, opportunities, or sharing ideas, connections make the work meaningful.')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-sm">
                                            {t('home.open_to_opportunities', 'Open to Opportunities')}
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                            <Link href="/contact">
                                                {t('home.get_in_touch', 'Get in Touch')}
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                            <Link href="/portfolio">
                                <CardHeader className="text-center">
                                    <User className="w-8 h-8 mx-auto mb-2 text-blue-600 group-hover:text-blue-700 transition-colors" />
                                    <CardTitle className="text-lg">{t('navigation.portfolio')}</CardTitle>
                                    <CardDescription>
                                        {t('home.view_portfolio_desc', 'Your personal portfolio')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                            <Link href="/projects">
                                <CardHeader className="text-center">
                                    <ExternalLink className="w-8 h-8 mx-auto mb-2 text-green-600 group-hover:text-green-700 transition-colors" />
                                    <CardTitle className="text-lg">{t('navigation.projects')}</CardTitle>
                                    <CardDescription>
                                        {t('home.browse_projects_desc', 'Discover amazing projects')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                            <Link href="/blog">
                                <CardHeader className="text-center">
                                    <Eye className="w-8 h-8 mx-auto mb-2 text-purple-600 group-hover:text-purple-700 transition-colors" />
                                    <CardTitle className="text-lg">{t('navigation.blog')}</CardTitle>
                                    <CardDescription>
                                        {t('home.read_blog_desc', 'Read latest articles')}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                            <Link href="/contact">
                                <CardHeader className="text-center">
                                    <Github className="w-8 h-8 mx-auto mb-2 text-orange-600 group-hover:text-orange-700 transition-colors" />
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
