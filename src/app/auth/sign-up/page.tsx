import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/config/site';
import { getUserSession } from '@/models/user';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = {
    title: 'Sign Up',
};

const SignUpPage = async () => {
    const { user } = await getUserSession();

    if (user) {
        if (!user.emailVerified) {
            return redirect(siteConfig.paths.auth.emailVerification);
        }
        return redirect(siteConfig.paths.studio.home);
    }

    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-100 py-12 px-4">
            <Card className="w-full max-w-md shadow-2xl bg-white/50 backdrop-blur-md border border-neutral-200 rounded-3xl">
                <CardHeader className="pt-8 pb-2 flex justify-center">
                    <CardTitle className="text-3xl font-extrabold text-neutral-900 text-center tracking-tight">
                        Create an Account
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 px-6 pt-4 pb-8">
                    <div className="flex flex-col gap-4">
                        <Link
                            href={siteConfig.paths.auth.googleOAuth}
                            className={buttonVariants({
                                variant: 'secondary',
                                className:
                                    'w-full flex items-center justify-center gap-3 text-black bg-neutral-50 hover:bg-neutral-200 border border-neutral-300 rounded-lg font-semibold shadow-none',
                            })}
                            prefetch={false}
                        >
                            <Icons.google className="h-5 w-5" />
                            Sign up with Google
                        </Link>
                        <Link
                            href={siteConfig.paths.auth.githubOAuth}
                            className={buttonVariants({
                                variant: 'secondary',
                                className:
                                    'w-full flex items-center justify-center gap-3 text-black bg-neutral-50 hover:bg-neutral-200 border border-neutral-300 rounded-lg font-semibold shadow-none',
                            })}
                            prefetch={false}
                        >
                            <Icons.gitHub className="h-5 w-5" />
                            Sign up with GitHub
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 py-4">
                        <Separator className="flex-1 bg-neutral-300" />
                        <span className="px-2 text-xs uppercase tracking-widest text-neutral-400">
                            or
                        </span>
                        <Separator className="flex-1 bg-neutral-300" />
                    </div>

                    <SignUpForm />
                </CardContent>
                <CardFooter className="py-6 px-6">
                    <p className="text-center text-sm text-neutral-600">
                        Already have an account?{' '}
                        <Link
                            href={siteConfig.paths.auth.signIn}
                            className="font-medium underline underline-offset-2 hover:text-black"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
};

export default SignUpPage;
