'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';

import { signIn } from './actions';
import { SignInFormType, signInFormSchema } from './schemas';

export const SignInForm = () => {
    const form = useForm<SignInFormType>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const { toast } = useToast();

    type FieldName = keyof SignInFormType;

    const onSubmit: SubmitHandler<SignInFormType> = async (data) => {
        const result = await signIn(data);
        if (!result) return;

        if (result.validationErrors) {
    for (const [path, value] of Object.entries(result.validationErrors)) {
        if (Array.isArray(value)) {
            form.setError(path as FieldName, {
                type: path,
                message: value.join(', '),
            });
        }
    }
}

        if (result.serverError) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.serverError,
            });
            form.reset();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-50 to-teal-100">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full max-w-md p-8 bg-white rounded-xl shadow-md space-y-6"
                    noValidate
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold text-gray-800">Welcome Back</h2>
                        <p className="text-sm text-gray-600 mt-2">Sign in to continue</p>
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter email"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-600" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Enter password"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-600" />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value || false}
                                            onCheckedChange={field.onChange}
                                            disabled={form.formState.isSubmitting}
                                            className="h-4 w-4 border-gray-300 rounded focus:ring-green-500"
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm text-gray-600 cursor-pointer">Stay signed in</FormLabel>
                                </FormItem>
                            )}
                        />
                        <Link
                            href={siteConfig.paths.auth.passwordReset}
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full py-2.5 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {form.formState.isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </Button>

                    <p className="text-center text-xs text-gray-500">
                        By signing in, you agree to our{' '}
                        <Link href={siteConfig.paths.legal.terms} className="text-green-600 hover:text-green-800">
                            Terms
                        </Link>{' '}
                        and{' '}
                        <Link href={siteConfig.paths.legal.privacy} className="text-green-600 hover:text-green-800">
                            Privacy Policy
                        </Link>.
                    </p>

                    <Separator className="bg-gray-200" />
                </form>
            </Form>
        </div>
    );
};