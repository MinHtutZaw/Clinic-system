import { FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
    title?: string;
    placeholder?: string;
    searchValue?: string;
    clearRoute: string;
    onSearch: (e: FormEvent<HTMLFormElement>) => void;
}

export default function SearchBar({
    title,
    placeholder = 'Search...',
    searchValue,
    clearRoute,
    onSearch,
}: SearchBarProps) {
    return (
        <>
            {title && (
                <div className="m-4 flex flex-col items-center justify-between gap-4 p-4 md:flex-row">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h1>
                </div>
            )}

            <div className="m-4 flex justify-center">
                <form
                    onSubmit={onSearch}
                    className="flex w-full max-w-3xl space-x-3"
                >
                    <Input
                        type="text"
                        name="search"
                        placeholder={placeholder}
                        defaultValue={searchValue ?? ''}
                        className="flex-grow"
                    />

                    <Button type="submit">Search</Button>

                    {searchValue && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(clearRoute)}
                        >
                            Clear
                        </Button>
                    )}
                </form>
            </div>
        </>
    );
}
