import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Award, PiggyBank } from "lucide-react";
import TestCamera from "@/components/TestCamera";

const mockTests = {
  "1": {
    questions: [
      {
        id: 1,
        question: "What is Python?",
        options: [
          "A high-level programming language",
          "A database management system",
          "An operating system",
          "A web browser"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which of the following is a Python data type?",
        options: [
          "Integer",
          "Float",
          "String",
          "All of the above"
        ],
        correctAnswer: 3
      },
      {
        id: 3,
        question: "How do you create a function in Python?",
        options: [
          "function myFunction():",
          "def myFunction():",
          "create myFunction():",
          "func myFunction():"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "How do you create a comment in Python?",
        options: [
          "// This is a comment",
          "/* This is a comment */",
          "# This is a comment",
          "-- This is a comment"
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "Which of these is NOT a valid Python variable name?",
        options: [
          "my_var",
          "_myvar",
          "1var",
          "myVar"
        ],
        correctAnswer: 2
      }
    ]
  },
  "2": {
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Machine Learning",
          "Hyperlinks and Text Markup Language",
          "Home Tool Markup Language"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which CSS property is used to change the text color?",
        options: [
          "font-color",
          "text-color",
          "color",
          "text-style"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Which JavaScript method is used to remove the last element from an array?",
        options: [
          "pop()",
          "push()",
          "shift()",
          "unshift()"
        ],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "Which of these is NOT a valid way to declare a variable in JavaScript?",
        options: [
          "var x = 5;",
          "let y = 10;",
          "const z = 15;",
          "variable w = 20;"
        ],
        correctAnswer: 3
      },
      {
        id: 5,
        question: "What is the correct CSS syntax for making all paragraph elements bold?",
        options: [
          "p {text-weight: bold;}",
          "p {font-weight: bold;}",
          "<p style='font-size: bold;'>",
          "p.all {font-weight: bold;}"
        ],
        correctAnswer: 1
      }
    ]
  }
};

const FinalTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  
  const [testData, setTestData] = React.useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = React.useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [courseTitle, setCourseTitle] = React.useState('');
  const [coursePrice, setCoursePrice] = React.useState(0);
  const [courseData, setCourseData] = React.useState<any>(null);
  const [refundAmount, setRefundAmount] = React.useState(0);
  
  React.useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to take this test",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    const storedCoursesString = localStorage.getItem('enrolledCourses');
    if (!storedCoursesString) {
      toast({
        title: "Not enrolled",
        description: "You are not enrolled in any courses",
        variant: "destructive"
      });
      navigate("/courses");
      return;
    }
    
    try {
      const storedCourses = JSON.parse(storedCoursesString);
      const enrolledCourse = storedCourses.find((course: any) => course.id === id);
      
      if (!enrolledCourse) {
        toast({
          title: "Not enrolled",
          description: "You are not enrolled in this course",
          variant: "destructive"
        });
        navigate("/courses");
        return;
      }
      
      setCourseTitle(enrolledCourse.title);
      setCoursePrice(enrolledCourse.price);
      setCourseData(enrolledCourse);
      
      const test = mockTests[id as keyof typeof mockTests];
      if (test) {
        setTestData(test);
        setSelectedAnswers(new Array(test.questions.length).fill(-1));
      } else {
        toast({
          title: "Test not found",
          description: "The final test for this course is not available",
          variant: "destructive"
        });
        navigate(`/courses/${id}`);
      }
    } catch (error) {
      console.error("Error loading test data:", error);
      toast({
        title: "Error",
        description: "There was an error loading the test",
        variant: "destructive"
      });
      navigate("/courses");
    }
  }, [id, isLoggedIn, navigate, toast]);
  
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (isSubmitted) return;
    
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = () => {
    const unansweredQuestions = selectedAnswers.filter(answer => answer === -1).length;
    
    if (unansweredQuestions > 0) {
      toast({
        title: "Incomplete test",
        description: `You have ${unansweredQuestions} unanswered questions`,
        variant: "destructive"
      });
      return;
    }
    
    let correctAnswers = 0;
    testData.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const scorePercentage = Math.round((correctAnswers / testData.questions.length) * 100);
    setScore(scorePercentage);
    
    const refund = (scorePercentage / 100) * coursePrice;
    setRefundAmount(refund);
    
    const storedCoursesString = localStorage.getItem('enrolledCourses');
    if (storedCoursesString) {
      try {
        const storedCourses = JSON.parse(storedCoursesString);
        const updatedCourses = storedCourses.map((course: any) => {
          if (course.id === id) {
            return {
              ...course,
              hasTakenTest: true,
              testScore: scorePercentage,
              refundAmount: refund,
              price: coursePrice,
              title: courseTitle
            };
          }
          return course;
        });
        
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedCourses));
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error("Error updating test results:", error);
      }
    }
    
    setIsSubmitted(true);
    
    toast({
      title: "Test Submitted",
      description: `You scored ${scorePercentage}% and earned a refund of ₹${refund.toFixed(2)}`,
    });
  };
  
  if (!testData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 md:px-6 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading Test</h1>
            <p className="mb-6">Please wait while we load your final assessment.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 md:px-6 py-12 flex items-center justify-center">
          <Card className="w-full max-w-3xl glass">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Test Results</CardTitle>
              <p className="text-muted-foreground">
                {courseTitle} Final Assessment
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <div className="relative inline-flex">
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-4xl font-bold">{score}%</span>
                    </div>
                    {score >= 90 ? (
                      <div className="absolute -top-2 -right-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full p-1">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    ) : null}
                  </div>
                </div>
                <p className="text-xl font-medium">
                  {score >= 90 ? "Excellent!" : score >= 70 ? "Good Job!" : "Keep Learning!"}
                </p>
                <p className="text-muted-foreground">
                  You answered {selectedAnswers.filter((answer, index) => answer === testData.questions[index].correctAnswer).length} out of {testData.questions.length} questions correctly.
                </p>
              </div>
              
              <div className="space-y-4 bg-muted/30 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <PiggyBank className="h-5 w-5 text-primary" />
                      Refund Details
                    </h3>
                    <p className="text-sm text-muted-foreground">Based on your score of {score}%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Course Price:</span>
                    <span>₹{coursePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-primary">
                    <span>Your Refund ({score}%):</span>
                    <span>₹{refundAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Final Cost:</span>
                    <span>₹{(coursePrice - refundAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-primary" />
                  Certificate
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {score >= 60 ? 
                    "Congratulations! You've qualified for a certificate of completion." : 
                    "You need a score of at least 60% to qualify for a certificate."}
                </p>
                <Button 
                  className="w-full" 
                  disabled={score < 60}
                  variant={score >= 60 ? "default" : "outline"}
                >
                  {score >= 60 ? "Download Certificate" : "Certificate Unavailable"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/my-courses")} className="w-full">
                Return to My Courses
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const currentQuestionData = testData.questions[currentQuestion];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Final Assessment: {courseTitle}</h1>
            <p className="text-muted-foreground">
              Complete this assessment to test your knowledge and earn your performance-based refund.
            </p>
          </div>
          
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">
                  Question {currentQuestion + 1} of {testData.questions.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {selectedAnswers.filter(a => a !== -1).length} of {testData.questions.length} answered
                </span>
              </div>
              <Progress 
                value={(currentQuestion + 1) / testData.questions.length * 100} 
                className="h-2"
              />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium mb-4">
                    {currentQuestionData.question}
                  </h2>
                  
                  <RadioGroup
                    value={selectedAnswers[currentQuestion].toString()}
                    onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
                    className="space-y-4"
                  >
                    {currentQuestionData.options.map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem id={`q${currentQuestion}-option${index}`} value={index.toString()} />
                        <Label htmlFor={`q${currentQuestion}-option${index}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion < testData.questions.length - 1 ? (
                <Button onClick={handleNextQuestion}>
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="default"
                >
                  Submit Test
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <TestCamera />
      <Footer />
    </div>
  );
};

export default FinalTest;
