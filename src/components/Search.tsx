import { type ChangeEvent } from 'react';

type SearchProps = {
    value: string;
    onChange: (query: string) => void;
};

function Search({ value, onChange }: SearchProps) {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="Search..."
            aria-label='Search fragrances'
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grey-500"
        />
    );
}

export default Search;