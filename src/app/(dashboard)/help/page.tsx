'use client';

import { useNavigation } from '@/shims/router';
import { useLanguage } from '@/providers/LanguageProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HelpPage() {
  const { t } = useLanguage();
  const navigation = useNavigation();

  const helpResources = [
    {
      title: 'Documentation',
      description: 'Browse our comprehensive documentation',
      icon: Book,
      link: '/docs',
      external: false,
    },
    {
      title: 'Community',
      description: 'Join our community forum',
      icon: MessageCircle,
      link: '/community',
      external: false,
    },
    {
      title: 'Contact Support',
      description: 'Get in touch with our support team',
      icon: Mail,
      link: 'mailto:support@example.com',
      external: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-2">
          Find answers to your questions and get support
        </p>
      </div>

      {/* Navigation Test */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Test</CardTitle>
          <CardDescription>
            Test client-side navigation between pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigation.push('/dashboard')}>Go to Dashboard</Button>
            <Button variant="outline" onClick={() => navigation.push('/settings')}>Go to Settings</Button>
            <Button variant="outline" onClick={() => navigation.push('/profile')}>Go to Profile</Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ✅ If navigation is instant without page reload, client-side navigation works!
          </p>
        </CardContent>
      </Card>

      {/* Help Resources */}
      <div className="grid gap-6 md:grid-cols-3">
        {helpResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.title} className="hover:border-[#6366f1] transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-[#6366f1]/10 rounded-lg">
                    <Icon className="h-5 w-5 text-[#6366f1]" />
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.description}
                </p>
                {resource.external ? (
                  <a
                    href={resource.link}
                    className="inline-flex items-center text-sm font-medium text-[#6366f1] hover:underline"
                  >
                    Visit
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                ) : (
                  <button
                    onClick={() => navigation.push(resource.link)}
                    className="inline-flex items-center text-sm font-medium text-[#6366f1] hover:underline"
                  >
                    Visit
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">How do I change my language?</h3>
            <p className="text-sm text-muted-foreground">
              Go to Settings and select your preferred language from the dropdown.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">How do I switch themes?</h3>
            <p className="text-sm text-muted-foreground">
              Click the theme icon in the header or go to Settings to choose between Light, Dark, or System theme.
            </p>
          </div>
          <div className="pb-4">
            <h3 className="font-medium mb-2">Where can I update my profile?</h3>
            <p className="text-sm text-muted-foreground">
              Navigate to the Profile page from the sidebar to view and edit your information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}