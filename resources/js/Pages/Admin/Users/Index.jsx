import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  ShieldOff,
  Ban,
  UserCheck,
  Search,
  Filter,
  Mail,
  Calendar,
  UserX
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminUsersIndex({ auth, users, filters }) {
  const { t } = useTranslation();

  const handleSearch = (e) => {
    router.get(route('admin.users.index'), { ...filters, search: e.target.value }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleFilter = (key, value) => {
    router.get(route('admin.users.index'), { ...filters, [key]: value }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDelete = (id) => {
    if (confirm(t('users.confirm_delete'))) {
      router.delete(route('admin.users.destroy', id));
    }
  };

  const handleToggleAdmin = (id) => {
    router.post(route('admin.users.toggle-admin', id));
  };

  const handleToggleBan = (id) => {
    router.post(route('admin.users.toggle-ban', id));
  };

  const getRoleBadge = (isAdmin) => {
    return (
      <Badge variant={isAdmin ? 'default' : 'secondary'}>
        {isAdmin ? (
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
    );
  };

  const getStatusBadge = (emailVerifiedAt) => {
    const isActive = emailVerifiedAt !== null;
    return (
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
    );
  };

  return (
    <AdminLayout user={auth.user} header={t('users.manage_users')}>
      <Head title={t('users.manage_users')} />

      <div className="py-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('users.manage_users')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('users.manage_users_description')}
              </p>
            </div>
            <Link href={route('register')}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('users.create_user')}
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t('common.filters')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="search"
                    placeholder={t('users.search_users')}
                    value={filters.search || ''}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                
                <Select
                  value={filters.role || 'all'}
                  onValueChange={(value) => handleFilter('role', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('users.filter_role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="admin">{t('users.admin')}</SelectItem>
                    <SelectItem value="user">{t('users.user')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilter('status', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('users.filter_status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="active">{t('users.active')}</SelectItem>
                    <SelectItem value="inactive">{t('users.banned')}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => router.get(route('admin.users.index'))}
                    disabled={!filters.search && !filters.role && !filters.status}
                    className="w-full"
                  >
                    {t('common.clear_filters')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardContent className="p-0">
              {users.data.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {filters.search || filters.role || filters.status
                      ? t('users.no_users_found')
                      : t('users.no_users_yet')}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('users.name')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('users.email')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('users.role')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('users.status')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('users.created_at')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('common.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.data.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-primary font-medium">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getRoleBadge(user.is_admin)}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(user.email_verified_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={route('admin.users.show', user.id)}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={route('admin.users.edit', user.id)}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleAdmin(user.id)}
                                className={user.is_admin ? 'text-orange-600 hover:text-orange-700' : ''}
                                title={user.is_admin ? t('users.remove_admin') : t('users.make_admin')}
                              >
                                {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleBan(user.id)}
                                className={user.email_verified_at ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                                title={user.email_verified_at ? t('users.ban_user') : t('users.unban_user')}
                              >
                                {user.email_verified_at ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={user.id === auth.user.id}
                                title={user.id === auth.user.id ? t('users.cannot_delete_self') : t('common.delete')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {users.links && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2">
                {users.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-3 py-2 text-sm rounded-md ${
                      link.active
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
