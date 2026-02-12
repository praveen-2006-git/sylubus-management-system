const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-slate-800 rounded-md ${className}`}
            {...props}
        />
    );
};

export default Skeleton;
