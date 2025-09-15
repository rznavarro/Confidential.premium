import React from 'react';
import { Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Zap className={`${sizeClasses[size]} text-cyan-400 animate-pulse`} />
        <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-20 blur-md" />
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          Vortexia
        </span>
      )}
    </div>
  );
};