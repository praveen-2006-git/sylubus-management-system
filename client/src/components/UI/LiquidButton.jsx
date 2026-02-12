import { motion } from "framer-motion";

const LiquidButton = ({ children, onClick, className = "", ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative overflow-hidden ${className}`}
            onClick={onClick}
            {...props}
        >
            <motion.div
                className="absolute inset-0 bg-white opacity-0"
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
            />
            {children}
        </motion.button>
    );
};

export default LiquidButton;
