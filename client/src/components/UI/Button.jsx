import { motion } from 'framer-motion';
const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button' }) => {
    const baseStyles = "font-medium py-2 px-4 rounded transition-colors shadow-sm focus:outline-none";

    // Light Theme Variations
    const variants = {
        primary: "bg-blue-700 hover:bg-blue-800 text-white",
        secondary: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50",
        outline: "border border-blue-700 text-blue-700 hover:bg-blue-50",
        ghost: "text-slate-600 hover:text-blue-700 hover:bg-slate-100 shadow-none"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
