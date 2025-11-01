import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { Github, Linkedin, Twitter, Globe, MapPin, FileText } from 'lucide-react';
import { profileService } from '@/api';
import { useToast } from '@/hooks/use-toast';

// Hoisted to module scope to keep a stable component identity and avoid remounts (which caused focus loss)
const SocialInput = ({ data, setData, errors, icon: Icon, label, name, placeholder, type = 'text' }) => (
    <div className="space-y-2">
        <Label htmlFor={name} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {label}
        </Label>
        <Input
            id={name}
            type={type}
            value={data[name]}
            onChange={(e) => setData(name, e.target.value)}
            placeholder={placeholder}
            className={errors[name] ? 'border-red-500' : ''}
        />
        {errors[name] && (
            <p className="text-sm text-red-600">{errors[name]}</p>
        )}
    </div>
);

export default function ProfileSocialSection({ user }) {
    const { t } = useTranslation();
    const { toast } = useToast();

    const { data, setData, processing, errors, clearErrors, setError } = useForm({
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        github_url: user.github_url || '',
        linkedin_url: user.linkedin_url || '',
        twitter_url: user.twitter_url || '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        if (processing) return;
        
        clearErrors();
        
        profileService.updateAdvanced({
            ...data,
            name: user.name,
            email: user.email,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast({
                    title: t('profile.social.success_title', 'Profile updated'),
                    description: t('profile.social.success_message', 'Your about and social links have been updated.'),
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    {t('profile.social.title', 'About & Social Links')}
                </CardTitle>
                <CardDescription>
                    {t('profile.social.description', 'Add information about yourself and your social media profiles')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {t('profile.social.bio', 'Bio')}
                        </Label>
                        <Textarea
                            id="bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            placeholder={t('profile.social.bio_placeholder', 'Tell us about yourself...')}
                            rows={4}
                            className={errors.bio ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-muted-foreground">
                            {data.bio?.length || 0}/1000 {t('profile.social.characters', 'characters')}
                        </p>
                        {errors.bio && (
                            <p className="text-sm text-red-600">{errors.bio}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Location */}
                        <SocialInput
                            data={data}
                            setData={setData}
                            errors={errors}
                            icon={MapPin}
                            label={t('profile.social.location', 'Location')}
                            name="location"
                            placeholder={t('profile.social.location_placeholder', 'City, Country')}
                        />

                        {/* Website */}
                        <SocialInput
                            data={data}
                            setData={setData}
                            errors={errors}
                            icon={Globe}
                            label={t('profile.social.website', 'Website')}
                            name="website"
                            placeholder="https://yourwebsite.com"
                            type="url"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* GitHub */}
                        <SocialInput
                            data={data}
                            setData={setData}
                            errors={errors}
                            icon={Github}
                            label={t('profile.social.github', 'GitHub')}
                            name="github_url"
                            placeholder="https://github.com/username"
                            type="url"
                        />

                        {/* LinkedIn */}
                        <SocialInput
                            data={data}
                            setData={setData}
                            errors={errors}
                            icon={Linkedin}
                            label={t('profile.social.linkedin', 'LinkedIn')}
                            name="linkedin_url"
                            placeholder="https://linkedin.com/in/username"
                            type="url"
                        />

                        {/* Twitter */}
                        <SocialInput
                            data={data}
                            setData={setData}
                            errors={errors}
                            icon={Twitter}
                            label={t('profile.social.twitter', 'Twitter')}
                            name="twitter_url"
                            placeholder="https://twitter.com/username"
                            type="url"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing 
                                ? t('common.saving', 'Saving...') 
                                : t('profile.social.save', 'Save Changes')
                            }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
