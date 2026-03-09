import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useRegisterV2Form, REGISTER_V2_FILE_KEYS, getRequiredFileKeys } from "@/hooks/Auth/useRegisterV2Form";
import useGetCountries from "@/hooks/Location/useGetCountries";
import useGetGovernorates from "@/hooks/Location/useGetGovernorates";
import useGetCities from "@/hooks/Location/useGetCities";
import useGetAreas from "@/hooks/Location/useGetAreas";
import {
  User,
  Lock,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Briefcase,
  BadgeCheck,
  FileText,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const FILE_ACCEPT = "application/pdf,image/jpeg,image/png,image/gif,image/webp";
const FILE_LABELS: Record<(typeof REGISTER_V2_FILE_KEYS)[number], string> = {
  org_license: "Organization license (LICENSE)",
  org_registration: "Organization registration (REGISTRATION)",
  org_other: "Other document (OTHER)",
  sp_commercial_registration: "Commercial registration",
  sp_tax_certificate: "Tax certificate",
  sp_technical_certificate: "Technical certificate",
  sp_insurance_certificate: "Insurance certificate",
};

const STEP_LABELS = [
  "Organization & account",
  "Service provider profile",
  "Organization documents",
  "Service provider documents",
];

export default function Register() {
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    isLoading,
    apiError,
    files,
    setFile,
    registrationSuccess,
    // completeRegistration,
  } = useRegisterV2Form();

  const organizationType = watch("organizationType");
  const cityIdWatch = watch("cityId");
  const areaIdWatch = watch("areaId");

  const [locationCountryId, setLocationCountryId] = useState<number | null>(null);
  const [locationGovernorateId, setLocationGovernorateId] = useState<number | null>(null);

  const countries = useGetCountries().data?.data ?? [];
  const governorates = useGetGovernorates(locationCountryId).data?.data ?? [];
  const cities = useGetCities(locationGovernorateId).data?.data ?? [];
  const cityIdNum = cityIdWatch != null && cityIdWatch !== "" ? Number(cityIdWatch) : null;
  const areas = useGetAreas(cityIdNum).data?.data ?? [];
  const isServiceProvider = organizationType === "SERVICE_PROVIDER";

  const totalSteps = 4;
  const [step, setStep] = useState(1);
  const effectiveStep = step > totalSteps ? totalSteps : step;

  const requiredFileKeys = getRequiredFileKeys(organizationType);
  const hasRequiredFiles = requiredFileKeys.every((k) => files[k]);
  const canSubmit = isValid && hasRequiredFiles;

  const goNext = () => {
    if (effectiveStep < totalSteps) setStep(effectiveStep + 1);
  };
  const goBack = () => {
    if (effectiveStep > 1) setStep(effectiveStep - 1);
  };

  const isLastStep = effectiveStep === totalSteps;

  if (registrationSuccess) {
    const org = registrationSuccess.data?.organization;
    const docs = registrationSuccess.documentsReceived;
    return (
      <div className="flex min-h-screen bg-white">
        <div className="hidden lg:flex lg:w-[40%] relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-900 to-slate-950 z-10" />
          <div className="relative z-20 flex flex-col justify-between p-12 w-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-2xl italic">T</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white uppercase italic">TAQA</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-8 md:p-16 bg-slate-50/20">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-14 w-14 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {registrationSuccess.message ?? "Organization registered. Pending approval."}
            </h2>
            {org && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-left space-y-2">
                <p className="text-sm font-bold text-slate-600">Organization</p>
                <p className="font-medium text-slate-900">{org.name}</p>
                <p className="text-xs text-slate-500">
                  Type: {org.type.replace("_", " ")} · Status: <span className="font-semibold text-amber-600">{org.status}</span>
                </p>
              </div>
            )}
            {docs && (docs.organization?.length || docs.serviceProvider?.length) ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-left space-y-2">
                <p className="text-sm font-bold text-slate-600">Documents received</p>
                {docs.organization?.length ? (
                  <p className="text-xs text-slate-700">Organization: {docs.organization.join(", ")}</p>
                ) : null}
                {docs.serviceProvider?.length ? (
                  <p className="text-xs text-slate-700">Service provider: {docs.serviceProvider.join(", ")}</p>
                ) : null}
              </div>
            ) : null}
            {/* <Button
              className="w-full gap-2 bg-slate-900 hover:bg-slate-800"
              onClick={() => {
                completeRegistration();
                navigate("/", { replace: true });
              }}
            >
              Continue to dashboard
            </Button> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-900 to-slate-950 z-10" />
        <div className="relative z-20 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-2xl italic">T</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase italic">TAQA</span>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white leading-tight">
                Join the network of <span className="text-primary underline decoration-primary/30 underline-offset-8">Excellence</span>.
              </h2>
              <p className="text-slate-400 font-medium">
                Register in a few steps: organization, representative, then optional profile and documents.
              </p>
            </div>
            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: "Industry compliance", desc: "Safety and regulatory standards." },
                { icon: Briefcase, title: "Business growth", desc: "Service requests and wider reach." },
                { icon: BadgeCheck, title: "Verified identity", desc: "Trust through multi-level verification." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Notice</div>
            <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">
              Files: PDF or images, max 5 MB. Requests reviewed within 24–48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Stepped form */}
      <div className="w-full lg:w-[60%] flex flex-col bg-slate-50/20 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="max-w-2xl w-full mx-auto p-8 md:p-16 lg:p-20 space-y-8">
          <div className="flex items-center justify-between">
            <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors group">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to login
            </Link>
          </div>

          {/* Step indicator */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-500">
              Step {effectiveStep} of {totalSteps}
            </p>
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    s < effectiveStep ? "bg-primary" : s === effectiveStep ? "bg-primary" : "bg-slate-200"
                  }`}
                  style={{ opacity: s <= effectiveStep ? 1 : 0.4 }}
                />
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              {effectiveStep === 1 && STEP_LABELS[0]}
              {effectiveStep === 2 && isServiceProvider && STEP_LABELS[1]}
              {effectiveStep === 2 && !isServiceProvider && "Fuel station profile"}
              {effectiveStep === 3 && STEP_LABELS[3]}
              {effectiveStep === 4 && STEP_LABELS[2]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {apiError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">{apiError}</div>
            )}

            {/* Step 1: Organization + First user + Email & password */}
            {effectiveStep === 1 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    Organization
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="text-xs font-bold text-slate-600">Organization name *</Label>
                      <Input id="organizationName" placeholder="e.g. Energy Station / Advanced Maintenance Co." className="h-11 bg-white" {...register("organizationName")} />
                      {errors.organizationName?.message && <p className="text-xs text-red-600 font-medium">{errors.organizationName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationType" className="text-xs font-bold text-slate-600">Organization type *</Label>
                      <select
                        id="organizationType"
                        className="flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none font-medium text-slate-900"
                        {...register("organizationType")}
                      >
                        <option value="SERVICE_PROVIDER">Service provider</option>
                        <option value="FUEL_STATION">Fuel station</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Authorized representative (first user)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-xs font-bold text-slate-600">Full name *</Label>
                      <Input id="fullName" placeholder="John Smith" className="h-11 bg-white" {...register("fullName")} />
                      {errors.fullName?.message && <p className="text-xs text-red-600 font-medium">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-600">Phone *</Label>
                      <div className="flex h-11 rounded-md border border-input bg-white overflow-hidden">
                        <span className="inline-flex items-center px-3 text-sm text-muted-foreground border-r border-input bg-muted/30">+966</span>
                        <Input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          maxLength={9}
                          placeholder="501234567"
                          className="h-11 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          aria-invalid={!!errors.phone}
                          {...register("phone")}
                        />
                      </div>
                      {errors.phone?.message && <p className="text-xs text-red-600 font-medium">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    Email & password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-600">Email *</Label>
                      <Input id="email" type="email" placeholder="admin@example.com" className="h-11 bg-white" {...register("email")} />
                      {errors.email?.message && <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs font-bold text-slate-600">Password * (8–128 characters)</Label>
                      <Input id="password" type="password" placeholder="••••••••" className="h-11 bg-white" {...register("password")} />
                      {errors.password?.message && <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Service provider profile (SP) / Station profile (Fuel) — same fields */}
            {effectiveStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  {isServiceProvider ? "Service provider profile" : "Fuel station profile"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-xs font-bold text-slate-600">License number *</Label>
                    <Input id="licenseNumber" placeholder="CR-12345" className="h-11 bg-white" {...register("licenseNumber")} />
                    {errors.licenseNumber?.message && <p className="text-xs text-red-600 font-medium">{errors.licenseNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience" className="text-xs font-bold text-slate-600">Years of experience *</Label>
                    <Input id="yearsExperience" type="number" min={0} placeholder="5" className="h-11 bg-white" {...register("yearsExperience")} />
                    {errors.yearsExperience?.message && <p className="text-xs text-red-600 font-medium">{errors.yearsExperience.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600">Country *</Label>
                    <select
                      className="flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-medium text-slate-900"
                      value={locationCountryId ?? ""}
                      onChange={(e) => {
                        const v = e.target.value ? Number(e.target.value) : null;
                        setLocationCountryId(v);
                        setLocationGovernorateId(null);
                        setValue("cityId", "");
                        setValue("areaId", "");
                      }}
                    >
                      <option value="">Select country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600">Governorate *</Label>
                    <select
                      className="flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-medium text-slate-900 disabled:opacity-50"
                      value={locationGovernorateId ?? ""}
                      disabled={!locationCountryId}
                      onChange={(e) => {
                        const v = e.target.value ? Number(e.target.value) : null;
                        setLocationGovernorateId(v);
                        setValue("cityId", "");
                        setValue("areaId", "");
                      }}
                    >
                      <option value="">Select governorate</option>
                      {governorates.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cityId" className="text-xs font-bold text-slate-600">City *</Label>
                    <select
                      id="cityId"
                      className="flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-medium text-slate-900 disabled:opacity-50"
                      disabled={!locationGovernorateId}
                      value={cityIdWatch ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setValue("cityId", v);
                        setValue("areaId", "");
                      }}
                    >
                      <option value="">Select city</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.cityId?.message && <p className="text-xs text-red-600 font-medium">{errors.cityId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaId" className="text-xs font-bold text-slate-600">Area *</Label>
                    <select
                      id="areaId"
                      className="flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-medium text-slate-900 disabled:opacity-50"
                      disabled={!cityIdNum}
                      value={areaIdWatch ?? ""}
                      onChange={(e) => setValue("areaId", e.target.value)}
                    >
                      <option value="">Select area</option>
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                    {errors.areaId?.message && <p className="text-xs text-red-600 font-medium">{errors.areaId.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="street" className="text-xs font-bold text-slate-600">Street *</Label>
                    <Input id="street" placeholder="Main Street" className="h-11 bg-white" {...register("street")} />
                    {errors.street?.message && <p className="text-xs text-red-600 font-medium">{errors.street.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Service provider documents (first) */}
            {effectiveStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Service provider documents (all required)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["sp_commercial_registration", "sp_tax_certificate", "sp_technical_certificate", "sp_insurance_certificate"] as const).map((key) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600">{FILE_LABELS[key]}</Label>
                      <Input
                        type="file"
                        accept={FILE_ACCEPT}
                        className="h-11 bg-white text-sm"
                        onChange={(e) => setFile(key, e.target.files?.[0] ?? null)}
                      />
                      {files[key] && <p className="text-xs text-slate-500 truncate">{files[key]?.name}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Organization documents (second) */}
            {effectiveStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Organization documents (all required) — PDF or images, max 5 MB
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["org_license", "org_registration", "org_other"] as const).map((key) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600">{FILE_LABELS[key]}</Label>
                      <Input
                        type="file"
                        accept={FILE_ACCEPT}
                        className="h-11 bg-white text-sm"
                        onChange={(e) => setFile(key, e.target.files?.[0] ?? null)}
                      />
                      {files[key] && <p className="text-xs text-slate-500 truncate">{files[key]?.name}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {effectiveStep > 1 ? (
                <Button type="button" variant="outline" className="gap-2" onClick={goBack} disabled={isLoading}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <div />
              )}
              <div className="flex-1" />
              {!isLastStep ? (
                <Button type="button" className="gap-2 bg-slate-900 hover:bg-slate-800" onClick={goNext}>
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="gap-2 bg-slate-900 hover:bg-slate-800 min-w-[180px]"
                  disabled={isLoading || !canSubmit}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register organization"
                  )}
                </Button>
              )}
            </div>

            <p className="text-center text-[11px] text-slate-400 font-medium px-8">
              After success, the organization is <strong>PENDING</strong> until authority approval.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
