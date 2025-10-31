import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Info, TrendingUp, Users, Activity } from 'lucide-react';

export default function Dashboard() {
    const { t } = useTranslation();

    const stats = [
        { title: 'Total Users', value: '2,543', change: '+12%', icon: Users, variant: 'default' },
        { title: 'Active Projects', value: '18', change: '+3', icon: Activity, variant: 'success' },
        { title: 'Growth', value: '23.5%', change: '+5.2%', icon: TrendingUp, variant: 'info' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    {t('common.dashboard')}
                </h2>
            }
        >
            <Head title={t('common.dashboard')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Welcome Alert */}
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>{t('dashboard.welcome_message', { name: 'User' })}</AlertTitle>
                        <AlertDescription>
                            This dashboard showcases shadcn/ui components with dark/light mode and multi-language support.
                        </AlertDescription>
                    </Alert>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={index} className="overflow-hidden">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {stat.title}
                                        </CardTitle>
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <Badge variant={stat.variant} className="mt-2">
                                            {stat.change} from last month
                                        </Badge>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Feature Cards */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('dashboard.quick_actions')}</CardTitle>
                                <CardDescription>
                                    Common actions you can perform
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" variant="default">
                                    {t('common.create')} New Project
                                </Button>
                                <Button className="w-full" variant="outline">
                                    View {t('dashboard.recent_activity')}
                                </Button>
                            </CardContent>
                            <CardFooter>
                                <Button variant="link" className="px-0">
                                    View All →
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Component Showcase</CardTitle>
                                <CardDescription>
                                    Examples of shadcn/ui components in action
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2 flex-wrap">
                                    <Badge>Default</Badge>
                                    <Badge variant="secondary">Secondary</Badge>
                                    <Badge variant="destructive">Destructive</Badge>
                                    <Badge variant="outline">Outline</Badge>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <Button size="sm" variant="default">Small</Button>
                                    <Button size="default" variant="secondary">Default</Button>
                                    <Button size="lg" variant="outline">Large</Button>
                                </div>
                            </CardContent>
                            <CardFooter className="text-sm text-muted-foreground">
                                Try switching between light and dark modes! 🌓
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Info Card */}
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Theme & Language Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                ✨ Click the moon/sun icon in the navigation to toggle dark/light mode
                            </p>
                            <p className="text-sm text-muted-foreground">
                                🌍 Click the language icon to switch between English and Arabic (with RTL support)
                            </p>
                            <p className="text-sm text-muted-foreground">
                                🎨 All colors automatically adapt to your theme preference
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
