import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useUserStore } from "@/lib/userStore";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { name, username, email, phone, avatarInitials, memberSince, setUser } = useUserStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name,
    username,
    email,
    phone
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  const handleSave = () => {
    // Update initials based on new name
    const nameParts = formData.name.split(' ');
    const newInitials = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}` 
      : formData.name.substring(0, 2);
    
    // Update user store
    setUser({ 
      ...formData,
      avatarInitials: newInitials.toUpperCase()
    });
    
    // Show success toast
    toast({
      title: "Changes saved",
      description: "Your profile has been updated"
    });
  };

  return (
    <div className="p-4 pb-6">
      <div className="pt-2 pb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="flex border-b border-neutral-200 dark:border-neutral-700 mb-4 overflow-x-auto hide-scrollbar">
        <button 
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "profile" ? "text-primary border-b-2 border-primary" : "text-neutral-500"}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "appearance" ? "text-primary border-b-2 border-primary" : "text-neutral-500"}`}
          onClick={() => setActiveTab("appearance")}
        >
          Appearance
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "notifications" ? "text-primary border-b-2 border-primary" : "text-neutral-500"}`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "privacy" ? "text-primary border-b-2 border-primary" : "text-neutral-500"}`}
          onClick={() => setActiveTab("privacy")}
        >
          Privacy
        </button>
      </div>
      
      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-lg text-white font-medium">
                  {avatarInitials}
                </div>
                <div>
                  <h3 className="font-medium">{name}</h3>
                  <p className="text-xs text-neutral-400">Member since {memberSince}</p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                <span className="material-icons text-sm mr-1">photo_camera</span>
                Change Photo
              </Button>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input 
                id="username" 
                value={formData.username} 
                onChange={handleChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={handleChange}
                className="mt-1" 
              />
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 mt-2"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
      
      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-neutral-400">Enable dark theme for the app</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Measurement Units</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-primary text-white">Imperial</Button>
                    <Button variant="outline" className="flex-1">Metric</Button>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-2">Language</h3>
                  <select className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-700 bg-transparent">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Workout Reminders</h3>
                    <p className="text-sm text-neutral-400">Get notified before workouts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">Progress Updates</h3>
                    <p className="text-sm text-neutral-400">Weekly progress summaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">AI Coach Tips</h3>
                    <p className="text-sm text-neutral-400">Tips from your AI trainer</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-neutral-400">Receive updates via email</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Show Profile</h3>
                    <p className="text-sm text-neutral-400">Allow others to see your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">Share Workout Data</h3>
                    <p className="text-sm text-neutral-400">Allow friends to see your workouts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium">Data Collection</h3>
                    <p className="text-sm text-neutral-400">Help improve the app</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <Button variant="outline" className="w-full text-red-500 mt-2">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}