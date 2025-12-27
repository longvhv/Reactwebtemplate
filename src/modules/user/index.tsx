import { User } from "lucide-react";
import { ModuleDefinition } from "../../core/ModuleRegistry";
import { ProfilePage } from "../../pages/ProfilePage";
import { SettingsPage } from "../../pages/SettingsPage";
import { AppearancePage } from "../../pages/AppearancePage";
import { HelpPage } from "../../pages/HelpPage";

/**
 * User Module - User-related pages
 * 
 * Includes:
 * - Profile management
 * - Settings
 * - Appearance customization
 * - Help center
 * 
 * Note: This module is hidden from sidebar (only accessible via user menu)
 */
export const UserModule: ModuleDefinition = {
  id: "user",
  name: "User",
  version: "1.0.0",
  enabled: true,
  showInSidebar: false, // Hide from sidebar navigation
  icon: <User className="w-5 h-5" />,
  routes: [
    {
      path: "/profile",
      element: <ProfilePage />,
      title: "Hồ sơ",
    },
    {
      path: "/settings",
      element: <SettingsPage />,
      title: "Cài đặt",
    },
    {
      path: "/appearance",
      element: <AppearancePage />,
      title: "Giao diện",
    },
    {
      path: "/help",
      element: <HelpPage />,
      title: "Trợ giúp",
    },
  ],
};