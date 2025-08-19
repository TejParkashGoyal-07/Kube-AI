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

import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
    title: 'Sign In',
};

const SignInPage = async () => {
    const { user } = await getUserSession();

    if (user) {
        if (!user.emailVerified) {
            return redirect(siteConfig.paths.auth.emailVerification);
        }
        return redirect(siteConfig.paths.studio.home);
    }

    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-100 py-12 px-2">
            <Card className="w-full max-w-md shadow-2xl bg-white/50 backdrop-blur border border-neutral-200 rounded-2xl">
                <CardHeader className="pb-0 pt-7 flex justify-center">
                    <CardTitle className="text-3xl font-extrabold text-neutral-900 text-center tracking-tight">
                        Welcome Back
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 pt-2">
                    <div className="flex flex-col gap-3">
                        <Link
                            href={siteConfig.paths.auth.googleOAuth}
                            className={buttonVariants({
                                variant: 'secondary',
                                className:
                                    'w-full flex items-center justify-center gap-2 text-black bg-neutral-50 hover:bg-neutral-200 border border-neutral-300 rounded-lg font-medium shadow-none',
                            })}
                            prefetch={false}
                        >
                            <Icons.google className="h-5 w-5" />
                            Continue with Google
                        </Link>
                        <Link
                            href={siteConfig.paths.auth.githubOAuth}
                            className={buttonVariants({
                                variant: 'secondary',
                                className:
                                    'w-full flex items-center justify-center gap-2 text-black bg-neutral-50 hover:bg-neutral-200 border border-neutral-300 rounded-lg font-medium shadow-none',
                            })}
                            prefetch={false}
                        >
                            <Icons.gitHub className="h-5 w-5" />
                            Continue with GitHub
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                        <Separator className="flex-1 bg-neutral-300" />
                        <span className="px-2 text-xs uppercase tracking-widest text-neutral-400">
                            or
                        </span>
                        <Separator className="flex-1 bg-neutral-300" />
                    </div>

                    <div>
                        <SignInForm />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pb-6 pt-0">
                    <p className="text-center text-sm text-neutral-600">
                        New to Graphite?{' '}
                        <Link
                            href={siteConfig.paths.auth.signUp}
                            className="font-medium underline underline-offset-2 hover:text-black"
                        >
                            Create an account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
};

export default SignInPage;
