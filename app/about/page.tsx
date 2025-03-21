import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    bio: 'Leading innovation in AI technology for over 15 years.',
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    bio: 'Expert in machine learning and artificial intelligence.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Research',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    bio: 'Pioneering research in natural language processing.',
  },
  {
    name: 'David Kim',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    bio: 'Passionate about creating intuitive AI interfaces.',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20">
      <section className="py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Tridiagonal Solutions</h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                We're on a mission to make artificial intelligence accessible and beneficial for everyone. Our team of experts works tirelessly to develop cutting-edge AI solutions that solve real-world problems.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978"
                alt="Team Meeting"
                width={600}
                height={400}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">Our Mission</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Pushing the boundaries of what's possible with AI technology.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Making AI tools available and understandable for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">Our Team</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6">
                  <div className="aspect-square overflow-hidden rounded-full mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-gray-500 dark:text-gray-400">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}