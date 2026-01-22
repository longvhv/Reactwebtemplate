import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { UserProfile } from '@/services/profileApi';

interface ProfileInfoProps {
  profile: UserProfile;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Full Name</Label>
            <p className="font-medium">{profile.name}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Email</Label>
            <p className="font-medium break-all">{profile.email}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Phone</Label>
            <p className="font-medium">{profile.phone}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Location</Label>
            <p className="font-medium">{profile.location}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Department</Label>
            <p className="font-medium">{profile.department}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Position</Label>
            <p className="font-medium">{profile.position}</p>
          </div>
        </div>

        {profile.bio && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Bio</Label>
            <p className="text-sm">{profile.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
