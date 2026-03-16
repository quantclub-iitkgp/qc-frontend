"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send, ChevronRight, TrendingUp, BarChart4, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

import Star1 from "@/examples/stars/s1"
import Star6 from "@/examples/stars/s6"
import Star9 from "@/examples/stars/s9"
import Star13 from "@/examples/stars/s13"
import Star21 from "@/examples/stars/s21"
import Star29 from "@/examples/stars/s29"
import Star32 from "@/examples/stars/s32"
import Star35 from "@/examples/stars/s35"

const AnimatedStar = ({
  StarComponent,
  size,
  color,
  initialX,
  initialY,
  animateX,
  animateY,
  duration,
  delay = 0,
}: {
  StarComponent: React.ComponentType<any>
  size: number
  color: string
  initialX: string | number
  initialY: string | number
  animateX?: string | number
  animateY?: string | number
  duration: number
  delay?: number
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
        ease: "easeInOut",
      }}
    >
      <StarComponent size={size} color={color} />
    </motion.div>
  )
}

// Scoped to the page container (not fixed) to prevent leaking to other pages
const StarBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatedStar StarComponent={Star1} size={24} color="var(--color-main)" initialX="5%" initialY="15%" animateY={-20} duration={8} />
      <AnimatedStar StarComponent={Star6} size={30} color="var(--color-main)" initialX="15%" initialY="40%" animateY={30} duration={12} delay={2} />
      <AnimatedStar StarComponent={Star9} size={18} color="var(--color-main)" initialX="25%" initialY="70%" animateX={20} duration={10} delay={1} />
      <AnimatedStar StarComponent={Star13} size={28} color="var(--color-main)" initialX="40%" initialY="20%" animateY={-15} duration={9} delay={3} />
      <AnimatedStar StarComponent={Star21} size={22} color="var(--color-main)" initialX="60%" initialY="65%" animateY={20} duration={11} />
      <AnimatedStar StarComponent={Star29} size={32} color="var(--color-main)" initialX="75%" initialY="30%" animateX={-20} duration={10} delay={2} />
      <AnimatedStar StarComponent={Star32} size={20} color="var(--color-main)" initialX="85%" initialY="75%" animateY={-25} duration={8} delay={1.5} />
      <AnimatedStar StarComponent={Star35} size={26} color="var(--color-main)" initialX="90%" initialY="10%" animateY={15} duration={9} delay={0.5} />
      <AnimatedStar StarComponent={Star1} size={16} color="var(--color-main)" initialX="10%" initialY="85%" animateX={15} duration={7} delay={1} />
      <AnimatedStar StarComponent={Star6} size={24} color="var(--color-main)" initialX="55%" initialY="45%" animateY={-10} duration={8.5} delay={2.5} />
    </div>
  )
}

// Seeded particles using useMemo to avoid hydration mismatch
const ParticleBackground = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const seed = (i * 7 + 13) % 100
        const seed2 = (i * 11 + 37) % 100
        const seed3 = (i * 3 + 61) % 100
        return {
          id: i,
          x: `${seed}%`,
          y: `${seed2}%`,
          size: (seed3 % 8) + 4,
          duration: 15 + (i % 12),
        }
      }),
    [],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-main opacity-10"
          style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (p.id % 5) * 0.8,
          }}
        />
      ))}
    </div>
  )
}

const FloatingIcon = ({
  icon: Icon,
  top,
  left,
  delay = 0,
}: {
  icon: React.ElementType
  top: string
  left: string
  delay?: number
}) => {
  return (
    <motion.div
      className="absolute text-main/30 z-0"
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
  )
}

export default function ContactPage() {
  const { toast } = useToast()
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    })

    setFormState({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="pt-[70px] pb-16 bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] min-h-dvh">
      <div className="container max-w-7xl mx-auto relative px-5 py-12">
        <StarBackground />
        <ParticleBackground />

        <FloatingIcon icon={TrendingUp} top="15%" left="10%" delay={0} />
        <FloatingIcon icon={BarChart4} top="75%" left="85%" delay={1} />
        <FloatingIcon icon={LineChart} top="30%" left="75%" delay={2} />

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative z-10"
        >
          <h1 className="text-4xl font-bold font-heading mb-4">Contact Quant Club</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Have questions about quantitative finance, algorithmic trading, or our research?
            Our team is here to help.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {/* Contact form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-4 border-border shadow-shadow">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription className="text-foreground/60">
                  Fill out the form below and we&apos;ll get back to you shortly.
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
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        />
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

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full border-4 border-border shadow-shadow">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription className="text-foreground/60">
                  Multiple ways to reach our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <div className="bg-main/10 border-4 border-border p-2 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-main" />
                  </div>
                  <div>
                    <h3 className="font-medium font-heading">Email</h3>
                    <p className="text-sm text-foreground/60 mt-1">info@quantclub.ai</p>
                    <p className="text-sm text-foreground/60">support@quantclub.ai</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <div className="bg-main/10 border-4 border-border p-2 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-main" />
                  </div>
                  <div>
                    <h3 className="font-medium font-heading">Phone</h3>
                    <p className="text-sm text-foreground/60 mt-1">+91 (xxx) xxx-xxxx</p>
                    <p className="text-sm text-foreground/60">Mon–Fri, 9:00–17:00 IST</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <div className="bg-main/10 border-4 border-border p-2 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-main" />
                  </div>
                  <div>
                    <h3 className="font-medium font-heading">Location</h3>
                    <p className="text-sm text-foreground/60 mt-1">
                      Indian Institute of Technology
                    </p>
                    <p className="text-sm text-foreground/60">Kharagpur, West Bengal 721302</p>
                    <p className="text-sm text-foreground/60">India</p>
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

        {/* FAQ section */}
        <motion.div
          className="mt-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-4 border-border shadow-shadow">
            <CardHeader className="text-center">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription className="text-foreground/60">
                Common questions about our services and research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    question: "What research areas does Quant Club focus on?",
                    answer:
                      "Our research primarily focuses on algorithmic trading, market microstructure, machine learning applications in finance, and risk modeling.",
                  },
                  {
                    question: "Do you offer internship opportunities?",
                    answer:
                      "Yes, we offer internships for students with strong backgrounds in mathematics, computer science, or finance.",
                  },
                  {
                    question: "How can I collaborate on research projects?",
                    answer:
                      "Researchers interested in collaboration can reach out with a proposal outlining research interests and potential project ideas.",
                  },
                  {
                    question: "Do you provide API access to your data?",
                    answer:
                      "We offer limited API access to our historical market data for academic and research purposes upon request.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <h3 className="font-medium font-heading">{faq.question}</h3>
                    <p className="text-sm text-foreground/60">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
