import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-heading font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-20 w-20 rounded-full bg-primary-light flex items-center justify-center text-xl text-white font-medium">
                  JS
                </div>
                <Button variant="outline">Change Photo</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Jamie Smith" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jamie.smith@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="jamiesmith" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                </div>
              </div>
              
              <Button className="bg-primary mt-4">Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <Button className="bg-primary mt-2">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-neutral-300">Enable dark theme for the app</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Measurement Units</h3>
                    <p className="text-sm text-neutral-300">Choose your preferred unit system</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="bg-primary-light text-white">Imperial</Button>
                    <Button variant="outline">Metric</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-sm text-neutral-300">Set your preferred language</p>
                  </div>
                  <select className="px-3 py-2 rounded border border-neutral-200">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Workout Reminders</h3>
                    <p className="text-sm text-neutral-300">Get notified before scheduled workouts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Progress Updates</h3>
                    <p className="text-sm text-neutral-300">Weekly summaries of your fitness progress</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">AI Coach Tips</h3>
                    <p className="text-sm text-neutral-300">Personalized tips from your AI trainer</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-neutral-300">Receive updates via email</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl">Premium Plan</h3>
                    <p className="text-sm text-neutral-300">Billed annually</p>
                  </div>
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    Active
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <span className="material-icons text-primary mr-2">check_circle</span>
                    <span>AI Trainer Access</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-primary mr-2">check_circle</span>
                    <span>Custom Workout Plans</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-primary mr-2">check_circle</span>
                    <span>Advanced Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-primary mr-2">check_circle</span>
                    <span>Nutrition Tracking</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <p className="font-bold text-lg">$99.99/year</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline">Change Plan</Button>
                <Button variant="destructive">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Payment Method</p>
                  <div className="flex items-center mt-2">
                    <span className="material-icons mr-2">credit_card</span>
                    <span>•••• •••• •••• 4242</span>
                    <span className="ml-2 text-sm text-neutral-300">Expires 05/25</span>
                    <Button variant="ghost" className="ml-auto text-primary" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium">Billing Address</p>
                  <p className="text-sm mt-2">
                    123 Fitness Street<br />
                    Workout City, WO 12345<br />
                    United States
                  </p>
                  <Button variant="ghost" className="mt-2 text-primary" size="sm">
                    Edit
                  </Button>
                </div>
                
                <div>
                  <p className="font-medium">Billing History</p>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm flex justify-between">
                      <span>May 1, 2025</span>
                      <span>$99.99</span>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <span className="material-icons text-primary text-sm">receipt</span>
                      </Button>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span>May 1, 2024</span>
                      <span>$99.99</span>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <span className="material-icons text-primary text-sm">receipt</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}