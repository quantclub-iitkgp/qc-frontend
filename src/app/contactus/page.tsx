"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, ChevronRight, TrendingUp, BarChart4, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Import some star components
import Star1 from "@/examples/stars/s1";
import Star6 from "@/examples/stars/s6";
import Star9 from "@/examples/stars/s9";
import Star13 from "@/examples/stars/s13";
import Star21 from "@/examples/stars/s21";
import Star29 from "@/examples/stars/s29";
import Star32 from "@/examples/stars/s32";
import Star35 from "@/examples/stars/s35";

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

const StarBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Add various stars with different animations */}
      <AnimatedStar StarComponent={Star1} size={24} color="rgba(59, 130, 246, 0.1)" initialX="5%" initialY="15%" animateY={-20} duration={8} />
      <AnimatedStar StarComponent={Star6} size={30} color="rgba(59, 130, 246, 0.15)" initialX="15%" initialY="40%" animateY={30} duration={12} delay={2} />
      <AnimatedStar StarComponent={Star9} size={18} color="rgba(59, 130, 246, 0.1)" initialX="25%" initialY="70%" animateX={20} duration={10} delay={1} />
      <AnimatedStar StarComponent={Star13} size={28} color="rgba(59, 130, 246, 0.12)" initialX="40%" initialY="20%" animateY={-15} duration={9} delay={3} />
      <AnimatedStar StarComponent={Star21} size={22} color="rgba(59, 130, 246, 0.1)" initialX="60%" initialY="65%" animateY={20} duration={11} />
      <AnimatedStar StarComponent={Star29} size={32} color="rgba(59, 130, 246, 0.15)" initialX="75%" initialY="30%" animateX={-20} duration={10} delay={2} />
      <AnimatedStar StarComponent={Star32} size={20} color="rgba(59, 130, 246, 0.1)" initialX="85%" initialY="75%" animateY={-25} duration={8} delay={1.5} />
      <AnimatedStar StarComponent={Star35} size={26} color="rgba(59, 130, 246, 0.12)" initialX="90%" initialY="10%" animateY={15} duration={9} delay={0.5} />
      <AnimatedStar StarComponent={Star1} size={16} color="rgba(59, 130, 246, 0.1)" initialX="10%" initialY="85%" animateX={15} duration={7} delay={1} />
      <AnimatedStar StarComponent={Star6} size={24} color="rgba(59, 130, 246, 0.12)" initialX="55%" initialY="45%" animateY={-10} duration={8.5} delay={2.5} />
    </div>
  );
};

const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute rounded-full bg-blue-500 opacity-20"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
          }}
        />
      ))}
    </div>
  );
};

const ChartAnimation = ({ className }: { className?: string }) => {
  const points = Array.from({ length: 10 }, () => Math.random() * 80 + 10);
  
  return (
    <motion.div 
      className={`${className} absolute z-0 opacity-10`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 1 }}
    >
      <svg width="400" height="200" viewBox="0 0 400 200">
        <motion.path
          d={`M 0,${200 - points[0]} ${points.map((point, i) => 
            `L ${(i+1) * 40},${200 - point}`).join(" ")}`}
          stroke="#0066FF"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d={`M 0,${200 - (points[0] * 0.7)} ${points.map((point, i) => 
            `L ${(i+1) * 40},${200 - (point * 0.7)}`).join(" ")}`}
          stroke="#00AAFF"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>
    </motion.div>
  );
};

const CandlestickChart = ({ className }: { className?: string }) => {
  const candles = Array.from({ length: 12 }, () => ({
    open: Math.random() * 50 + 25,
    close: Math.random() * 50 + 25,
    high: Math.random() * 20 + 80,
    low: Math.random() * 20,
  }));

  return (
    <motion.div 
      className={`${className} absolute z-0 opacity-10`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 1 }}
    >
      <svg width="400" height="200" viewBox="0 0 400 200">
        {candles.map((candle, i) => (
          <g key={i} transform={`translate(${i * 30 + 20}, 0)`}>
            <motion.line
              x1="10"
              y1={200 - candle.high}
              x2="10"
              y2={200 - candle.low}
              stroke="#666"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
            <motion.rect
              x="5"
              y={200 - Math.max(candle.open, candle.close)}
              width="10"
              height={Math.abs(candle.open - candle.close)}
              fill={candle.open > candle.close ? "#f44336" : "#4caf50"}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
};

const FloatingIcon = ({ 
  icon: Icon, 
  top, 
  left, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  top: string; 
  left: string; 
  delay?: number;
}) => {
  return (
    <motion.div
      className="absolute text-blue-500/30 z-0"
      style={{ top, left }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ 
        y: [0, -15, 0], 
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{ 
        duration: 5, 
        repeat: Infinity,
        delay,
      }}
    >
      <Icon size={28} />
    </motion.div>
  );
};

export default function ContactPage() {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="pt-20 pb-16">  {/* Added padding top to avoid navbar overlap */}
      <StarBackground />
      <div className="container max-w-7xl mx-auto relative min-h-[80vh]">
        <ParticleBackground />
        
        <ChartAnimation className="top-20 right-0 lg:block hidden" />
        <ChartAnimation className="bottom-20 left-0 lg:block hidden" />
        <CandlestickChart className="top-40 left-20 lg:block hidden" />
        
        <FloatingIcon icon={TrendingUp} top="15%" left="10%" delay={0} />
        <FloatingIcon icon={BarChart4} top="75%" left="85%" delay={1} />
        <FloatingIcon icon={LineChart} top="30%" left="75%" delay={2} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative z-10"
        >
          <h1 className="text-4xl font-bold mb-4">Contact Quant Club</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about quantitative finance, algorithmic trading, or our research? 
            Our team is here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-2">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          placeholder="John Doe" 
                          value={formState.name} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          value={formState.email} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        placeholder="How can we help?" 
                        value={formState.subject} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        placeholder="Write your message here..." 
                        className="min-h-[150px]" 
                        value={formState.message} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <div className="animate-spin w-5 h-5 border-2 border-t-transparent rounded-full" />
                        </motion.div>
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full border-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to reach our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground mt-1">info@quantclub.ai</p>
                    <p className="text-sm text-muted-foreground">support@quantclub.ai</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground mt-1">+1 (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 9:00-17:00 EST</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Research Lab, AI Center
                    </p>
                    <p className="text-sm text-muted-foreground">
                      55 Quantum Avenue, Suite 101
                    </p>
                    <p className="text-sm text-muted-foreground">
                      New York, NY 10001
                    </p>
                  </div>
                </motion.div>
              </CardContent>
              <CardFooter>
                <Button variant="neutral" className="w-full group">
                  View on Map
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          className="mt-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about our services and research</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What research areas does Quant Club focus on?",
                    answer: "Our research primarily focuses on algorithmic trading, market microstructure, machine learning applications in finance, and risk modeling."
                  },
                  {
                    question: "Do you offer internship opportunities?",
                    answer: "Yes, we offer internships for students with strong backgrounds in mathematics, computer science, or finance."
                  },
                  {
                    question: "How can I collaborate on research projects?",
                    answer: "Researchers interested in collaboration can reach out with a proposal outlining research interests and potential project ideas."
                  },
                  {
                    question: "Do you provide API access to your data?",
                    answer: "We offer limited API access to our historical market data for academic and research purposes upon request."
                  },
                ].map((faq, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-medium">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
