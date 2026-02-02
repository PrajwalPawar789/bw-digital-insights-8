
import { useParams, Link } from 'react-router-dom';
import { useLeadershipBySlug } from '@/hooks/useLeadership';
import { ChevronLeft, Linkedin, Twitter, Mail, Loader2, Award, Building2, MapPin, Calendar, Globe, Quote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Seo from "@/components/seo/Seo";
import {
  buildBreadcrumbSchema,
  buildProfileSchema,
  getSiteOrigin,
  toAbsoluteUrl,
  truncateText,
} from "@/lib/seo";

const LeadershipProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: leader, isLoading, error } = useLeadershipBySlug(slug || '');

  if (isLoading) {
    return (
      <>
        <Seo title="Leadership profile" noindex />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-insightRed" />
            <span className="text-lg">Loading profile...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !leader) {
    return (
      <>
        <Seo title="Profile not found" noindex />
        <div className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-insightBlack mb-4">Profile Not Found</h1>
            <p className="mb-6">The leadership profile you're looking for doesn't exist.</p>
            <Link to="/leadership">
              <Button className="bg-insightRed hover:bg-red-700">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Leadership Team
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin && slug ? `${siteOrigin}/leadership/${slug}` : undefined;
  const seoImage = toAbsoluteUrl(
    leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500',
    siteOrigin
  );
  const baseDescription = leader.bio || `${leader.name} leadership profile.`;
  const seoDescription = truncateText(baseDescription);
  const sameAs = [leader.linkedin_url, leader.twitter_url].filter(Boolean) as string[];

  const breadcrumbSchema = siteOrigin
    ? buildBreadcrumbSchema([
        { name: "Home", url: siteOrigin },
        { name: "Leadership", url: `${siteOrigin}/leadership` },
        { name: leader.name, url: canonicalUrl || `${siteOrigin}${window.location.pathname}` },
      ])
    : undefined;

  const profileSchema = buildProfileSchema({
    name: leader.name,
    description: seoDescription,
    image: seoImage,
    jobTitle: leader.title,
    worksFor: leader.company,
    url: canonicalUrl,
    sameAs,
  });

  return (
    <>
      <Seo
        title={leader.name}
        description={baseDescription}
        image={seoImage}
        type="profile"
        schema={[...(breadcrumbSchema ? [breadcrumbSchema] : []), profileSchema]}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-insightBlack via-gray-900 to-insightBlack text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-insightRed/30 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/leadership"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Leadership Directory
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <Badge className="mb-6 bg-insightRed/20 text-insightRed border-insightRed/30 text-sm px-4 py-2">
                EXECUTIVE PROFILE
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{leader.name}</h1>
              <h2 className="text-2xl md:text-3xl text-insightRed font-semibold mb-4">{leader.title}</h2>
              {leader.company && (
                <p className="text-xl text-gray-300 mb-6 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  {leader.company}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 mb-8">
                {leader.linkedin_url && (
                  <a
                    href={leader.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    Connect on LinkedIn
                  </a>
                )}
                {leader.twitter_url && (
                  <a
                    href={leader.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    Follow on Twitter
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="relative">
                <img
                  src={leader.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500'}
                  alt={leader.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Executive Summary */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Quote className="h-6 w-6 text-insightRed" />
                <Badge variant="outline" className="border-insightRed text-insightRed">
                  EXECUTIVE SUMMARY
                </Badge>
              </div>
              <CardTitle className="text-2xl text-insightBlack">Leadership Excellence</CardTitle>
              <CardDescription className="text-lg">
                Strategic vision that drives transformation and sustainable growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-insightRed pl-6">
                "{leader.bio.split('\n')[0]}"
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Detailed Biography */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-insightBlack flex items-center">
                  <Award className="h-6 w-6 mr-2 text-insightRed" />
                  Professional Journey
                </CardTitle>
                <CardDescription>
                  A comprehensive look at career achievements and leadership impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {leader.bio.split('\n').map((paragraph, index) => (
                  <div key={index}>
                    {index === 0 ? (
                      <p className="text-lg text-gray-800 leading-relaxed font-medium">
                        {/* {paragraph} */}
                      </p>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Professional Highlights */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-insightBlack">Current Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-insightRed mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{leader.title}</p>
                    {leader.company && (
                      <p className="text-gray-600">{leader.company}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-insightBlack">Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Strategic Leadership', 'Digital Transformation', 'Innovation Management', 'Global Operations', 'Sustainable Growth'].map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-insightBlack">Industry Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Years of Experience</span>
                  <span className="font-semibold">20+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Companies Led</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Global Teams</span>
                  <span className="font-semibold">5,000+</span>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Connect Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-insightRed/5 to-red-50">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-insightBlack mb-4">Connect with {leader.name.split(' ')[0]}</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of business leaders who follow {leader.name.split(' ')[0]}'s insights on strategic leadership, 
                industry trends, and business transformation.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {leader.linkedin_url && (
                  <a
                    href={leader.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Linkedin className="w-5 h-5 mr-3" />
                    Connect on LinkedIn
                  </a>
                )}
                {leader.twitter_url && (
                  <a
                    href={leader.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-400 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Twitter className="w-5 h-5 mr-3" />
                    Follow on Twitter
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default LeadershipProfile;
