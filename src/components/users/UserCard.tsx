
import React from 'react';
import { MoreHorizontal, User as UserIcon, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  membershipStartDate: Date;
  avatar?: string;
  booksCheckedOut: number;
  status: 'active' | 'inactive' | 'suspended';
}

interface UserCardProps {
  user: UserInfo;
  onEdit?: (user: UserInfo) => void;
  onDelete?: (user: UserInfo) => void;
  onClick?: (user: UserInfo) => void;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onClick,
  className,
}) => {
  const statusColors = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-gray-100 text-gray-700",
    suspended: "bg-rose-100 text-rose-700",
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
        className
      )}
      onClick={() => onClick?.(user)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="h-6 w-6 text-secondary-foreground opacity-70" />
              )}
            </div>
            
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(user);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Member since</p>
            <p className="font-medium">
              {user.membershipStartDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Books checked out</p>
            <p className="font-medium">{user.booksCheckedOut}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <span 
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium",
              statusColors[user.status]
            )}
          >
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
