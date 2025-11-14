import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  MessageCircle,
  Send,
  Clock,
  Briefcase,
  Calendar,
  Sparkles,
  User
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ contact }) {
  const { t } = useTranslation();

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    // Add a subtle animation feedback
    const originalText = event.target.textContent;
    event.target.textContent = 'Copied!';
    event.target.classList.add('text-green-600');
    setTimeout(() => {
      event.target.textContent = originalText;
      event.target.classList.remove('text-green-600');
    }, 2000);
  };

  const formatSocialUrl = (url, platform) => {
    if (!url) return null;
    
    // Clean up the URL for display
    let displayText = url;
    if (url.includes('linkedin.com/in/')) {
      displayText = url.split('linkedin.com/in/')[1];
    } else if (url.includes('github.com/')) {
      displayText = url.split('github.com/')[1];
    } else if (url.includes('twitter.com/')) {
      displayText = url.split('twitter.com/')[1];
    } else if (url.includes('instagram.com/')) {
      displayText = url.split('instagram.com/')[1];
    } else if (url.includes('facebook.com/')) {
      displayText = url.split('facebook.com/')[1];
    }
    
    return { url, displayText };
  };

  const socialLinks = [
    { 
      icon: Linkedin, 
      url: contact.linkedin_url, 
      label: 'LinkedIn', 
      color: 'text-blue-700 hover:text-blue-800',
      bgColor: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
    },
    { 
      icon: Github, 
      url: contact.github_url, 
      label: 'GitHub', 
      color: 'text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200',
      bgColor: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/30'
    },
    { 
      icon: Twitter, 
      url: contact.twitter_url, 
      label: 'Twitter', 
      color: 'text-sky-500 hover:text-sky-600',
      bgColor: 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-900/20 dark:hover:bg-sky-900/30'
    },
    { 
      icon: Instagram, 
      url: contact.instagram_url, 
      label: 'Instagram', 
      color: 'text-pink-600 hover:text-pink-700',
      bgColor: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/30'
    },
    { 
      icon: Facebook, 
      url: contact.facebook_url, 
      label: 'Facebook', 
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
    },
    { 
      icon: MessageCircle, 
      url: contact.whatsapp_number, 
      label: 'WhatsApp', 
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30',
      isSpecial: true,
      formatUrl: (number) => `https://wa.me/${number.replace(/[^\d]/g, '')}`
    },
    { 
      icon: Send, 
      url: contact.telegram_username, 
      label: 'Telegram', 
      color: 'text-blue-500 hover:text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30',
      isSpecial: true,
      formatUrl: (username) => `https://t.me/${username}`
    },
  ].filter(link => link.url);

  return (
    <AuthenticatedLayout>
      <Head title={contact.meta_title || `${contact.title} - ${contact.user?.name}`} />
      
      {contact.meta_description && (
        <meta name="description" content={contact.meta_description} />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('contact.hey_there', "Hey there! Let's connect")}
              </h1>
              
              {contact.subtitle && (
                <p className="text-2xl text-gray-600 dark:text-gray-300 mb-6">
                  {contact.subtitle}
                </p>
              )}
              
              {contact.description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  {contact.description}
                </p>
              )}
              
              <div className="mt-8 flex justify-center gap-4">
                {contact.available_for_work && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-4 py-2 text-sm font-medium">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {t('contact.lets_build_something', "Let's build something amazing!")}
                  </Badge>
                )}
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('contact.ready_to_chat', 'Ready to chat')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Primary Contact */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t('contact.how_can_we_connect', "How would you like to connect?")}
                </CardTitle>
                <CardDescription className="text-lg">
                  {t('contact.choose_your_favorite_way', "Pick your favorite way to reach out - I'm excited to hear from you!")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contact.email && (
                  <div className="group">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                         onClick={() => copyToClipboard(contact.email, 'email')}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{t('contact.drop_me_a_line', 'Drop me a line')}</p>
                          <p className="text-blue-600 dark:text-blue-400 hover:underline">{contact.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div className="group">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
                         onClick={() => copyToClipboard(contact.phone, 'phone')}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{t('contact.give_me_a_call', 'Give me a call')}</p>
                          <a href={`tel:${contact.phone}`} className="text-green-600 dark:text-green-400 hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                )}

                {contact.location && (
                  <div className="group">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t('contact.where_i_am', 'Where I am')}</p>
                        <p className="text-purple-600 dark:text-purple-400">{contact.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {contact.website && (
                  <div className="group">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{t('contact.check_out_my_site', 'Check out my site')}</p>
                        <a href={contact.website} target="_blank" rel="noopener noreferrer" 
                           className="text-orange-600 dark:text-orange-400 hover:underline">
                          {contact.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  {t('contact.lets_be_friends', "Let's be friends online!")}
                </CardTitle>
                <CardDescription className="text-lg">
                  {t('contact.follow_my_adventures', "Follow my adventures and let's share some cool stuff together")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    const finalUrl = social.isSpecial ? social.formatUrl(social.url) : social.url;
                    const displayText = social.isSpecial ? social.url : formatSocialUrl(social.url, social.label)?.displayText;
                    
                    return (
                      <a
                        key={index}
                        href={finalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-4 rounded-lg ${social.bgColor} transition-all hover:scale-105 hover:shadow-md`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${social.bgColor}`}>
                          <Icon className={`w-5 h-5 ${social.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{social.label}</p>
                          <p className={`text-sm ${social.color} truncate max-w-[120px]`}>
                            {displayText}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Availability Information */}
          <Card className="mt-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                {t('contact.when_to_expect_reply', 'When to expect a reply')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {t('contact.currently', 'Currently')}
                  </h3>
                  <p className={`text-lg font-medium ${contact.available_for_work ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {contact.available_for_work ? t('contact.open_for_opportunities', 'Open for new opportunities!') : t('contact.focused_on_current_projects', 'Focused on current projects')}
                  </p>
                </div>

                {contact.response_time && (
                  <div className="text-center p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {t('contact.response_time', 'I usually reply within')}
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400">
                      {contact.response_time}
                    </p>
                  </div>
                )}

                {contact.working_hours && (
                  <div className="text-center p-6 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {t('contact.best_time_to_reach', 'Best time to reach me')}
                    </h3>
                    <p className="text-lg text-purple-600 dark:text-purple-400">
                      {contact.working_hours}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">
                  {t('contact.excited_to_hear_from_you', "Excited to hear from you!")}
                </h2>
                <p className="text-xl mb-8 text-blue-100">
                  {t('contact.looking_forward_to_chatting', "Whether it's a project, collaboration, or just a friendly hello - I'm always up for a good chat!")}
                </p>
                <div className="flex justify-center gap-4">
                  <Button size="lg" variant="secondary" onClick={() => copyToClipboard(contact.email, 'email')}>
                    <Mail className="w-5 h-5 mr-2" />
                    {t('contact.copy_email', 'Copy Email')}
                  </Button>
                  {contact.linkedin_url && (
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" 
                            onClick={() => window.open(contact.linkedin_url, '_blank')}>
                      <Linkedin className="w-5 h-5 mr-2" />
                      {t('contact.connect_on_linkedin', 'Connect on LinkedIn')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
