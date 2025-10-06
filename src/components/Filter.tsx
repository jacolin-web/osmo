import { useState, useRef, useEffect } from 'react';
import '../styles/Filter.css';

type FilterProps<T> = {
    data: T[];
    filterBy: keyof T;
    onChange: (filteredData: T[]) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Filter<T extends Record<string, any>>({
    data,
    filterBy,
    onChange,
}: FilterProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get unique categories from the data
    const categories = Array.from(
        new Set(data.map(item => String(item[filterBy])))
    ).sort();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleCategory = (category: string) => {
        const newSelected = new Set(selectedCategories);
        
        if (newSelected.has(category)) {
            newSelected.delete(category);
        } else {
            newSelected.add(category);
        }
        
        setSelectedCategories(newSelected);

        // Filter data based on selected categories
        if (newSelected.size === 0) {
            onChange(data);
        } else {
            const filtered = data.filter(item =>
                newSelected.has(String(item[filterBy]))
            );
            onChange(filtered);
        }
    };

    const clearFilters = () => {
        setSelectedCategories(new Set());
        onChange(data);
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button 
                className='bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2'
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>🔍</span>
                <span>Filter by {String(filterBy)}</span>
                {selectedCategories.size > 0 && (
                    <span className='bg-zinc-950 text-white ml-1'>
                        {selectedCategories.size}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className='filter-menu border border-gray-300 rounded-md mt-2 bg-zinc-300'>
                    <div className='filter-header flex justify-between items-center p-2 border-b border-gray-300'>
                        <button
                            onClick={clearFilters}
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded text-sm">
                            Clear all
                        </button>
                    </div>
                    
                    {categories.map(category => (
                        <label
                            key={category}
                            className='filter-option'
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.has(category)}
                                onChange={() => toggleCategory(category)}
                                className='mr-2'
                            />
                            <span>{category}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Filter;