import { useProfile, profileCompletion, type Profile as StoreProfile } from "@/lib/store";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  MapPin, 
  Percent, 
  DollarSign, 
  Award, 
  Landmark, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Building, 
  Briefcase, 
  Activity,
  Heart,
  Save,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export function Profile() {
  const [profile, setProfile] = useProfile();
  const completion = profileCompletion(profile);

  function update<K extends keyof StoreProfile>(key: K, value: StoreProfile[K]) {
    setProfile({ ...profile, [key]: value });
  }

  const handleSave = () => {
    toast.success("Profile saved successfully!", {
      icon: <CheckCircle className="text-brand size-5 animate-bounce" />,
      className: "border border-brand/20 bg-surface text-foreground"
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-2 animate-fade-up">
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-brand">
            <Activity className="size-3" />
            <span>Profile Status</span>
            <span>·</span>
            <span className="font-semibold text-foreground bg-brand/10 px-2 py-0.5 rounded-full">{completion}% Complete</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
            Your Admission Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your profile details updated to help Gredis AI generate the best possible diploma recommendations.
          </p>
        </div>
      </div>

      {/* Progress display */}
      <div className="mb-8 rounded-2xl border border-brand/15 bg-brand/5 p-6 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-all duration-700" />
        <div className="mb-3 flex items-center justify-between font-mono text-xs">
          <span className="text-brand/90 font-semibold flex items-center gap-1.5">
            <Sparkles className="size-3.5 animate-pulse text-brand" />
            Profile Strength
          </span>
          <span className="text-foreground font-bold text-sm bg-background/50 px-2.5 py-0.5 rounded border border-border">{completion}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-secondary border border-border/20 p-0.5">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${completion}%` }} 
            transition={{ duration: 1, ease: "easeOut" }} 
            className="h-full bg-gradient-to-r from-brand/80 to-brand rounded-full relative"
          >
            <div className="absolute top-0 right-0 h-full w-2 bg-white/30 rounded-full animate-pulse" />
          </motion.div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {completion === 100 
            ? "Amazing! Your profile is complete. You can now get optimal AI matches."
            : "Fill in at least 13 fields (leaving up to 2 optional ones blank) to reach 100% completion!"
          }
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Quick setup */}
        <Section title="Quick setup" icon={<Sparkles className="text-brand size-5" />} description="Essential fields required for initial matching">
          <TextField 
            label="State" 
            value={profile.state ?? ""} 
            required
            placeholder="e.g. Maharashtra"
            icon={<MapPin className="size-4" />}
            onChange={(v) => update("state", v)} 
          />
          <NumberField 
            label="10th Percentage (%)" 
            value={profile.tenthPercentage} 
            required
            placeholder="e.g. 85.5"
            icon={<Percent className="size-4" />}
            onChange={(v) => update("tenthPercentage", v)} 
          />
          <NumberField 
            label="Annual Budget (₹)" 
            value={profile.budget} 
            required
            placeholder="e.g. 50000"
            icon={<DollarSign className="size-4" />}
            onChange={(v) => update("budget", v)} 
          />
          <TextField 
            label="Preferred Branch" 
            value={profile.preferredBranch ?? ""} 
            required
            placeholder="e.g. Computer Engineering"
            icon={<GraduationCap className="size-4" />}
            onChange={(v) => update("preferredBranch", v)} 
          />
          <SelectField 
            label="College Type" 
            value={profile.collegeType ?? ""} 
            required
            options={["government", "private", "both"]} 
            icon={<Landmark className="size-4" />}
            onChange={(v) => update("collegeType", v as any)} 
          />
        </Section>

        {/* Section 2: Location & category */}
        <Section title="Location & Category" icon={<MapPin className="text-brand size-5" />} description="Details about your background and locations">
          <TextField 
            label="City Preference" 
            value={profile.city ?? ""} 
            required
            placeholder="e.g. Mumbai"
            icon={<Building className="size-4" />}
            onChange={(v) => update("city", v)} 
          />
          <SelectField 
            label="Category" 
            value={profile.category ?? ""} 
            required
            options={["General", "OBC", "SC", "ST", "EWS", "PWD"]} 
            icon={<Award className="size-4" />}
            onChange={(v) => update("category", v)} 
          />
          <SelectField 
            label="Medium of Instruction" 
            value={profile.medium ?? ""} 
            required
            options={["english", "gujarati", "hindi"]} 
            icon={<BookOpen className="size-4" />}
            onChange={(v) => update("medium", v as any)} 
          />
          <TextField 
            label="Preferred College Location" 
            value={profile.preferredLocation ?? ""} 
            placeholder="e.g. Pune or Ahmedabad"
            icon={<MapPin className="size-4" />}
            onChange={(v) => update("preferredLocation", v)} 
          />
        </Section>

        {/* Section 3: Family & finance */}
        <Section title="Family & Finance" icon={<DollarSign className="text-brand size-5" />} description="Finances and hostel accommodations">
          <NumberField 
            label="Family Income (₹/year)" 
            value={profile.familyIncome} 
            placeholder="e.g. 300000"
            icon={<DollarSign className="size-4" />}
            onChange={(v) => update("familyIncome", v)} 
          />
          <BoolField 
            label="Hostel accommodation required" 
            value={!!profile.hostelRequired} 
            icon={<Building className="size-4" />}
            onChange={(v) => update("hostelRequired", v)} 
          />
          <BoolField 
            label="Scholarship required" 
            value={!!profile.scholarshipRequired} 
            icon={<Award className="size-4" />}
            onChange={(v) => update("scholarshipRequired", v)} 
          />
        </Section>

        {/* Section 4: Career preferences */}
        <Section title="Career Preferences" icon={<Briefcase className="text-brand size-5" />} description="Goals and institution size priorities">
          <TextField 
            label="Career Goal" 
            value={profile.careerGoal ?? ""} 
            placeholder="e.g. Software Engineer or Higher Education"
            icon={<Briefcase className="size-4" />}
            onChange={(v) => update("careerGoal", v)} 
          />
          <SelectField 
            label="Placement Priority" 
            value={profile.placementPriority ?? ""} 
            options={["high", "medium", "low"]} 
            icon={<Activity className="size-4" />}
            onChange={(v) => update("placementPriority", v as any)} 
          />
          <SelectField 
            label="Preferred College Size" 
            value={profile.collegeSize ?? ""} 
            options={["small", "medium", "large"]} 
            icon={<Building className="size-4" />}
            onChange={(v) => update("collegeSize", v as any)} 
          />
        </Section>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-6 font-semibold text-brand-foreground shadow-lg transition-all duration-300 hover:brand-glow hover:-translate-y-0.5"
          >
            <Save className="size-4 transition-transform group-hover:rotate-12" />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, description, children }: { title: string; icon: React.ReactNode; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/30 p-6 backdrop-blur-md transition-all duration-300 hover:border-brand/10 hover:bg-surface/40">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-lg bg-brand/10 p-2 text-brand border border-brand/20">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
}

function TextField({ label, value, onChange, icon, required, placeholder }: FieldProps & { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block group">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground tracking-wider group-focus-within:text-brand transition-colors">
        <span className="flex items-center gap-1.5">
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </span>
        {!required && <span className="text-[9px] lowercase opacity-60">(optional)</span>}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand size-4 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-border bg-background/50 px-4 outline-none transition-all duration-200 focus:border-brand focus:bg-background focus:ring-1 focus:ring-brand/30 text-sm ${icon ? "pl-11" : ""}`}
        />
      </div>
    </label>
  );
}

function NumberField({ label, value, onChange, icon, required, placeholder }: FieldProps & { value: number | undefined; onChange: (v: number | undefined) => void }) {
  return (
    <label className="block group">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground tracking-wider group-focus-within:text-brand transition-colors">
        <span className="flex items-center gap-1.5">
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </span>
        {!required && <span className="text-[9px] lowercase opacity-60">(optional)</span>}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand size-4 flex items-center justify-center font-semibold">
            {icon}
          </div>
        )}
        <input 
          type="number" 
          value={value ?? ""} 
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-border bg-background/50 px-4 outline-none transition-all duration-200 focus:border-brand focus:bg-background focus:ring-1 focus:ring-brand/30 text-sm font-mono ${icon ? "pl-11" : ""}`}
        />
      </div>
    </label>
  );
}

function SelectField({ label, value, options, onChange, icon, required }: FieldProps & { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block group">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground tracking-wider group-focus-within:text-brand transition-colors">
        <span className="flex items-center gap-1.5">
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </span>
        {!required && <span className="text-[9px] lowercase opacity-60">(optional)</span>}
      </div>
      <div className="relative font-sans">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand size-4 flex items-center justify-center">
            {icon}
          </div>
        )}
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 w-full rounded-xl border border-border bg-background/50 px-4 outline-none transition-all duration-200 focus:border-brand focus:bg-background focus:ring-1 focus:ring-brand/30 text-sm capitalize appearance-none cursor-pointer ${icon ? "pl-11" : ""}`}
        >
          <option value="" className="text-black bg-white font-sans">Select...</option>
          {options.map((o) => (
            <option key={o} value={o} className="text-black bg-white font-sans capitalize">{o}</option>
          ))}
        </select>
        {/* Custom arrow indicator */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4 flex items-center justify-center">
          ▼
        </div>
      </div>
    </label>
  );
}

function BoolField({ label, value, onChange, icon }: Omit<FieldProps, "placeholder"> & { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3 hover:border-brand/10 transition-colors">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase text-muted-foreground tracking-wider">
        {icon && <span className="text-muted-foreground/60">{icon}</span>}
        {label}
      </span>
      <button 
        type="button" 
        onClick={() => onChange(!value)}
        className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-300 outline-none focus:ring-1 focus:ring-brand/30 ${value ? "bg-brand" : "bg-secondary"}`}
      >
        <motion.span 
          animate={{ x: value ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="block size-5 rounded-full bg-white shadow" 
        />
      </button>
    </div>
  );
}
