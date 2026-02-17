import RegistrationsTable from '@/pages/Registrations/component/RegistrationsTable';

export default function RegistrationsPage() {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Service Provider Registrations</h1>
                <p className="text-muted-foreground">Review and manage incoming service provider applications.</p>
            </div>
            <RegistrationsTable />
        </div>
    );
}
