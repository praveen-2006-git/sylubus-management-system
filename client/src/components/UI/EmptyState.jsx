import Button from './Button';

const EmptyState = ({
    title = 'No data found',
    description = 'There are no items to display at the moment.',
    actionLabel,
    onAction,
    icon
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-slate-800 border-dashed rounded-xl bg-slate-900/50">
            <div className="bg-violet-500/10 p-4 rounded-full mb-4">
                {icon || (
                    <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                )}
            </div>
            <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
            <p className="text-slate-400 text-sm max-w-sm mb-6">{description}</p>

            {actionLabel && onAction && (
                <Button onClick={onAction} variant="outline">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
