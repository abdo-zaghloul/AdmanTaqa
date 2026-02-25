import {
  Building2,
  MapPin,
  GitBranch,
  ShieldCheck,
  Users,
  ClipboardList,
  Tags,
  FileOutput,
  Briefcase,
  SearchCheck,
  History,
  LogOut,
  UserCog,
  FileText,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ROUTE_ACCESS_RULES,
  canAccessByRule,
  normalizePathKey,
} from "@/lib/accessControl";

interface NavItem {
  label: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  isDropdown?: boolean;
  children?: NavItem[];
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navGroups: NavGroup[] = [
  {
    label: "TAQA ",
    items: [],
  },
  {
    items: [
      { 
        label: "Organizations", 
        icon: Building2,
        isDropdown: true,
        children: [
          // { label: "service providers (service providers)", path: "/service-providers", icon: Building2 },
          { label: "organizations (authority)", path: "/organizations", icon: Building2 },
          { label: "Fuel (fuel-retail)", path: "/fuel-retail", icon: Building2 }
        ]
      },
      { 
        label: "Users", 
        icon: Users,
        isDropdown: true,
        children: [
          { label: "Users", path: "/users", icon: Users },
          { label: "Roles", path: "/roles", icon: ShieldCheck }
        ]
      },
      { label: "Registrations", path: "/registrations", icon: FileText },
      { label: "Onboarding", path: "/onboarding", icon: BookOpen },
      { label: "Profile", path: "/profile", icon: UserCog },
      
      { label: "Branches", path: "/branches", icon: GitBranch },
      { label: "Branch Requests", path: "/branch-requests", icon: GitBranch },
      { label: "Locations", path: "/locations", icon: MapPin },
      { label: "Service Offering", path: "/service-Offering", icon: ClipboardList },
      { label: "Service Categories", path: "/service-categories", icon: Tags },
      { label: "Job Orders", path: "/job-orders", icon: Briefcase },
      { label: "Work Orders", path: "/work-orders", icon: Briefcase },
      { label: "Quotations", path: "/quotations", icon: FileOutput },
      
      { label: "Inspections", path: "/inspections", icon: SearchCheck },
      { label: "Audit Log", path: "/audit-log", icon: History },
    ],
  }, 
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
   
  // State to manage dropdowns
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "Organizations": false,
    "Users": false
  });

  const { logout, organization, permissions } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isItemActive = (item: NavItem) => {
    if (item.path) {
      return location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
    }
    return false;
  };

  const canSeePath = (path?: string) => {
    if (!path) return true;
    const pathKey = normalizePathKey(path);
    return canAccessByRule(
      ROUTE_ACCESS_RULES[pathKey],
      organization?.type,
      permissions
    );
  };

  const canSeeItem = (item: NavItem): boolean => {
    if (item.isDropdown && item.children) {
      return item.children.some((child) => canSeeItem(child));
    }
    return canSeePath(item.path);
  };

  const visibleGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => canSeeItem(item)),
  }));

  const renderItem = (item: NavItem) => {
    if (item.isDropdown) {
      const isOpen = openDropdowns[item.label];
      return (
        <div key={item.label}>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="px-4 py-6 hover:bg-primary/5 transition-all group/btn w-full justify-between"
              onClick={() => toggleDropdown(item.label)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-slate-500" />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {isOpen ? 
                <ChevronDown className="h-4 w-4 text-slate-500" /> : 
                <ChevronRight className="h-4 w-4 text-slate-500" />
              }
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isOpen && item.children && (
            <div className="ml-8 border-l-2 border-slate-200 pl-2">
              {item.children.filter((child) => canSeeItem(child)).map((child) => (
                <SidebarMenuItem key={child.path}>
                  <SidebarMenuButton
                    className="px-4 py-4 hover:bg-primary/5 transition-all group/btn"
                    asChild
                    isActive={isItemActive(child)}
                  >
                    <Link to={child.path!} className="flex items-center gap-3">
                      <child.icon className={`h-4 w-4 transition-colors ${isItemActive(child) ? 'text-primary' : 'text-slate-500 group-hover/btn:text-primary'}`} />
                      <span className="font-medium text-sm">{child.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      // Only render items with paths
      if (!item.path) return null;
      
      return (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            className="px-4 py-6 hover:bg-primary/5 transition-all group/btn"
            asChild
            isActive={isItemActive(item)}
          >
            <Link to={item.path} className="flex items-center gap-3">
              <item.icon className={`h-4 w-4 transition-colors ${isItemActive(item) ? 'text-primary' : 'text-slate-500 group-hover/btn:text-primary'}`} />
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest opacity-60 px-4 mt-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(renderItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
