import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { siteConfig } from '@/config/site';
import { umami } from '@/lib/analytics';
import { getUserSession } from '@/models/user';
import { Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { deleteAccount } from './actions';

const ProfilePage = async () => {
    const { user } = await getUserSession();

    if (!user) {
        return redirect(siteConfig.paths.auth.signIn);
    }

    if (!user.emailVerified) {
        return redirect(siteConfig.paths.auth.emailVerification);
    }

    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-50 to-white px-4 py-12">
            <Card className="max-w-lg w-full rounded-3xl border border-gray-300 bg-white shadow-lg transition-transform hover:scale-[1.02] focus-within:scale-[1.02]">
                <CardHeader className="border-b border-gray-200 px-8 py-6">
                    <CardTitle className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
                        Profile Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-8 py-8">
                    <div className="mb-6">
                        <Label
                            htmlFor="id"
                            className="block mb-1 text-xs font-semibold uppercase text-gray-600 tracking-wide"
                        >
                            User ID
                        </Label>
                        <Input
                            id="id"
                            defaultValue={user.id}
                            readOnly
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 shadow-inner focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t border-gray-200 px-8 py-6 md:flex-row md:justify-between">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full rounded-lg bg-red-600 py-2 font-semibold text-white shadow-md transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 md:w-auto"
                            >
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-2xl bg-white p-8 shadow-xl">
                            <DialogHeader>
                                <DialogTitle className="mb-3 text-xl font-bold text-red-700">
                                    Confirm Account Deletion
                                </DialogTitle>
                                <DialogDescription className="text-gray-700 leading-relaxed">
                                    This action is <strong className="text-red-600">irreversible</strong>. All your data will be permanently deleted.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-8 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary md:mr-4"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <form action={deleteAccount}>
                                    <Button
                                        variant="destructive"
                                        data-umami-event={umami.deleteAccount.name}
                                        className="flex w-full items-center justify-center rounded-lg bg-red-700 px-4 py-2 font-bold text-white shadow-lg transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 md:w-auto"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Account
                                    </Button>
                                </form>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        asChild
                        variant="secondary"
                        className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary md:w-auto"
                    >
                        <Link href={siteConfig.paths.auth.passwordReset}>
                            Change Password
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
};

export default ProfilePage;
