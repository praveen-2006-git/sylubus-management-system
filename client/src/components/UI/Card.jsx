const Card = ({ children, className = "" }) => {
    return (
        <div className={`bg-slate-800 border border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-slate-600 transition-all duration-200 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
