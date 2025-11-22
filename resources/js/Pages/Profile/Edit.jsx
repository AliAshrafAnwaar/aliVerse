import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ProfileAvatarSection from './Partials/ProfileAvatarSection';
import ProfileSocialSection from './Partials/ProfileSocialSection';
import ProfileCompletionCard from './Partials/ProfileCompletionCard';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const { t } = useTranslation();

    return (
        <PublicLayout user={auth.user}>
            <Head title={t('profile.title', 'Profile Settings')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <ProfileCompletionCard user={auth.user} />
                            <ProfileAvatarSection user={auth.user} />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />

                            {/* Social Links */}
                            <ProfileSocialSection user={auth.user} />

                            {/* Password */}
                            <UpdatePasswordForm />

                            {/* Delete Account */}
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
