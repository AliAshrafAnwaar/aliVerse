import React, { useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminUsersEdit({ auth, user }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    role: user.role || 'user',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('admin.users.update', user.id), {
      onSuccess: () => {
        reset('password', 'password_confirmation');
      },
    });
  };

  return (
    <AdminLayout user={auth.user} header={t('users.edit_user')}>
      <Head title={`${t('users.edit_user')}: ${user.name}`} />

      <div className="py-0">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={route('admin.users.show', user.id)}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back_to_user')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('users.user_id')}: #{user.id}
                  </p>
                </CardHeader>
              </Card>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('users.edit_user')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('users.basic_information')}</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('users.name')}</Label>
                        <Input
                          id="name"
                          type="text"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          required
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t('users.email')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          required
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Password */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('users.change_password')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('users.password_change_note')}
                      </p>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">{t('users.new_password')}</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            placeholder={t('users.leave_empty_to_keep')}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-600">{errors.password}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password_confirmation">{t('users.confirm_password')}</Label>
                        <div className="relative">
                          <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            placeholder={t('users.confirm_new_password')}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {errors.password_confirmation && (
                          <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Role Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('users.permissions')}</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">{t('users.role')}</Label>
                        <Select
                          value={data.role}
                          onValueChange={(value) => setData('role', value)}
                          disabled={user.id === auth.user.id}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('users.filter_role')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">{t('users.user')}</SelectItem>
                            <SelectItem value="admin">{t('users.admin')}</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.role && (
                          <p className="text-sm text-red-600">{errors.role}</p>
                        )}
                      </div>
                      {user.id === auth.user.id && (
                        <p className="text-sm text-muted-foreground">
                          {t('users.cannot_change_own_admin_status')}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                      <Button type="submit" disabled={processing}>
                        <Save className="w-4 h-4 mr-2" />
                        {t('common.save')}
                      </Button>
                      <Link href={route('admin.users.show', user.id)}>
                        <Button type="button" variant="outline">
                          {t('common.cancel')}
                        </Button>
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
