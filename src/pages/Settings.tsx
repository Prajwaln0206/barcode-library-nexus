
import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Mail, Clock, User, Shield, Palette, Moon, Sun, Database, CreditCard } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings
  const [libraryName, setLibraryName] = useState("Main City Library");
  const [contactEmail, setContactEmail] = useState("library@example.com");
  const [maxCheckoutDays, setMaxCheckoutDays] = useState("14");
  const [maxCheckoutBooks, setMaxCheckoutBooks] = useState("5");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [overdueReminders, setOverdueReminders] = useState(true);
  const [newArrivalsNotifications, setNewArrivalsNotifications] = useState(false);
  
  // Appearance settings
  const [darkMode, setDarkMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  
  // API settings
  const [apiKey, setApiKey] = useState("sk_test_library_4f3g2h1j5k");
  
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    });
  };
  
  const regenerateApiKey = () => {
    // Generate a random string for demonstration
    const newKey = 'sk_test_library_' + Math.random().toString(36).substring(2, 10);
    setApiKey(newKey);
    
    toast({
      title: "API Key regenerated",
      description: "Your new API key has been generated.",
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="general" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your library's basic configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="library-name">Library Name</Label>
                  <Input 
                    id="library-name" 
                    value={libraryName} 
                    onChange={(e) => setLibraryName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email" 
                    value={contactEmail} 
                    onChange={(e) => setContactEmail(e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-checkout-days">Maximum Checkout Period (Days)</Label>
                    <Input 
                      id="max-checkout-days" 
                      type="number" 
                      value={maxCheckoutDays} 
                      onChange={(e) => setMaxCheckoutDays(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-checkout-books">Maximum Books Per User</Label>
                    <Input 
                      id="max-checkout-books" 
                      type="number"
                      value={maxCheckoutBooks} 
                      onChange={(e) => setMaxCheckoutBooks(e.target.value)} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when notifications are sent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="overdue-reminders">Overdue Reminders</Label>
                  </div>
                  <Switch 
                    id="overdue-reminders" 
                    checked={overdueReminders}
                    onCheckedChange={setOverdueReminders}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="new-arrivals">New Book Arrivals</Label>
                  </div>
                  <Switch 
                    id="new-arrivals" 
                    checked={newArrivalsNotifications}
                    onCheckedChange={setNewArrivalsNotifications}
                  />
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="custom-message">Custom Message for Notifications</Label>
                  <Textarea 
                    id="custom-message" 
                    placeholder="Enter a custom message to include with notifications"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the library system looks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  </div>
                  <Switch 
                    id="high-contrast" 
                    checked={highContrastMode}
                    onCheckedChange={setHighContrastMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="large-text">Large Text</Label>
                  </div>
                  <Switch 
                    id="large-text" 
                    checked={largeText}
                    onCheckedChange={setLargeText}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced features and integrations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-key">API Key</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={regenerateApiKey}
                    >
                      Regenerate
                    </Button>
                  </div>
                  <div className="relative">
                    <Input 
                      id="api-key" 
                      value={apiKey} 
                      readOnly
                      type="password"
                    />
                    <Button 
                      className="absolute right-0 top-0" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey);
                        toast({
                          title: "Copied to clipboard",
                          description: "API key has been copied to clipboard.",
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label>Database Configuration</Label>
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Connected to: library_production_db</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label>Backup Settings</Label>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      Export Data
                    </Button>
                    <Button variant="outline">
                      Import Data
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label>Security Settings</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require 2FA for admins</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Settings;
