import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Lock } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } =
        useForm({
            current_password: '',
            password: '',
            password_confirmation: '',
        });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast({
                    title: t('profile.password.success_title', 'Password Updated'),
                    description: t('profile.password.success_message', 'Your password has been updated successfully.'),
                });
            },
            onError: (errors) => {
                if (errors.password) {
                    toast({
                        title: t('common.error', 'Error'),
                        description: errors.password,
                        variant: 'destructive',
                    });
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {t('profile.password.title', 'Update Password')}
                </CardTitle>
                <CardDescription>
                    {t('profile.password.description', 'Ensure your account is using a long, random password to stay secure.')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <section className={className}>
                    <form onSubmit={updatePassword} className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="current_password">
                                {t('profile.password.current', 'Current Password')}
                            </Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) =>
                                    setData('current_password', e.target.value)
                                }
                                type="password"
                                className="w-full"
                                autoComplete="current-password"
                                placeholder={t('profile.password.current_placeholder', 'Enter current password')}
                            />

                            {errors.current_password && (
                                <p className="text-sm text-red-600">{errors.current_password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {t('profile.password.new', 'New Password')}
                            </Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="w-full"
                                autoComplete="new-password"
                                placeholder={t('profile.password.new_placeholder', 'Enter new password')}
                            />

                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                {t('profile.password.confirm', 'Confirm Password')}
                            </Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                type="password"
                                className="w-full"
                                autoComplete="new-password"
                                placeholder={t('profile.password.confirm_placeholder', 'Confirm new password')}
                            />

                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing 
                                    ? t('common.saving', 'Saving...') 
                                    : t('profile.password.save', 'Update Password')
                                }
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">
                                    {t('profile.password.saved', 'Saved.')}
                                </p>
                            </Transition>
                        </div>
                    </form>
                </section>
            </CardContent>
        </Card>
    );
}
