
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PageTransition from '@/components/layout/PageTransition';

const Profile = () => {
  const navigate = useNavigate();
  
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center pb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">A</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">Admin User</h3>
              <p className="text-muted-foreground mb-4">Library Administrator</p>
              <div className="w-full space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>admin@library.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Main Library</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="font-medium">Recent Activity</h3>
                  <Separator />
                  <div className="space-y-4 pt-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {i === 1 ? 'Checked out "The Great Gatsby"' : 
                             i === 2 ? 'Added new user "John Smith"' : 
                             'Updated system settings'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {i === 1 ? '2 hours ago' : 
                             i === 2 ? 'Yesterday at 4:30 PM' : 
                             '3 days ago'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
