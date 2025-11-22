import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
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
  User,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import ContactForm from '@/Components/Contact/ContactForm';

export default function Index({ contact }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

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
    <PublicLayout user={auth?.user} portfolioOwner={contact.user || auth?.user}>
      <Head title={contact.meta_title || `${contact.title} - ${contact.user?.name}`} />
      
      {contact.meta_description && (
        <meta name="description" content={contact.meta_description} />
      )}

      {/* Add animation keyframes */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {t('contact.hey_there', "Let's Connect")}
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
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Primary Contact */}
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-1">
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
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-1">
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
          <Card className="mt-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all">
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

        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('contact.get_in_touch', "Get in Touch Directly")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('contact.form_description', "Prefer to send a message directly? Fill out the form below and I'll respond to your email address.")}
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('contact.excited_to_hear_from_you', "Excited to hear from you!")}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('contact.looking_forward_to_chatting', "Whether it's a project, collaboration, or just a friendly hello - I'm always up for a good chat!")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => copyToClipboard(contact.email, 'email')}>
                <Mail className="w-5 h-5 mr-2" />
                {t('contact.copy_email', 'Copy Email')}
              </Button>
              {contact.linkedin_url && (
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" 
                        onClick={() => window.open(contact.linkedin_url, '_blank')}>
                  <Linkedin className="w-5 h-5 mr-2" />
                  {t('contact.connect_on_linkedin', 'Connect on LinkedIn')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
