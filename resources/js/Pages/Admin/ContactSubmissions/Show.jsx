import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { 
  Mail, 
  MessageSquare,
  User,
  Calendar,
  Globe,
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  Reply,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, submission }) {
  const { t } = useTranslation();

  const handleMarkAsRead = () => {
    router.post(route('admin.contact-submissions.mark-read', submission.id));
  };

  const handleMarkAsUnread = () => {
    router.post(route('admin.contact-submissions.mark-unread', submission.id));
  };

  const handleDelete = () => {
    if (confirm(t('common.confirm_delete', 'Are you sure you want to delete this submission?'))) {
      router.delete(route('admin.contact-submissions.destroy', submission.id));
    }
  };

  const handleReply = () => {
    window.location.href = `mailto:${submission.email}?subject=Re: ${submission.subject || 'Your message to me'}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t('contact_submissions.view_submission', 'View Contact Submission')} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link href={route('admin.contact-submissions.index')}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('contact_submissions.back_to_list', 'Back to Submissions')}
              </Button>
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('contact_submissions.submission_details', 'Submission Details')}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {t('contact_submissions.submission_description', 'View and manage this contact form submission')}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {!submission.is_read ? (
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    <Clock className="w-3 h-3 mr-1" />
                    {t('contact_submissions.unread', 'Unread')}
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t('contact_submissions.read', 'Read')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleReply}>
                  <Reply className="h-4 w-4 mr-2" />
                  {t('contact_submissions.reply_via_email', 'Reply via Email')}
                </Button>
                
                {!submission.is_read ? (
                  <Button variant="outline" onClick={handleMarkAsRead}>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('contact_submissions.mark_as_read', 'Mark as Read')}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleMarkAsUnread}>
                    <EyeOff className="h-4 w-4 mr-2" />
                    {t('contact_submissions.mark_as_unread', 'Mark as Unread')}
                  </Button>
                )}
                
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sender Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                {t('contact_submissions.sender_information', 'Sender Information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('contact_submissions.name', 'Name')}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {submission.name}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('contact_submissions.email', 'Email')}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`mailto:${submission.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {submission.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Subject */}
              {submission.subject && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('contact_submissions.subject', 'Subject')}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {submission.subject}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                {t('contact_submissions.message', 'Message')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                  {submission.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                {t('contact_submissions.technical_details', 'Technical Details')}
              </CardTitle>
              <CardDescription>
                {t('contact_submissions.technical_description', 'Submission metadata and tracking information')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Submission Date */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('contact_submissions.submitted_at', 'Submitted At')}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(submission.created_at)}
                    </span>
                  </div>
                </div>

                {/* IP Address */}
                {submission.ip_address && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('contact_submissions.ip_address', 'IP Address')}
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-mono">
                        {submission.ip_address}
                      </span>
                    </div>
                  </div>
                )}

                {/* User Agent */}
                {submission.user_agent && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('contact_submissions.user_agent', 'User Agent')}
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                        {submission.user_agent}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {t('contact_submissions.status', 'Status')}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {submission.is_read ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 dark:text-green-300 font-medium">
                          {t('contact_submissions.read', 'Read')}
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-800 dark:text-orange-300 font-medium">
                          {t('contact_submissions.unread', 'Unread')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
