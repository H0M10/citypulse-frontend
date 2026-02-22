import { Loader2 } from 'lucide-react';

export default function Loader({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <Loader2 className={`${sizes[size]} text-primary-400 animate-spin`} />
      {text && <p className="text-sm text-dark-400">{text}</p>}
    </div>
  );
}
