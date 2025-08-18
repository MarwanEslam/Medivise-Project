import { ChevronDown } from 'lucide-react';
export default function CustomSelect({ children }) {
  return (
    <div className={`relative`}>
      {children}
      <ChevronDown className="absolute pointer-events-none left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
    </div>
  );
}
