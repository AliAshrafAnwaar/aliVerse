import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import ProfileIntroduction from '@/Components/Portfolio/ProfileIntroduction';
import SkillsSection from '@/Components/Portfolio/SkillsSection';
import ExperienceSection from '@/Components/Portfolio/ExperienceSection';
import ModernProjectsSection from '@/Components/Portfolio/ModernProjectsSection';
import EducationSection from '@/Components/Portfolio/EducationSection';
import TestimonialsSection from '@/Components/Portfolio/TestimonialsSection';

export default function PortfolioShow({ 
    portfolioOwner,
    skills, 
    groupedSkills, 
    featuredSkills, 
    experiences, 
    currentExperience, 
    pastExperiences, 
    educations, 
    testimonials, 
    featuredTestimonials, 
    projects,
    featuredProjects,
    stats 
}) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout user={user} header={t('navigation.portfolio', 'Portfolio')}>
            <Head title={t('navigation.portfolio', 'Portfolio')} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Profile Introduction */}
                    <ProfileIntroduction portfolioOwner={portfolioOwner} stats={stats} />

                    {/* Skills Section */}
                    {groupedSkills && Object.keys(groupedSkills).length > 0 && (
                        <SkillsSection groupedSkills={groupedSkills} featuredSkills={featuredSkills} />
                    )}

                    {/* Experience Section */}
                    {experiences && experiences.length > 0 && (
                        <ExperienceSection experiences={experiences} currentExperience={currentExperience} />
                    )}

                    {/* Projects Section */}
                    {projects && projects.length > 0 && (
                        <ModernProjectsSection projects={projects} featuredProjects={featuredProjects} />
                    )}

                    {/* Education Section */}
                    {educations && educations.length > 0 && (
                        <EducationSection educations={educations} />
                    )}

                    {/* Testimonials Section */}
                    {testimonials && testimonials.length > 0 && (
                        <TestimonialsSection testimonials={testimonials} featuredTestimonials={featuredTestimonials} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
