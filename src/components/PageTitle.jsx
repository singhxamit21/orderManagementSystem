
export default function PageTitle({ title, subtitle }) {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-700">{title}</h1>
            {subtitle && (
                <p className="text-muted text-sm mt-1">{subtitle}</p>
            )}
        </div>
    );
}
