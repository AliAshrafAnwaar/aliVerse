import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
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
  User
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import ENDPOINTS from '@/api/endpoints';

export default function Edit({ auth, contact }) {
  const { t } = useTranslation();
  const [previewMode, setPreviewMode] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    title: contact.title || '',
    subtitle: contact.subtitle || '',
    description: contact.description || '',
    email: contact.email || '',
    phone: contact.phone || '',
    location: contact.location || '',
    website: contact.website || '',
    linkedin_url: contact.linkedin_url || '',
    github_url: contact.github_url || '',
    twitter_url: contact.twitter_url || '',
    instagram_url: contact.instagram_url || '',
    facebook_url: contact.facebook_url || '',
    whatsapp_number: contact.whatsapp_number || '',
    telegram_username: contact.telegram_username || '',
    available_for_work: contact.available_for_work ?? true,
    response_time: contact.response_time || '',
    working_hours: contact.working_hours || '',
    is_active: contact.is_active ?? true,
    meta_title: contact.meta_title || '',
    meta_description: contact.meta_description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(ENDPOINTS.CONTACT.ADMIN.UPDATE, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        console.log('Contact updated successfully');
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      },
    });
  };

  const handlePreview = () => {
    window.open(ENDPOINTS.CONTACT.INDEX, '_blank');
  };

  if (previewMode) {
    return (
      <AdminLayout user={auth.user} header="Preview Contact Page">
        <Head title="Preview Contact Page" />
        
        <div className="py-0">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Button onClick={() => setPreviewMode(false)} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Edit
              </Button>
            </div>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">{data.title}</CardTitle>
                {data.subtitle && (
                  <CardDescription className="text-xl mt-2">{data.subtitle}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {data.description && (
                  <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                    {data.description}
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Contact Information
                    </h3>
                    
                    {data.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
                          {data.email}
                        </a>
                      </div>
                    )}
                    
                    {data.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <a href={`tel:${data.phone}`} className="text-blue-600 hover:underline">
                          {data.phone}
                        </a>
                      </div>
                    )}
                    
                    {data.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span>{data.location}</span>
                      </div>
                    )}
                    
                    {data.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {data.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Social Media
                    </h3>
                    
                    {data.linkedin_url && (
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-5 h-5 text-blue-700" />
                        <a href={data.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          LinkedIn
                        </a>
                      </div>
                    )}
                    
                    {data.github_url && (
                      <div className="flex items-center gap-3">
                        <Github className="w-5 h-5" />
                        <a href={data.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          GitHub
                        </a>
                      </div>
                    )}
                    
                    {data.twitter_url && (
                      <div className="flex items-center gap-3">
                        <Twitter className="w-5 h-5 text-sky-500" />
                        <a href={data.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Twitter
                        </a>
                      </div>
                    )}
                    
                    {data.instagram_url && (
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <a href={data.instagram_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Instagram
                        </a>
                      </div>
                    )}
                    
                    {data.facebook_url && (
                      <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <a href={data.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Facebook
                        </a>
                      </div>
                    )}
                    
                    {data.whatsapp_number && (
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <a href={`https://wa.me/${data.whatsapp_number.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          WhatsApp
                        </a>
                      </div>
                    )}
                    
                    {data.telegram_username && (
                      <div className="flex items-center gap-3">
                        <Send className="w-5 h-5 text-blue-500" />
                        <a href={`https://t.me/${data.telegram_username}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Telegram
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Availability
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <span className={data.available_for_work ? 'text-green-600' : 'text-red-600'}>
                      {data.available_for_work ? 'Available for work' : 'Not available for work'}
                    </span>
                  </div>
                  
                  {data.response_time && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span>Response time: {data.response_time}</span>
                    </div>
                  )}
                  
                  {data.working_hours && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span>Working hours: {data.working_hours}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={auth.user} header="Edit Contact Information">
      <Head title="Edit Contact Information" />

      <div className="py-0">
        <div className="">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Edit Contact Information
                </h1>
                <p className="text-muted-foreground">
                  Manage your contact information and social media links
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePreview} variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={() => setPreviewMode(true)} variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Live Preview
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Main contact details and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Contact Me"
                    required
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={data.subtitle}
                    onChange={(e) => setData('subtitle', e.target.value)}
                    placeholder="Get in touch with me"
                  />
                  {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Tell people how to get in touch with you..."
                    rows={4}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  How people can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={data.location}
                    onChange={(e) => setData('location', e.target.value)}
                    placeholder="City, Country"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={data.website}
                    onChange={(e) => setData('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Social Media
                </CardTitle>
                <CardDescription>
                  Your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={data.linkedin_url}
                      onChange={(e) => setData('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    {errors.linkedin_url && <p className="text-red-500 text-sm mt-1">{errors.linkedin_url}</p>}
                  </div>

                  <div>
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={data.github_url}
                      onChange={(e) => setData('github_url', e.target.value)}
                      placeholder="https://github.com/yourusername"
                    />
                    {errors.github_url && <p className="text-red-500 text-sm mt-1">{errors.github_url}</p>}
                  </div>

                  <div>
                    <Label htmlFor="twitter_url">Twitter URL</Label>
                    <Input
                      id="twitter_url"
                      value={data.twitter_url}
                      onChange={(e) => setData('twitter_url', e.target.value)}
                      placeholder="https://twitter.com/yourusername"
                    />
                    {errors.twitter_url && <p className="text-red-500 text-sm mt-1">{errors.twitter_url}</p>}
                  </div>

                  <div>
                    <Label htmlFor="instagram_url">Instagram URL</Label>
                    <Input
                      id="instagram_url"
                      value={data.instagram_url}
                      onChange={(e) => setData('instagram_url', e.target.value)}
                      placeholder="https://instagram.com/yourusername"
                    />
                    {errors.instagram_url && <p className="text-red-500 text-sm mt-1">{errors.instagram_url}</p>}
                  </div>

                  <div>
                    <Label htmlFor="facebook_url">Facebook URL</Label>
                    <Input
                      id="facebook_url"
                      value={data.facebook_url}
                      onChange={(e) => setData('facebook_url', e.target.value)}
                      placeholder="https://facebook.com/yourprofile"
                    />
                    {errors.facebook_url && <p className="text-red-500 text-sm mt-1">{errors.facebook_url}</p>}
                  </div>

                  <div>
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      value={data.whatsapp_number}
                      onChange={(e) => setData('whatsapp_number', e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.whatsapp_number && <p className="text-red-500 text-sm mt-1">{errors.whatsapp_number}</p>}
                  </div>

                  <div>
                    <Label htmlFor="telegram_username">Telegram Username</Label>
                    <Input
                      id="telegram_username"
                      value={data.telegram_username}
                      onChange={(e) => setData('telegram_username', e.target.value)}
                      placeholder="yourusername"
                    />
                    {errors.telegram_username && <p className="text-red-500 text-sm mt-1">{errors.telegram_username}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Availability Settings
                </CardTitle>
                <CardDescription>
                  Your work availability and response times
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="available_for_work">Available for Work</Label>
                    <p className="text-sm text-muted-foreground">
                      Show visitors that you're available for new opportunities
                    </p>
                  </div>
                  <Switch
                    id="available_for_work"
                    checked={data.available_for_work}
                    onCheckedChange={(checked) => setData('available_for_work', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="response_time">Response Time</Label>
                  <Input
                    id="response_time"
                    value={data.response_time}
                    onChange={(e) => setData('response_time', e.target.value)}
                    placeholder="Usually within 24 hours"
                  />
                  {errors.response_time && <p className="text-red-500 text-sm mt-1">{errors.response_time}</p>}
                </div>

                <div>
                  <Label htmlFor="working_hours">Working Hours</Label>
                  <Input
                    id="working_hours"
                    value={data.working_hours}
                    onChange={(e) => setData('working_hours', e.target.value)}
                    placeholder="Monday - Friday, 9AM - 5PM"
                  />
                  {errors.working_hours && <p className="text-red-500 text-sm mt-1">{errors.working_hours}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_active">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this contact page visible to visitors
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Meta tags for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={data.meta_title}
                    onChange={(e) => setData('meta_title', e.target.value)}
                    placeholder="Contact Me - Your Name"
                  />
                  {errors.meta_title && <p className="text-red-500 text-sm mt-1">{errors.meta_title}</p>}
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={data.meta_description}
                    onChange={(e) => setData('meta_description', e.target.value)}
                    placeholder="Get in touch with me for collaborations, projects, or just to say hello!"
                    rows={3}
                  />
                  {errors.meta_description && <p className="text-red-500 text-sm mt-1">{errors.meta_description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="w-4 h-4 mr-2" />
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
