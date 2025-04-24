import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatBot from '@/components/ChatBot';

const courseMaterials = {
  "1": [
    { 
      title: "Python Basics", 
      content: "Python is a high-level, interpreted programming language known for its readability and versatility. This section covers variables, data types, and basic syntax." 
    },
    { 
      title: "Control Flow", 
      content: "Learn about if statements, loops, and conditional expressions to control the flow of your Python programs." 
    },
    { 
      title: "Functions and Modules", 
      content: "Discover how to write reusable code blocks with functions and organize your code into modules." 
    }
  ],
  "2": [
    { 
      title: "HTML Fundamentals", 
      content: "HTML provides the structure for web pages. Learn about tags, attributes, and how to create well-formed HTML documents." 
    },
    { 
      title: "CSS Styling", 
      content: "CSS allows you to style your HTML elements. Explore selectors, properties, and how to create responsive designs." 
    },
    { 
      title: "JavaScript Basics", 
      content: "JavaScript adds interactivity to websites. Learn about variables, functions, DOM manipulation, and event handling." 
    }
  ],
  "3": [
    { 
      title: "R Introduction", 
      content: "R is a programming language designed for statistical computing and graphics. Learn the basics of R syntax and data structures." 
    },
    { 
      title: "Data Manipulation", 
      content: "Discover how to clean, transform, and analyze data using R packages like dplyr and tidyr." 
    },
    { 
      title: "Data Visualization", 
      content: "Create compelling visualizations with ggplot2 and other R plotting libraries to communicate insights effectively." 
    }
  ],
  "4": [
    { 
      title: "Design Principles", 
      content: "Understand fundamental design principles like contrast, repetition, alignment, and proximity that form the foundation of good UI/UX." 
    },
    { 
      title: "User Research", 
      content: "Learn techniques for gathering user feedback, creating personas, and understanding user needs and behaviors." 
    },
    { 
      title: "Prototyping", 
      content: "Explore tools and methods for creating wireframes and interactive prototypes to test your designs before implementation." 
    }
  ],
  "5": [
    { 
      title: "Marketing Fundamentals", 
      content: "Learn core marketing concepts including target audience, positioning, and creating a marketing strategy." 
    },
    { 
      title: "Social Media Marketing", 
      content: "Discover how to leverage social media platforms for brand building, customer engagement, and driving conversions." 
    },
    { 
      title: "Analytics and Optimization", 
      content: "Learn how to measure campaign performance, analyze data, and optimize your marketing efforts for better results." 
    }
  ],
  "6": [
    { 
      title: "Introduction to ML", 
      content: "Understand the core concepts of machine learning, including supervised vs. unsupervised learning and model evaluation." 
    },
    { 
      title: "Classification Algorithms", 
      content: "Explore popular classification algorithms like decision trees, random forests, and support vector machines." 
    },
    { 
      title: "Neural Networks", 
      content: "Learn about artificial neural networks, backpropagation, and how deep learning is revolutionizing AI applications." 
    }
  ]
};

const MyCourses = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    loadEnrolledCourses();
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn, navigate]);

  const handleStorageChange = (e) => {
    if (e.key === 'enrolledCourses') {
      loadEnrolledCourses();
    }
  };
  
  const loadEnrolledCourses = () => {
    try {
      const storedCourses = localStorage.getItem('enrolledCourses');
      let courses = [];
      
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        
        courses = parsedCourses.map((course) => {
          const materials = courseMaterials[course.id] || [
            { 
              title: "Course Introduction", 
              content: "Welcome to the course! This is an introduction to the main concepts you'll be learning." 
            },
            { 
              title: "Getting Started", 
              content: "In this section, we'll set up your learning environment and prepare for the course material." 
            }
          ];
          
          return {
            ...course,
            materials,
            hasTakenTest: course.hasTakenTest || false,
            testScore: course.testScore || null,
            progress: course.progress || "0%"
          };
        });
      } else {
        courses = [];
      }
      
      setEnrolledCourses(courses);
    } catch (error) {
      console.error("Error loading enrolled courses:", error);
      toast({
        title: "Error",
        description: "Failed to load your enrolled courses",
        variant: "destructive"
      });
    }
  };

  const courseData = selectedCourse !== null 
    ? enrolledCourses.find(course => course.id === selectedCourse) 
    : null;

  if (selectedCourse !== null && courseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCourse(null)} 
            className="mb-4"
          >
            Back to My Courses
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">{courseData.title}</h1>
          <p className="text-muted-foreground mb-6">{courseData.description}</p>
          
          <div className="space-y-6">
            {courseData.materials.map((material, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {material.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{material.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 flex flex-col items-center">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>Final Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Take the test to measure your understanding. Your performance will determine your refund amount - score 90% and get a 90% refund!
                  {courseData.hasTakenTest && (
                    <span className="block mt-2">
                      Previous best score: {courseData.testScore}%
                    </span>
                  )}
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  onClick={() => navigate(`/courses/${courseData.id}/test`)}
                  className="w-full max-w-xs"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {courseData.hasTakenTest ? 'Retake Test' : 'Take Final Test'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <ChatBot />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No courses enrolled yet</h2>
            <p className="text-muted-foreground mb-6">Browse our catalog and enroll in a course to get started</p>
            <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="flex flex-col glass hover-scale hover-glow">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Progress: {course.progress}
                    </p>
                    {course.hasTakenTest && course.testScore !== null && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">Test Score: {course.testScore}%</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    onClick={() => setSelectedCourse(course.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Course Materials
                  </Button>
                  <Button
                    onClick={() => navigate(`/courses/${course.id}/test`)}
                    className="w-full"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {course.hasTakenTest ? 'Retake Test' : 'Take Final Test'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <ChatBot />
      <Footer />
    </div>
  );
};

export default MyCourses;
