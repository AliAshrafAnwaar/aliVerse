import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Link, useForm, usePage } from '@inertiajs/react';
import { User, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { profileService } from '@/api';
import { useToast } from '@/hooks/use-toast';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;
    const { toast } = useToast();

    const { data, setData, processing, errors, recentlySuccessful, clearErrors, setError } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        
        if (processing) return;
        
        clearErrors();
        
        profileService.updateBasic(data, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast({
                    title: t('profile.basic.success_title', 'Profile updated'),
                    description: t('profile.basic.success_message', 'Your basic information has been updated.'),
                });
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    setError(key, errors[key]);
                });
                const first = Object.values(errors)[0];
                if (first) {
                    toast({ title: t('common.error', 'Error'), description: first, variant: 'destructive' });
                }
            },
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('profile.basic.title', 'Basic Information')}
                </CardTitle>
                <CardDescription>
                    {t('profile.basic.description', 'Update your account\'s profile information and email address')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    {/* Email Verification Alert */}
                    {mustVerifyEmail && user.email_verified_at === null && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <span className="text-sm">
                                    {t('profile.email_verification_required', 'Your email address is unverified.')}
                                </span>
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="underline text-sm text-muted-foreground hover:text-foreground ml-1"
                                >
                                    {t('profile.click_here_to_resend', 'Click here to resend the verification email.')}
                                </Link>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success Message */}
                    {recentlySuccessful && (
                        <Alert className="border-green-200 bg-green-50 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                {t('profile.basic.saved', 'Profile information saved successfully!')}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t('profile.basic.name', 'Name')}
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {t('profile.basic.email', 'Email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing 
                                ? t('common.saving', 'Saving...') 
                                : t('profile.basic.save', 'Save Changes')
                            }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
