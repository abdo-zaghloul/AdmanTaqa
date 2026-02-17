 
type OnboardingPageHeaderProps = {
  children: React.ReactNode;
};

export default function OnboardingPageHeader({ children }: OnboardingPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Onboarding</h1>
        <p className="text-muted-foreground">
          Manage onboarding slides and content for the app.
        </p>
      </div>
      {children}
      
    </div>
  );
}
