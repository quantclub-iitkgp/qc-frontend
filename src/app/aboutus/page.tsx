"use client";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";

import {
  PageDescription,
  PageHeader,
  PageHeading,
  PageWrapper,
} from "@/components/app/page";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import some star components for background animation
import Star1 from "@/examples/stars/s1";
import Star6 from "@/examples/stars/s6";
import Star9 from "@/examples/stars/s9";
import Star13 from "@/examples/stars/s13";
import Star21 from "@/examples/stars/s21";

// Similar to the contact page background
const AnimatedStar = ({ 
  StarComponent, 
  size, 
  color, 
  initialX, 
  initialY,
  animateX,
  animateY,
  duration,
  delay = 0
}: { 
  StarComponent: React.ComponentType<any>;
  size: number;
  color: string;
  initialX: string | number;
  initialY: string | number;
  animateX?: string | number;
  animateY?: string | number;
  duration: number;
  delay?: number;
}) => {
  return (
    <motion.div
      className="absolute z-0 pointer-events-none"
      style={{ 
        top: initialY, 
        left: initialX,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.2, 0.5, 0.2],
        scale: [0.8, 1, 0.8],
        x: animateX ? [0, animateX, 0] : 0,
        y: animateY ? [0, animateY, 0] : 0,
      }}
      transition={{ 
        repeat: Infinity, 
        duration,
        delay,
        ease: "easeInOut" 
      }}
    >
      <StarComponent size={size} color={color} />
    </motion.div>
  );
};



// Team member data
const teamMembers = [
  {
    name: "Dr. Alexandra Chen",
    role: "Chief Quantitative Strategist",
    image: "/team/person1.jpg",
    bio: "Ph.D. in Financial Mathematics from MIT with 12+ years of experience in algorithmic trading systems and market microstructure analysis.",
    github: "https://github.com/alexchen",
    linkedin: "https://linkedin.com/in/alexchen",
    twitter: "https://twitter.com/alexchen",
  },
  {
    name: "Michael Wei",
    role: "Head of Research",
    image: "/team/person2.jpg",
    bio: "Former lead researcher at Renaissance Technologies with expertise in statistical arbitrage and machine learning for financial time series forecasting.",
    github: "https://github.com/michaelwei",
    linkedin: "https://linkedin.com/in/michaelwei",
    twitter: "https://twitter.com/michaelwei",
  },
  {
    name: "Sophia Rodriguez",
    role: "ML Engineer",
    image: "/team/person3.jpg",
    bio: "Specialized in deep reinforcement learning for trading strategies. Published author on neural network applications in market prediction.",
    github: "https://github.com/sophiarod",
    linkedin: "https://linkedin.com/in/sophiarod",
  },
  {
    name: "James Harrison",
    role: "Risk Management Specialist",
    image: "/team/person4.jpg",
    bio: "CFA charterholder with expertise in quantitative risk models and stress testing methodologies for algorithmic trading systems.",
    linkedin: "https://linkedin.com/in/jharrison",
  },
  {
    name: "Anika Patel",
    role: "Data Scientist",
    image: "/team/person5.jpg",
    bio: "Expert in alternative data analysis and NLP for market sentiment extraction. Previously led data science initiatives at Goldman Sachs.",
    github: "https://github.com/anikapatel",
    linkedin: "https://linkedin.com/in/anikapatel",
    twitter: "https://twitter.com/anikapatel",
  },
  {
    name: "David Kim",
    role: "Financial Engineering Lead",
    image: "/team/person6.jpg",
    bio: "Ph.D. in Computer Science specializing in high-frequency trading algorithms and market impact modeling.",
    github: "https://github.com/davidkim",
    linkedin: "https://linkedin.com/in/davidkim",
  },
];

const TeamMemberCard = ({ member }: { member: typeof teamMembers[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden h-full border-2">
        <CardHeader className="pb-2">
          <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <CardTitle>{member.name}</CardTitle>
          <CardDescription className="font-medium text-primary">
            {member.role}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{member.bio}</p>
        </CardContent>
        <CardFooter className="flex gap-2">
          {member.github && (
            <Button variant="noShadow" size="icon" asChild>
              <Link href={member.github}>
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
          )}
          {member.twitter && (
            <Button variant="noShadow" size="icon" asChild>
              <Link href={member.twitter}>
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
          )}
          {member.linkedin && (
            <Button variant="noShadow" size="icon" asChild>
              <Link href={member.linkedin}>
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function AboutUsPage() {
  return (
    <>
      <PageWrapper>
        <PageHeader>
          <PageHeading>About Our Team</PageHeading>
          <PageDescription>
            Meet the quantitative experts behind our algorithmic trading and financial analysis technologies. 
            Our team combines expertise in mathematics, computer science, and finance.
          </PageDescription>
        </PageHeader>

        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Research & Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We strive to advance the field of quantitative finance by developing cutting-edge algorithms and methodologies that redefine how markets are analyzed. Our research team publishes in top journals and collaborates with leading academic institutions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Education & Knowledge Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe in democratizing quantitative finance knowledge through open-source tools, workshops, and educational content that helps traders and researchers implement data-driven investment strategies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-2xl font-bold mb-6">Meet The Team</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="mt-16 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Join Our Team</CardTitle>
              <CardDescription>
                We're always looking for talented individuals passionate about quantitative finance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you're excited about applying mathematical models to financial markets and building the next generation of trading algorithms, we want to hear from you.
              </p>
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Open Positions
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </PageWrapper>
    </>
  );
}
