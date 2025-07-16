import { useState, useEffect, useRef } from 'preact/hooks';

interface DropdownMenuProps {
  trigger: preact.ComponentChildren;
  children: preact.ComponentChildren;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  disabled?: boolean;
}

const DropdownMenu = ({ 
  trigger, 
  children, 
  position = 'bottom-left',
  className = '',
  disabled = false 
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = (): void => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const getPositionClasses = (): string => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0 mt-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      default:
        return 'top-full left-0 mt-2';
    }
  };

  return (
    <div 
      ref={dropdownRef} 
      className={`relative inline-block ${className}`}
    >
      {/* Trigger */}
      <div
        onClick={toggleDropdown}
        className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 min-w-48 bg-white border border-gray-200 rounded-md shadow-lg ${getPositionClasses()}`}
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Componente para items del dropdown
interface DropdownItemProps {
  children: preact.ComponentChildren;
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  href?: string;
}

const DropdownItem = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  href
}: DropdownItemProps) => {
  const handleClick = (e: MouseEvent): void => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  const baseClasses = `block w-full px-4 py-2 text-sm text-left transition-colors duration-200 ${
    disabled 
      ? 'text-gray-400 cursor-not-allowed' 
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
  } ${className}`;

  if (href && !disabled) {
    return (
      <a 
        href={href}
        className={baseClasses}
        role="menuitem"
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={baseClasses}
      disabled={disabled}
      role="menuitem"
    >
      {children}
    </button>
  );
};

// Componente para separadores
const DropdownSeparator = (): preact.VNode => (
  <div className="h-px bg-gray-200 my-1" role="separator" />
);

export {
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
}