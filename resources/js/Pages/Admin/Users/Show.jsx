import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff,
  Ban,
  UserCheck,
  Mail,
  Calendar,
  UserX,
  FileText,
  Folder,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminUsersShow({ auth, user }) {
  const { t } = useTranslation();

  const handleToggleAdmin = () => {
    router.post(route('admin.users.toggle-admin', user.id));
  };

  const handleToggleBan = () => {
    router.post(route('admin.users.toggle-ban', user.id));
  };

  const handleDelete = () => {
    if (confirm(t('users.confirm_delete'))) {
      router.delete(route('admin.users.destroy', user.id));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isActive = user.email_verified_at !== null;

  return (
    <AdminLayout user={auth.user} header={t('users.user_details')}>
      <Head title={`${user.name} - ${t('users.user')}`} />

      <div className="py-0">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={route('admin.users.index')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back_to_users')}
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
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant={user.is_admin ? 'default' : 'secondary'}>
                      {user.is_admin ? (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          {t('users.admin')}
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          {t('users.user')}
                        </>
                      )}
                    </Badge>
                    <Badge variant={isActive ? 'default' : 'destructive'}>
                      {isActive ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          {t('users.active')}
                        </>
                      ) : (
                        <>
                          <Ban className="w-3 h-3 mr-1" />
                          {t('users.banned')}
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t('users.joined_on')}:</span>
                      <span>{formatDate(user.created_at)}</span>
                    </div>
                    {user.email_verified_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{t('users.email_verified')}:</span>
                        <span>{formatDate(user.email_verified_at)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t('users.user_id')}:</span>
                      <span>#{user.id}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link href={route('admin.users.edit', user.id)}>
                      <Button className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        {t('common.edit')}
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleToggleAdmin}
                      disabled={user.id === auth.user.id}
                    >
                      {user.is_admin ? (
                        <>
                          <ShieldOff className="w-4 h-4 mr-2" />
                          {t('users.remove_admin')}
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          {t('users.make_admin')}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleToggleBan}
                      disabled={user.id === auth.user.id}
                    >
                      {isActive ? (
                        <>
                          <Ban className="w-4 h-4 mr-2" />
                          {t('users.ban_user')}
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          {t('users.unban_user')}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleDelete}
                      disabled={user.id === auth.user.id}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('common.delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('users.statistics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {user.posts_count || 0}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <FileText className="w-4 h-4" />
                        {t('users.posts')}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {user.projects_count || 0}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Folder className="w-4 h-4" />
                        {t('users.projects')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('users.recent_activity')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-muted-foreground">{t('users.account_created')}</span>
                      <span>{formatDate(user.created_at)}</span>
                    </div>
                    {user.email_verified_at && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-muted-foreground">{t('users.email_verified')}</span>
                        <span>{formatDate(user.email_verified_at)}</span>
                      </div>
                    )}
                    {user.updated_at !== user.created_at && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-muted-foreground">{t('users.last_updated')}</span>
                        <span>{formatDate(user.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('users.permissions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('users.admin_access')}</span>
                      <Badge variant={user.is_admin ? 'default' : 'secondary'}>
                        {user.is_admin ? t('common.enabled') : t('common.disabled')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('users.account_status')}</span>
                      <Badge variant={isActive ? 'default' : 'destructive'}>
                        {isActive ? t('users.active') : t('users.banned')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('users.email_verification')}</span>
                      <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                        {user.email_verified_at ? t('users.verified') : t('users.not_verified')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
