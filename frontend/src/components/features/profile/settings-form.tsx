"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import type { UserPreferences } from "@/lib/profile-mock";
import { useLocale } from "@/components/providers/locale-provider";

interface SettingsFormProps {
  initialPreferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

export function SettingsForm({ initialPreferences, onSave }: SettingsFormProps) {
  const { t } = useLocale();
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(preferences) !== JSON.stringify(initialPreferences));
  }, [preferences, initialPreferences]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await apiClient.updateUserPreferences(preferences);
      onSave(updated);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences(initialPreferences);
    setHasChanges(false);
  };

  const languages = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C#", label: "C#" },
    { value: "C++", label: "C++" },
    { value: "Go", label: "Go" },
    { value: "Rust", label: "Rust" },
  ];

  const levels = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "vs-light", label: "Light" },
    { value: "hc-black", label: "High Contrast" },
  ];

  const wordWrapOptions = [
    { value: "on", label: "On" },
    { value: "off", label: "Off" },
    { value: "wordWrapColumn", label: "At Column" },
    { value: "bounded", label: "Bounded" },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.basicInfo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">{t.settings.displayName}</Label>
            <Input
              id="displayName"
              value={preferences.displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreferences({ ...preferences, displayName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t.settings.email}</Label>
            <Input
              id="email"
              type="email"
              value={preferences.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreferences({ ...preferences, email: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.learningPreferences}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t.settings.preferredLanguage}</Label>
            <Select
              value={preferences.preferredLanguage}
              onValueChange={(value: string) => setPreferences({ ...preferences, preferredLanguage: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.settings.uiLanguage}</Label>
            <Select
              value={preferences.uiLanguage}
              onValueChange={(value: "vi" | "en") => setPreferences({ ...preferences, uiLanguage: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">{t.common.languageVi}</SelectItem>
                <SelectItem value="en">{t.common.languageEn}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.settings.selfAssessedLevel}</Label>
            <Select
              value={preferences.selfAssessedLevel}
              onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") =>
                setPreferences({ ...preferences, selfAssessedLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Editor Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.editorSettings}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t.settings.theme}</Label>
            <Select
              value={preferences.editorTheme}
              onValueChange={(value: "vs-dark" | "vs-light" | "hc-black") =>
                setPreferences({ ...preferences, editorTheme: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.settings.fontSize}: {preferences.editorFontSize}px</Label>
            <Slider
              value={[preferences.editorFontSize]}
              onValueChange={([value]: number[]) => setPreferences({ ...preferences, editorFontSize: value })}
              min={10}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>{t.settings.wordWrap}</Label>
            <Select
              value={preferences.editorWordWrap}
              onValueChange={(value: "on" | "off" | "wordWrapColumn" | "bounded") =>
                setPreferences({ ...preferences, editorWordWrap: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {wordWrapOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.settings.minimap}</Label>
              <p className="text-sm text-muted-foreground">{t.settings.minimapDesc}</p>
            </div>
            <Switch
              checked={preferences.editorMinimap}
              onCheckedChange={(checked: boolean) => setPreferences({ ...preferences, editorMinimap: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.notificationSettings}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.settings.emailNotifications}</Label>
              <p className="text-sm text-muted-foreground">{t.settings.notifications.emailDesc}</p>
            </div>
            <Switch
              checked={preferences.notifications.emailNotifications}
              onCheckedChange={(checked: boolean) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, emailNotifications: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.settings.pushNotifications}</Label>
              <p className="text-sm text-muted-foreground">{t.settings.notifications.pushDesc}</p>
            </div>
            <Switch
              checked={preferences.notifications.pushNotifications}
              onCheckedChange={(checked: boolean) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, pushNotifications: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t.settings.weeklyProgress}</Label>
              <p className="text-sm text-muted-foreground">{t.settings.notifications.weeklyDesc}</p>
            </div>
            <Switch
              checked={preferences.notifications.weeklyProgress}
              onCheckedChange={(checked: boolean) =>
                setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, weeklyProgress: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleReset} disabled={!hasChanges || isSaving}>
          {t.settings.reset}
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? t.settings.saving : t.settings.saveChanges}
        </Button>
      </div>
    </div>
  );
}
