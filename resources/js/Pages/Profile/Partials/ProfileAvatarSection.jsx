import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { profileService } from '@/api';
import { useToast } from '@/hooks/use-toast';

export default function ProfileAvatarSection({ user }) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        
        profileService.uploadAvatar(file, {
            name: user.name,
            email: user.email,
            bio: user.bio || '',
            location: user.location || '',
            website: user.website || '',
            github_url: user.github_url || '',
            linkedin_url: user.linkedin_url || '',
            twitter_url: user.twitter_url || '',
        }, {
            onSuccess: () => {
                setUploading(false);
                toast({
                    title: t('profile.avatar.success_title', 'Avatar uploaded'),
                    description: t('profile.avatar.success_message', 'Your avatar has been uploaded successfully.'),
                });
                e.target.value = ''; // Reset file input
            },
            onError: (errors) => {
                console.error('Avatar upload error:', errors);
                setUploading(false);    
                toast({
                    title: t('profile.avatar.error_title', 'Avatar upload failed'),
                    description: t('profile.avatar.error_message', 'Failed to upload avatar. Please try again.'),
                    variant: 'destructive',
                });
            },
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    const handleRemoveAvatar = () => {
        if (confirm(t('profile.avatar.remove_confirm', 'Are you sure you want to remove your avatar?'))) {
            profileService.removeAvatar({
                onSuccess: () => {
                    toast({
                        title: t('profile.avatar.remove_success_title', 'Avatar removed'),
                        description: t('profile.avatar.remove_success_message', 'Your avatar has been removed successfully.'),
                    });
                },
                onError: (errors) => {
                    toast({
                        title: t('common.error', 'Error'),
                        description: t('profile.avatar.remove_error', 'Failed to remove avatar. Please try again.'),
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5" />
                    {t('profile.avatar.title', 'Profile Avatar')}
                </CardTitle>
                <CardDescription>
                    {t('profile.avatar.description', 'Upload a profile picture to personalize your account')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback className="text-lg">
                            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                        />
                        <Button 
                            variant="outline" 
                            className="w-full"
                            disabled={uploading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading 
                                ? t('common.uploading', 'Uploading...') 
                                : t('profile.avatar.upload', 'Upload New Avatar')
                            }
                        </Button>
                    </div>

                    {user.avatar && (
                        <Button 
                            variant="outline" 
                            className="w-full text-destructive hover:text-destructive"
                            onClick={handleRemoveAvatar}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('profile.avatar.remove', 'Remove Avatar')}
                        </Button>
                    )}
                </div>

                <div className="text-xs text-muted-foreground text-center">
                    {t('profile.avatar.allowed_formats', 'Allowed formats: JPEG, PNG, JPG, GIF, WebP')}
                    <br />
                    {t('profile.avatar.max_size', 'Maximum size: 2MB')}
                </div>
            </CardContent>
        </Card>
    );
}
