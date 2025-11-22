import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { 
  Mail, 
  Send, 
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ContactForm() {
  const { t } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const submit = (e) => {
    e.preventDefault();
    
    post(route('contact.store'), {
      onSuccess: () => {
        setShowSuccess(true);
        setShowError(false);
        reset();
        setTimeout(() => setShowSuccess(false), 5000);
      },
      onError: () => {
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      },
      preserveScroll: true,
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Send className="w-6 h-6 text-white" />
          </div>
          {t('contact.send_me_a_message', "Send Me a Message")}
        </CardTitle>
        <CardDescription className="text-lg">
          {t('contact.fill_form_below', "Fill out the form below and I'll get back to you as soon as possible!")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success Alert */}
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {t('contact.message_sent_success', "Thank you for your message! I'll get back to you soon.")}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {showError && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {t('contact.message_sent_error', "Sorry, there was an error sending your message. Please try again.")}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={submit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              {t('contact.your_name', 'Your Name')} *
            </Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder={t('contact.name_placeholder', 'John Doe')}
              className={errors.name ? 'border-red-500' : ''}
              disabled={processing}
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t('contact.your_email', 'Your Email')} *
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder={t('contact.email_placeholder', 'john@example.com')}
              className={errors.email ? 'border-red-500' : ''}
              disabled={processing}
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('contact.subject', 'Subject')} ({t('contact.optional', 'optional')})
            </Label>
            <Input
              id="subject"
              type="text"
              value={data.subject}
              onChange={(e) => setData('subject', e.target.value)}
              placeholder={t('contact.subject_placeholder', 'Project Collaboration')}
              className={errors.subject ? 'border-red-500' : ''}
              disabled={processing}
            />
            {errors.subject && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('contact.your_message', 'Your Message')} *
            </Label>
            <Textarea
              id="message"
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              placeholder={t('contact.message_placeholder', 'Tell me about your project, idea, or just say hello!')}
              rows={6}
              className={errors.message ? 'border-red-500' : 'resize-none'}
              disabled={processing}
            />
            <div className="flex justify-between items-center">
              {errors.message && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {data.message.length}/2000
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('contact.sending', 'Sending...')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {t('contact.send_message', 'Send Message')}
              </>
            )}
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {t('contact.privacy_note', "I respect your privacy and will never share your information with third parties.")}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
