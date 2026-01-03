// Backup of original UserProfileDropdown before debugging
import { memo, useState, useRef, useEffect } from "react";
import { useNavigate } from "../../platform/navigation/Router"; // ✅ Use platform abstraction (fixed path)
import { 
  User, Settings, HelpCircle, LogOut, ChevronRight, 
  Crown, Shield, Mail, Bell, Palette, Keyboard, Moon, Sun, Monitor
} from "lucide-react";
import { Button } from "../ui/button";

interface UserProfileDropdownProps {
  theme: "light" | "dark" | "system";
  onCycleTheme: () => void;
}

export const UserProfileDropdownBackup = memo(({ theme, onCycleTheme }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: "Admin User",
    email: "admin@vhvplatform.com",
    role: "Administrator",
    avatar: null,
  };

  return (
    <div>User Profile</div>
  );
});
