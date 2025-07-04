"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Upload,
  MessageSquare,
  FileText,
  Zap,
  Shield,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-sky-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              PDFChat
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-sky-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-gray-600 hover:text-sky-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-gray-600 hover:text-sky-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-sky-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-4"
          >
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-sky-600 hover:text-sky-700"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                Get Started
              </Button>
            </SignUpButton>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-sky-100 py-4 px-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-sky-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-sky-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-gray-600 hover:text-sky-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-sky-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-sky-100">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sky-600 hover:text-sky-700"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full justify-center bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-7xl font-bold mb-6"
            >
              Your AI-Powered
              <span className="block bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                PDF Assistant
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your PDFs into interactive conversations. Upload, chat,
              and get instant insights from your documents with the power of AI.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-4 text-lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Start for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-sky-200 text-sky-600 hover:bg-sky-50 px-8 py-4 text-lg bg-transparent"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center space-x-8 text-sm text-gray-500"
            >
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-sky-500 mr-2" />
                AI-Powered Analysis
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-sky-500 mr-2" />
                Secure & Private
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <Card className="bg-white/60 backdrop-blur-sm border-sky-100 shadow-2xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Document Analysis
                      </h3>
                      <span className="text-2xl font-bold text-sky-600">
                        94%
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Content Understanding
                        </span>
                        <span className="text-gray-800">85%</span>
                      </div>
                      <div className="w-full bg-sky-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Query Accuracy</span>
                        <span className="text-gray-800">92%</span>
                      </div>
                      <div className="w-full bg-sky-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Response Speed</span>
                        <span className="text-gray-800">98%</span>
                      </div>
                      <div className="w-full bg-sky-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full"
                          style={{ width: "98%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl p-6 text-white">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="w-6 h-6 mr-2" />
                      <span className="font-semibold">Live Chat Preview</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="bg-white/20 rounded-lg p-3">
                        <p>{"What's the main topic of this document?"}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p>
                          This document discusses advanced machine learning
                          techniques for natural language processing...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to transform your PDFs into intelligent
              conversations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Easy Upload",
                description:
                  "Drag and drop your PDFs or click to upload. Support for multiple file formats and sizes.",
              },
              {
                icon: MessageSquare,
                title: "Smart Chat",
                description:
                  "Ask questions about your documents and get instant, contextual answers powered by AI.",
              },
              {
                icon: FileText,
                title: "Document Viewer",
                description:
                  "Built-in PDF viewer with highlighting and annotation features for better understanding.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Get responses in seconds with our optimized AI processing and caching system.",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your documents are encrypted and never stored permanently. Complete privacy guaranteed.",
              },
              {
                icon: Star,
                title: "Premium Quality",
                description:
                  "Advanced AI models ensure accurate and helpful responses to all your questions.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/60 backdrop-blur-sm border-sky-100 hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white/40">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "5 PDF uploads per month",
                  "Basic chat functionality",
                  "Standard support",
                ],
                popular: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "per month",
                features: [
                  "Unlimited PDF uploads",
                  "Advanced AI responses",
                  "Priority support",
                  "Export conversations",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$49",
                period: "per month",
                features: [
                  "Everything in Pro",
                  "Team collaboration",
                  "API access",
                  "Custom integrations",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`relative ${
                    plan.popular
                      ? "ring-2 ring-sky-400 bg-white"
                      : "bg-white/60 backdrop-blur-sm"
                  } border-sky-100 hover:shadow-lg transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-sky-600">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="w-5 h-5 text-sky-500 mr-3" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                          : "bg-sky-50 text-sky-600 hover:bg-sky-100"
                      }`}
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Ready to Transform Your PDFs?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Join thousands of users who are already having intelligent
              conversations with their documents.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-12 py-4 text-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PDFChat</span>
              </div>
              <p className="text-gray-400">
                Transform your PDFs into intelligent conversations with AI.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PDFChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <div className="error-text">Error</div>
    </div>
  );
}
