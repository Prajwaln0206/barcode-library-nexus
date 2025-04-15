
import React from 'react';
import { User, Info, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type UserInfo = {
  id: string;
  name: string;
  email: string;
  membershipStartDate: Date;
  booksCheckedOut: number;
  status: string;
  avatar?: string;
};

interface UserSelectorProps {
  users: UserInfo[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  onProcessCheckout: () => void;
  disabled: boolean;
  loading: boolean;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserId,
  setSelectedUserId,
  onProcessCheckout,
  disabled,
  loading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Select User
        </CardTitle>
        <CardDescription>
          Choose the user who is checking out the book
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {users.map(user => (
                <div
                  key={user.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                    selectedUserId === user.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {user.booksCheckedOut} book{user.booksCheckedOut !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4">
              <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No users found in the system.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add users to enable checkout functionality.
              </p>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button
              disabled={disabled || loading}
              onClick={onProcessCheckout}
            >
              {loading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Process Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSelector;
