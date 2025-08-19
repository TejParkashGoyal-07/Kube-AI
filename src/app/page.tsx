import { buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spotlight } from '@/components/ui/spotlight';
import { siteConfig } from '@/config/site';
import { studioConfig } from '@/config/studio';
import { cn } from '@/lib/utils';
import { SidebarNavItem } from '@/types/studio';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const features = studioConfig.sidebarNav
    .filter(item => item.title === 'Create' || item.title === 'Analyze')
    .map(item => item.items)
    .flat();

// Completely new UI for feature cards
const FeatureCard = ({ title, href, icon, description }: SidebarNavItem) => (
    <Link href={href ?? siteConfig.paths.studio.home} passHref>
        <Card className="group flex h-full flex-col justify-between bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 shadow-lg transition-all hover:shadow-black/10 hover:bg-white p-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-800 mb-4 group-hover:bg-black/90 group-hover:text-white transition-all">
                {icon}
            </div>
            <CardHeader className="p-0">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-neutral-950 group-hover:text-black transition">
                    {title}
                    <ChevronRight className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition" />
                </CardTitle>
                <CardDescription className="!mt-2 text-neutral-600 group-hover:text-neutral-900">
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    </Link>
);

function LandingFooter() {
    return (
        <footer className="w-full bg-neutral-900/90 text-gray-200 border-t border-black/10 pt-10 pb-8">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="text-sm text-center md:text-left opacity-80">
                    <span>
                        Built by{' '}
                        <Link
                            href={siteConfig.links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-neutral-50 font-semibold"
                        >
                            Tej Parkash Goyal
                        </Link>
                        . All rights reserved.
                    </span>
                </div>
                <div className="text-sm flex gap-3 items-center justify-center">
                    <Link
                        href={siteConfig.links.statusPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-neutral-50"
                    >
                        Status Page
                    </Link>
                    <span className="opacity-40">|</span>
                    <Link
                        href={siteConfig.paths.legal.privacy}
                        className="underline hover:text-neutral-50"
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}

// The main landing page: minimal, clean, glassmorphic, different layout!
const LandingPage = async () => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative isolate min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 sm:py-28 bg-neutral-100">
                <Spotlight
                    className="pointer-events-none absolute inset-0 z-0"
                    fill="#f2f6fc"
                />
                <div className="relative z-10 max-w-3xl w-full mx-auto flex flex-col items-center">
                    <h1 className="mb-4 text-4xl [text-wrap:balance] sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 drop-shadow-sm">
                        Your creative studio in <span className="block font-extrabold text-black/80">one workspace</span>
                    </h1>
                    <p className="mb-8 text-neutral-700 text-center max-w-xl text-lg">
                        {siteConfig.description}
                    </p>
                    <Link
                        href={siteConfig.paths.studio.home}
                        className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'rounded-md bg-black hover:bg-neutral-800 text-white px-8 py-3 text-base font-semibold shadow-lg border-none transition'
                        )}
                    >
                        Start Creating (10 credits/day)
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-2">
                            Discover What You Can Do
                        </h2>
                        <p className="max-w-md mx-auto text-neutral-600">
                            Smart tools for makers and analysts.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {features.map(feature => (
                            <FeatureCard key={feature.title} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            <LandingFooter />
        </>
    );
};

export default LandingPage;
