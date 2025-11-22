import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Mail, Eye } from 'lucide-react';

export default function CTASection() {
    const { t } = useTranslation();

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                    {t('home.cta_title')}
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                    {t('home.cta_description')}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/contact">
                            <Mail className="w-5 h-5 mr-2" />
                            {t('home.start_conversation')}
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
                        <Link href="/projects">
                            <Eye className="w-5 h-5 mr-2" />
                            {t('home.view_work')}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
