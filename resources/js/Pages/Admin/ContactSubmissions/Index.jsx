import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Checkbox } from '@/Components/ui/checkbox';
import { 
  Mail, 
  MessageSquare,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Calendar,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function Index({ auth, submissions, stats, filters }) {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState(filters.search || '');
  const [filter, setFilter] = useState(filters.filter || 'all');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    router.get(
      route('admin.contact-submissions.index'),
      { search: value, filter },
      { preserveScroll: true, replace: true }
    );
  };

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
    
    router.get(
      route('admin.contact-submissions.index'),
      { search, filter: newFilter },
      { preserveScroll: true, replace: true }
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(submissions.data.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) return;

    const routeMap = {
      'mark-read': route('admin.contact-submissions.bulk-mark-read'),
      'mark-unread': route('admin.contact-submissions.bulk-mark-unread'),
      'delete': route('admin.contact-submissions.bulk-delete'),
    };

    router.post(routeMap[action], { ids: selectedIds }, {
      onSuccess: () => setSelectedIds([]),
    });
  };

  const handleMarkAsRead = (id) => {
    router.post(route('admin.contact-submissions.mark-read', id));
  };

  const handleMarkAsUnread = (id) => {
    router.post(route('admin.contact-submissions.mark-unread', id));
  };

  const handleDelete = (id) => {
    if (confirm(t('common.confirm_delete', 'Are you sure you want to delete this item?'))) {
      router.delete(route('admin.contact-submissions.destroy', id));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t('contact_submissions.title', 'Contact Submissions')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('contact_submissions.title', 'Contact Submissions')}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {t('contact_submissions.description', 'Manage and respond to contact form submissions')}
                </p>
              </div>
              <Button variant="outline" onClick={() => router.reload()}>
                {t('common.refresh', 'Refresh')}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('contact_submissions.total_submissions', 'Total Submissions')}
                </CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('contact_submissions.unread', 'Unread')}
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('contact_submissions.read', 'Read')}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.read}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('contact_submissions.search_placeholder', 'Search by name, email, or subject...')}
                      value={search}
                      onChange={handleSearch}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => handleFilter('all')}
                  >
                    {t('contact_submissions.filter_all', 'All')} ({stats.total})
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    onClick={() => handleFilter('unread')}
                  >
                    {t('contact_submissions.filter_unread', 'Unread')} ({stats.unread})
                  </Button>
                  <Button
                    variant={filter === 'read' ? 'default' : 'outline'}
                    onClick={() => handleFilter('read')}
                  >
                    {t('contact_submissions.filter_read', 'Read')} ({stats.read})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    {t('contact_submissions.selected_count', '{count} selected', { count: selectedIds.length })}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('mark-read')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {t('contact_submissions.mark_as_read', 'Mark as Read')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('mark-unread')}
                    >
                      <EyeOff className="h-4 w-4 mr-1" />
                      {t('contact_submissions.mark_as_unread', 'Mark as Unread')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('contact_submissions.delete_selected', 'Delete Selected')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submissions List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('contact_submissions.recent_submissions', 'Recent Submissions')}</CardTitle>
                  <CardDescription>
                    {t('contact_submissions.showing_count', 'Showing {count} submissions', { count: submissions.data.length })}
                  </CardDescription>
                </div>
                {selectedIds.length > 0 && (
                  <Button variant="outline" onClick={() => setSelectedIds([])}>
                    {t('contact_submissions.clear_selection', 'Clear Selection')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {submissions.data.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t('contact_submissions.no_submissions', 'No submissions found')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('contact_submissions.no_submissions_description', 'No contact form submissions match your criteria.')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex items-center gap-4 p-4 border-b dark:border-gray-700">
                    <Checkbox
                      checked={selectedIds.length === submissions.data.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="col-span-3">{t('contact_submissions.sender', 'Sender')}</div>
                      <div className="col-span-3">{t('contact_submissions.subject', 'Subject')}</div>
                      <div className="col-span-3">{t('contact_submissions.message', 'Message')}</div>
                      <div className="col-span-2">{t('contact_submissions.date', 'Date')}</div>
                      <div className="col-span-1">{t('common.actions', 'Actions')}</div>
                    </div>
                  </div>

                  {/* Submissions */}
                  {submissions.data.map((submission) => (
                    <div
                      key={submission.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                        !submission.is_read
                          ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                          : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                      }`}
                    >
                      <Checkbox
                        checked={selectedIds.includes(submission.id)}
                        onCheckedChange={(checked) => handleSelectOne(submission.id, checked)}
                      />
                      
                      <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                        {/* Sender */}
                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {submission.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {submission.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="col-span-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {submission.subject || t('contact_submissions.no_subject', 'No Subject')}
                          </p>
                        </div>

                        {/* Message */}
                        <div className="col-span-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {submission.message}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(submission.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={route('admin.contact-submissions.show', submission.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  {t('common.view', 'View')}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {submission.is_read ? (
                                <DropdownMenuItem onClick={() => handleMarkAsUnread(submission.id)}>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  {t('contact_submissions.mark_as_unread', 'Mark as Unread')}
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleMarkAsRead(submission.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  {t('contact_submissions.mark_as_read', 'Mark as Read')}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(submission.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('common.delete', 'Delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {submissions.links && submissions.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                  <div className="flex gap-2">
                    {submissions.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`px-3 py-2 text-sm rounded-md ${
                          link.active
                            ? 'bg-blue-600 text-white'
                            : link.url
                            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                            : 'text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-600'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
