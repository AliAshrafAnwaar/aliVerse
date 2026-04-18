<?php

namespace Database\Seeders;

use App\Models\Education;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProfileSeeder extends Seeder
{
    /**
     * Seed Ali Ashraf's portfolio profile data.
     */
    public function run(): void
    {
        // Update Ali's user profile fields
        $ali = User::where('email', 'aliashrafanwaar@gmail.com')->first();

        if (!$ali) {
            $this->command->error('Admin user not found. Run AdminUserSeeder first.');
            return;
        }

        $ali->update([
            'name' => 'Ali Ashraf',
            'bio' => 'Passionate full-stack developer from Egypt with expertise in Flutter, Laravel, React, and AI/ML. I build mobile and web applications that make a difference — from high-concurrency checkout systems to intelligent mobile apps.',
            'position' => 'Full-Stack Developer',
            'location' => 'Egypt',
            'website' => 'https://github.com/AliAshrafAnwaar',
            'github_url' => 'https://github.com/AliAshrafAnwaar',
            'linkedin_url' => 'https://linkedin.com/in/aliashraf899',
            'twitter_url' => null,
        ]);

        $this->seedSkills();
        $this->seedExperiences();
        $this->seedEducation();
        $this->seedProjects($ali);
        $this->seedTestimonials();

        $this->command->info('Profile data seeded successfully!');
    }

    private function seedSkills(): void
    {
        if (Skill::count() > 0) {
            return;
        }

        $skills = [
            // Frontend
            ['name' => 'Flutter', 'category' => 'frontend', 'proficiency_level' => 9, 'icon' => 'flutter', 'is_featured' => true, 'sort_order' => 1],
            ['name' => 'Dart', 'category' => 'frontend', 'proficiency_level' => 9, 'icon' => 'dart', 'is_featured' => true, 'sort_order' => 2],
            ['name' => 'React', 'category' => 'frontend', 'proficiency_level' => 7, 'icon' => 'react', 'is_featured' => true, 'sort_order' => 3],
            ['name' => 'JavaScript', 'category' => 'frontend', 'proficiency_level' => 7, 'icon' => 'javascript', 'is_featured' => false, 'sort_order' => 4],
            ['name' => 'Tailwind CSS', 'category' => 'frontend', 'proficiency_level' => 7, 'icon' => 'tailwind', 'is_featured' => false, 'sort_order' => 5],
            ['name' => 'Inertia.js', 'category' => 'frontend', 'proficiency_level' => 7, 'icon' => 'inertia', 'is_featured' => false, 'sort_order' => 6],

            // Backend
            ['name' => 'Laravel', 'category' => 'backend', 'proficiency_level' => 8, 'icon' => 'laravel', 'is_featured' => true, 'sort_order' => 1],
            ['name' => 'PHP', 'category' => 'backend', 'proficiency_level' => 8, 'icon' => 'php', 'is_featured' => true, 'sort_order' => 2],
            ['name' => 'Node.js', 'category' => 'backend', 'proficiency_level' => 6, 'icon' => 'nodejs', 'is_featured' => false, 'sort_order' => 3],
            ['name' => 'Python', 'category' => 'backend', 'proficiency_level' => 7, 'icon' => 'python', 'is_featured' => true, 'sort_order' => 4],
            ['name' => 'Django', 'category' => 'backend', 'proficiency_level' => 5, 'icon' => 'django', 'is_featured' => false, 'sort_order' => 5],
            ['name' => 'C/C++', 'category' => 'backend', 'proficiency_level' => 5, 'icon' => 'cplusplus', 'is_featured' => false, 'sort_order' => 6],

            // Databases & Infrastructure
            ['name' => 'Firebase', 'category' => 'tools', 'proficiency_level' => 8, 'icon' => 'firebase', 'is_featured' => true, 'sort_order' => 1],
            ['name' => 'MySQL', 'category' => 'tools', 'proficiency_level' => 7, 'icon' => 'mysql', 'is_featured' => false, 'sort_order' => 2],
            ['name' => 'PostgreSQL', 'category' => 'tools', 'proficiency_level' => 7, 'icon' => 'postgresql', 'is_featured' => false, 'sort_order' => 3],
            ['name' => 'Redis', 'category' => 'tools', 'proficiency_level' => 6, 'icon' => 'redis', 'is_featured' => false, 'sort_order' => 4],
            ['name' => 'Git', 'category' => 'tools', 'proficiency_level' => 8, 'icon' => 'git', 'is_featured' => false, 'sort_order' => 5],
            ['name' => 'Linux', 'category' => 'tools', 'proficiency_level' => 7, 'icon' => 'linux', 'is_featured' => false, 'sort_order' => 6],
            ['name' => 'Docker', 'category' => 'tools', 'proficiency_level' => 5, 'icon' => 'docker', 'is_featured' => false, 'sort_order' => 7],

            // AI & ML
            ['name' => 'TensorFlow', 'category' => 'soft_skills', 'proficiency_level' => 6, 'icon' => 'tensorflow', 'is_featured' => false, 'sort_order' => 1],
            ['name' => 'Machine Learning', 'category' => 'soft_skills', 'proficiency_level' => 6, 'icon' => 'brain', 'is_featured' => false, 'sort_order' => 2],
            ['name' => 'State Management', 'category' => 'soft_skills', 'proficiency_level' => 9, 'icon' => 'layers', 'is_featured' => true, 'sort_order' => 3],
            ['name' => 'System Design', 'category' => 'soft_skills', 'proficiency_level' => 8, 'icon' => 'layout', 'is_featured' => true, 'sort_order' => 4],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }

        $this->command->info('Skills: ' . Skill::count());
    }

    private function seedExperiences(): void
    {
        if (Experience::count() > 0) {
            return;
        }

        $experiences = [
            [
                'company' => 'Freelance',
                'position' => 'Full-Stack Developer',
                'description' => 'Building web and mobile applications for clients using Flutter, Laravel, and React. Delivering end-to-end solutions from system design to deployment, including e-commerce platforms, portfolio sites, and data-driven dashboards.',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'is_current' => true,
                'location' => 'Egypt (Remote)',
                'company_url' => 'https://github.com/AliAshrafAnwaar',
                'sort_order' => 1,
            ],
            [
                'company' => 'Personal Projects',
                'position' => 'Flutter & Mobile Developer',
                'description' => 'Developed multiple Flutter mobile applications including Job Finder App with Firebase integration, Al-Muraqeb educational platform with Riverpod state management, and Recipe App. Focused on clean architecture, BLoC/Cubit patterns, and responsive UI design.',
                'start_date' => '2023-01-01',
                'end_date' => '2023-12-31',
                'is_current' => false,
                'location' => 'Egypt',
                'company_url' => null,
                'sort_order' => 2,
            ],
            [
                'company' => 'Academic & Self-Learning',
                'position' => 'Software Engineering Student',
                'description' => 'Studied computer science fundamentals, data structures, algorithms, and software engineering principles. Built projects in C/C++, Python, and explored machine learning with TensorFlow and YOLO v5 for object detection.',
                'start_date' => '2021-09-01',
                'end_date' => '2022-12-31',
                'is_current' => false,
                'location' => 'Egypt',
                'company_url' => null,
                'sort_order' => 3,
            ],
        ];

        foreach ($experiences as $experience) {
            Experience::create($experience);
        }

        $this->command->info('Experiences: ' . Experience::count());
    }

    private function seedEducation(): void
    {
        if (Education::count() > 0) {
            return;
        }

        $educations = [
            [
                'institution' => 'University',
                'degree' => "Bachelor's Degree",
                'field_of_study' => 'Computer Science / Software Engineering',
                'description' => 'Studied software engineering, data structures, algorithms, databases, and AI/ML. Built multiple projects spanning web development, mobile development, and machine learning.',
                'start_date' => '2021-09-01',
                'end_date' => null,
                'grade' => null,
                'location' => 'Egypt',
                'sort_order' => 1,
            ],
            [
                'institution' => 'Online Learning Platforms',
                'degree' => 'Self-Taught',
                'field_of_study' => 'Flutter, Laravel, React & AI',
                'description' => 'Completed extensive coursework in Flutter development, Laravel backend engineering, React frontend development, and machine learning through platforms like Udemy, Coursera, and YouTube tutorials.',
                'start_date' => '2022-01-01',
                'end_date' => null,
                'grade' => null,
                'location' => 'Online',
                'sort_order' => 2,
            ],
        ];

        foreach ($educations as $education) {
            Education::create($education);
        }

        $this->command->info('Education: ' . Education::count());
    }

    private function seedProjects(User $ali): void
    {
        if (Project::count() > 0) {
            return;
        }

        $projects = [
            [
                'user_id' => $ali->id,
                'title' => 'Flash Sale Checkout System',
                'slug' => 'flash-sale-checkout-system',
                'description' => 'High-concurrency e-commerce checkout system built with Laravel, featuring pessimistic locking, Redis distributed locks, deadlock retry logic, and idempotent webhook processing for payment integration.',
                'content' => '<h2>Overview</h2><p>A production-grade flash sale checkout system designed to handle thousands of concurrent users competing for limited inventory. Built with Laravel and featuring multi-layer concurrency control.</p><h3>Key Features</h3><ul><li>Pessimistic database locking with deadlock retry</li><li>Redis distributed locks for horizontal scaling</li><li>Idempotent webhook processing for payment gateways</li><li>Cache invalidation with graceful fallbacks</li><li>Comprehensive concurrency test suite</li></ul>',
                'demo_url' => null,
                'github_url' => 'https://github.com/AliAshrafAnwaar/flash-sale-checkout',
                'technologies' => ['Laravel', 'PHP', 'Redis', 'MySQL', 'Queue Workers'],
                'featured' => true,
                'status' => 'published',
                'sort_order' => 1,
            ],
            [
                'user_id' => $ali->id,
                'title' => 'aliVerse - Personal Portfolio',
                'slug' => 'aliverse-personal-portfolio',
                'description' => 'Full-stack personal portfolio and blog platform built with Laravel 12, React, Inertia.js, and Tailwind CSS. Features admin dashboard, blog system, project showcase, and contact management.',
                'content' => '<h2>Overview</h2><p>A comprehensive personal portfolio platform with a modern admin dashboard. Built using the VILT stack (Vite, Inertia.js, Laravel, Tailwind).</p><h3>Key Features</h3><ul><li>Admin dashboard with full CRUD for projects, blog posts, skills, and experience</li><li>Blog system with categories, tags, and comments</li><li>Dark mode and i18n support</li><li>Responsive design with Tailwind CSS</li></ul>',
                'demo_url' => null,
                'github_url' => 'https://github.com/AliAshrafAnwaar/aliVerse',
                'technologies' => ['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'PostgreSQL'],
                'featured' => true,
                'status' => 'published',
                'sort_order' => 2,
            ],
            [
                'user_id' => $ali->id,
                'title' => 'Job Finder App',
                'slug' => 'job-finder-app',
                'description' => 'Mobile job-seeking application built with Flutter, featuring Firebase authentication (Email, Google, Facebook), job listing browsing, and profile management with BLoC/Cubit state management.',
                'content' => '<h2>Overview</h2><p>A feature-rich Flutter mobile application for streamlining job searching and applications. Integrated with Firebase for real-time data and authentication.</p><h3>Key Features</h3><ul><li>Multi-provider authentication (Email, Google, Facebook)</li><li>Job listing with search and filters</li><li>User profile management</li><li>BLoC/Cubit state management pattern</li><li>Feature-based project architecture</li></ul>',
                'demo_url' => null,
                'github_url' => 'https://github.com/AliAshrafAnwaar/Job_Finder_App',
                'technologies' => ['Flutter', 'Dart', 'Firebase', 'BLoC', 'Google APIs'],
                'featured' => true,
                'status' => 'published',
                'sort_order' => 3,
            ],
            [
                'user_id' => $ali->id,
                'title' => 'Al-Muraqeb (Almuraqeb)',
                'slug' => 'al-muraqeb-almuraqeb',
                'description' => 'Educational mobile platform built with Flutter and Riverpod (with code generation). Features user authentication, progress tracking, and subscription management.',
                'content' => '<h2>Overview</h2><p>A mobile service platform for education and progress tracking. Built with modern Flutter architecture using Riverpod for state management with code generation annotations.</p><h3>Key Features</h3><ul><li>Riverpod state management with @riverpod code generation</li><li>User progress tracking</li><li>Subscription-based content access</li><li>Clean architecture with proper caching</li></ul>',
                'demo_url' => null,
                'github_url' => 'https://github.com/AliAshrafAnwaar/almorakeb',
                'technologies' => ['Flutter', 'Dart', 'Riverpod', 'Firebase'],
                'featured' => false,
                'status' => 'published',
                'sort_order' => 4,
            ],
            [
                'user_id' => $ali->id,
                'title' => 'Course Exam Platform',
                'slug' => 'course-exam-platform',
                'description' => 'Full-stack exam management system with React frontend and Node.js/Express backend. Features course management, exam creation, and student grading with MongoDB storage.',
                'content' => '<h2>Overview</h2><p>A comprehensive platform for managing courses and exams. Instructors can create courses and exams, while students can take exams and view their grades.</p><h3>Key Features</h3><ul><li>Role-based access (Instructor/Student)</li><li>Course and exam CRUD operations</li><li>Real-time grading</li><li>Winston logging and proper error handling</li></ul>',
                'demo_url' => null,
                'github_url' => 'https://github.com/AliAshrafAnwaar/course-exam-project',
                'technologies' => ['React', 'Node.js', 'Express', 'MongoDB'],
                'featured' => false,
                'status' => 'published',
                'sort_order' => 5,
            ],
            [
                'user_id' => $ali->id,
                'title' => 'Upwork Job Scraper',
                'slug' => 'upwork-job-scraper',
                'description' => 'Automated Upwork job scraper built with Node.js and Puppeteer. Monitors job postings matching specific criteria and sends notifications via Telegram bot integration.',
                'content' => '<h2>Overview</h2><p>An automation tool that scrapes Upwork for relevant job postings and delivers notifications through Telegram. Designed for freelancers who want to be first to respond to new opportunities.</p><h3>Key Features</h3><ul><li>Puppeteer-based web scraping</li><li>Telegram bot notifications</li><li>Configurable job filters</li><li>Scheduled monitoring</li></ul>',
                'demo_url' => null,
                'github_url' => 'https://github.com/AliAshrafAnwaar/upwork-scraper',
                'technologies' => ['Node.js', 'Puppeteer', 'Telegram API'],
                'featured' => false,
                'status' => 'published',
                'sort_order' => 6,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }

        $this->command->info('Projects: ' . Project::count());
    }

    private function seedTestimonials(): void
    {
        if (Testimonial::count() > 0) {
            return;
        }

        $testimonials = [
            [
                'client_name' => 'Ahmed Hassan',
                'client_position' => 'Project Manager',
                'client_company' => 'Tech Startup',
                'content' => 'Ali delivered an exceptional Flutter application with clean architecture and excellent state management. His attention to detail and ability to handle complex technical requirements was impressive.',
                'rating' => 5.0,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'client_name' => 'Sarah Mohamed',
                'client_position' => 'CEO',
                'client_company' => 'Digital Agency',
                'content' => 'Working with Ali on our Laravel platform was a great experience. He built a robust backend with proper concurrency handling and clean API design. Highly recommended for backend development.',
                'rating' => 5.0,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'client_name' => 'Omar Khaled',
                'client_position' => 'Lead Developer',
                'client_company' => 'Software House',
                'content' => 'Ali has a rare combination of frontend and backend skills. He understands distributed systems concepts and applies them practically. His flash sale checkout system demonstrated senior-level engineering.',
                'rating' => 4.5,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }

        $this->command->info('Testimonials: ' . Testimonial::count());
    }
}
