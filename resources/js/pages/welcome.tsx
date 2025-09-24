import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                {/* Navbar */}
                <header className="w-full border-b border-gray-200 dark:border-gray-700">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            {/* Replace with actual logo */}
                            <div className="h-8 w-8 rounded bg-purple-600 flex items-center justify-center text-white font-bold">
                                L
                            </div>
                            <span className="text-lg font-semibold text-purple-700 dark:text-purple-400">
                                Lavender Clinic
                            </span>
                        </div>

                        {/* Middle Nav Links */}
                        <div className="hidden space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300 md:flex">
                            {/* <Link href="#" className="hover:text-purple-600">
                                Find a Doctor
                            </Link> */}
                            <Link href="#" className="hover:text-purple-600">
                                Locations & Directions
                            </Link>
                            <Link href="#" className="hover:text-purple-600">
                                Patients & Visitors
                            </Link>
                            {/* <Link href="#" className="hover:text-purple-600">
                                Health Library
                            </Link> */}
                           
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="mx-auto flex max-w-7xl flex-col-reverse items-center px-6 py-12 lg:flex-row lg:justify-between lg:py-20">
                    {/* Text Section */}
                    <div className="max-w-xl text-center lg:text-left">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 lg:text-5xl">
                            We&apos;re here when you need us <br />
                            for every care in the world
                        </h1>
                        <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                            Whenever you need support, we&apos;re here, ready to
                            provide care for all your concerns. Our commitment
                            extends to every aspect of your well-being, ensuring
                            you&apos;re never alone in facing life&apos;s
                            challenges.
                        </p>
                        <div className="mt-6">
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
                            >
                                {auth.user ? 'Go to Dashboard' : 'Get Started'}
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="mb-8 w-full max-w-md lg:mb-0 lg:max-w-lg">
                        <img
                            src="/img/hero.jpg" 
                            alt="Doctor with patient"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </main>
            </div>
        </>
    );
}
