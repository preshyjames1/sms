import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  GraduationCap,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  School,
  UserCheck,
  Zap,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <School className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">SchoolManagementSystem.com</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 animate-fade-in">
              <Zap className="mr-1" />
              Complete School Management Solution
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6 animate-fade-in-up">
              Transform Your School with
              <span className="text-primary"> Smart Management</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8 animate-fade-in-up [animation-delay:200ms]">
              Streamline academics, attendance, communication, and administration with our comprehensive multi-tenant
              platform designed for modern educational institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:400ms]">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Watch Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4 animate-fade-in-up [animation-delay:600ms]">
              No credit card required • 14-day free trial • Setup in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">
              Everything You Need to Manage Your School
            </h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              From student enrollment to academic reports, our platform covers every aspect of school administration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Multi-Role Management",
                description:
                  "Manage admins, teachers, students, parents, and staff with role-based permissions and secure access control.",
              },
              {
                icon: GraduationCap,
                title: "Academic Excellence",
                description:
                  "Track classes, subjects, assignments, exams, and grades with comprehensive academic management tools.",
              },
              {
                icon: UserCheck,
                title: "Attendance Tracking",
                description:
                  "Monitor student and staff attendance with manual entry and biometric integration support.",
              },
              {
                icon: MessageSquare,
                title: "Communication Hub",
                description:
                  "Enable seamless communication between teachers, students, and parents with messaging and notifications.",
              },
              {
                icon: BarChart3,
                title: "Analytics & Reports",
                description:
                  "Generate detailed performance reports, attendance summaries, and custom analytics dashboards.",
              },
              {
                icon: Shield,
                title: "Multi-Tenant Security",
                description:
                  "Each school operates in its own secure space with complete data isolation and privacy protection.",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">
              Built for Every Member of Your School Community
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  role: "School Administrators",
                  benefits: ["Complete school oversight", "Staff management", "Financial tracking", "Custom reports"],
                },
                {
                  role: "Teachers",
                  benefits: ["Class management", "Grade tracking", "Assignment distribution", "Parent communication"],
                },
                {
                  role: "Students & Parents",
                  benefits: ["Real-time updates", "Grade monitoring", "Attendance tracking", "Direct messaging"],
                },
              ].map((group, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">{group.role}</h3>
                  <ul className="space-y-2">
                    {group.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
                <School className="h-24 w-24 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Join hundreds of schools already using our platform to streamline their operations.
                </p>
                <Link href="/auth/register">
                  <Button size="lg" className="w-full">
                    Create Your School Account
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Trusted by Educational Leaders</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Principal, Greenwood Academy",
                content:
                  "This platform has revolutionized how we manage our school. The multi-tenant architecture gives us complete control while maintaining security.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "IT Director, Riverside School District",
                content:
                  "Implementation was seamless, and the support team is exceptional. Our teachers love the intuitive interface and comprehensive features.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Administrator, St. Mary's High School",
                content:
                  "The reporting capabilities are outstanding. We can track everything from attendance to academic performance with detailed analytics.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">
            Ready to Transform Your School Management?
          </h2>
          <p className="text-xl text-primary-foreground/80 text-balance mb-8 max-w-2xl mx-auto">
            Join thousands of educators who have streamlined their school operations with our comprehensive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Your Free Trial
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <School className="h-6 w-6 text-primary" />
                <span className="font-bold">SchoolManagementSystem.com</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering educational institutions with comprehensive management solutions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-foreground transition-colors">
                    System Status
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SchoolManagementSystem.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
