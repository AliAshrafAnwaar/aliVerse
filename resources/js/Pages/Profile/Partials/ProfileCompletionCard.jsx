import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import { useTranslation } from 'react-i18next';
import { User, CheckCircle } from 'lucide-react';

export default function ProfileCompletionCard({ user }) {
    const { t } = useTranslation();

    const getCompletionColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getCompletionVariant = (percentage) => {
        if (percentage >= 80) return 'default';
        if (percentage >= 50) return 'secondary';
        return 'destructive';
    };

    const missingFields = [];
    if (!user.avatar) missingFields.push('Avatar');
    if (!user.bio) missingFields.push('Bio');
    if (!user.location) missingFields.push('Location');
    if (!user.website) missingFields.push('Website');
    if (!user.github_url) missingFields.push('GitHub');
    if (!user.linkedin_url) missingFields.push('LinkedIn');
    if (!user.twitter_url) missingFields.push('Twitter');

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    {t('profile.completion.title', 'Profile Completion')}
                </CardTitle>
                <CardDescription>
                    {t('profile.completion.description', 'Complete your profile to showcase your professional information')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            {user.profile_completion}% {t('profile.completion.complete', 'Complete')}
                        </span>
                        <Badge variant={getCompletionVariant(user.profile_completion)}>
                            {user.profile_completion >= 80 ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                            ) : null}
                            {user.profile_completion >= 80 
                                ? t('profile.completion.excellent', 'Excellent')
                                : user.profile_completion >= 50
                                ? t('profile.completion.good', 'Good')
                                : t('profile.completion.needs_work', 'Needs Work')
                            }
                        </Badge>
                    </div>
                    <Progress value={user.profile_completion} className="h-2" />
                </div>

                {missingFields.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {t('profile.completion.missing_fields', 'Missing fields')}:
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {missingFields.map((field, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {field}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {user.profile_completion === 100 && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        {t('profile.completion.perfect', 'Your profile is complete!')}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
