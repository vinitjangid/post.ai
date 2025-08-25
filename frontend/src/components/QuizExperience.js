import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton,
  Zoom,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  NavigateNext as NavigateNextIcon,
  RestartAlt as RestartIcon,
  AccessTime as ClockIcon,
  EmojiEvents as TrophyIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { getMCQs } from '../services/apiService';

// Constants
const QUESTIONS_PER_QUIZ = 10;
const TIME_PER_QUESTION = 30; // seconds
const TOTAL_QUIZ_TIME = QUESTIONS_PER_QUIZ * TIME_PER_QUESTION;

// Styled components
const QuizContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(8),
  position: 'relative',
}));

const QuizCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #0077b5, #00a0dc)',
  },
}));

const QuestionNumber = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  marginRight: theme.spacing(2),
}));

const OptionCard = styled(Box)(({ 
  theme, 
  selected = false, 
  correct = false, 
  incorrect = false, 
  revealed = false 
}) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  cursor: revealed ? 'default' : 'pointer',
  border: `1px solid ${
    revealed
      ? correct
        ? theme.palette.success.main
        : incorrect
          ? theme.palette.error.main
          : alpha(theme.palette.divider, 0.8)
      : selected
        ? theme.palette.primary.main
        : alpha(theme.palette.divider, 0.8)
  }`,
  backgroundColor: revealed
    ? correct
      ? alpha(theme.palette.success.main, 0.1)
      : incorrect && selected
        ? alpha(theme.palette.error.main, 0.1)
        : 'transparent'
    : selected
      ? alpha(theme.palette.primary.main, 0.05)
      : 'transparent',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '&:hover': {
    backgroundColor: revealed
      ? correct
        ? alpha(theme.palette.success.main, 0.1)
        : incorrect && selected
          ? alpha(theme.palette.error.main, 0.1)
          : 'transparent'
      : alpha(theme.palette.action.hover, 0.1),
    transform: revealed ? 'none' : 'translateX(5px)',
  },
}));

const OptionLetter = styled(Box)(({ theme, selected = false, correct = false, incorrect = false }) => ({
  width: 28,
  height: 28,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  backgroundColor: correct
    ? theme.palette.success.main
    : incorrect
      ? theme.palette.error.main
      : selected
        ? theme.palette.primary.main
        : alpha(theme.palette.action.hover, 0.1),
  color: correct || incorrect || selected ? 'white' : 'inherit',
  fontWeight: 600,
  transition: 'all 0.2s ease',
}));

const OptionResult = styled(Box)(({ theme, correct }) => ({
  marginLeft: 'auto',
  color: correct ? theme.palette.success.main : theme.palette.error.main,
}));

const TimerContainer = styled(Box)(({ theme, timeRunningOut }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  color: timeRunningOut ? theme.palette.error.main : 'inherit',
  transition: 'color 0.3s ease',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ResultCard = styled(Card)(({ theme, position }) => ({
  padding: theme.spacing(2),
  backgroundColor: position === 1 
    ? alpha(theme.palette.warning.light, 0.2)
    : position === 2
      ? alpha(theme.palette.grey[400], 0.2)
      : position === 3
        ? alpha(theme.palette.error[300], 0.2)
        : theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: position <= 3 ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
  transform: position <= 3 ? 'scale(1.02)' : 'none',
  transition: 'all 0.3s ease',
}));

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const optionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 5 }
};

// Main component
const QuizExperience = (props) => {
  // State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TIME_PER_QUESTION);
  const [totalQuizTime, setTotalQuizTime] = useState(TOTAL_QUIZ_TIME);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreData, setScoreData] = useState({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    totalScore: 0,
    timeBonus: 0,
    finalScore: 0
  });

  // Fetch questions from API/local storage or use the ones passed in
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        
        // Use mcqs props if provided, otherwise fetch from API
        const allQuestions = props.mcqs && props.mcqs.length > 0 ? props.mcqs : await getMCQs();
        
        // Shuffle and select 10 questions
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, QUESTIONS_PER_QUIZ);
        
        setQuestions(selected);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [props.mcqs]);

  // Timer effect for each question
  useEffect(() => {
    if (!isQuizStarted || isAnswerRevealed || isQuizFinished) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted, isAnswerRevealed, isQuizFinished, currentQuestionIndex]);

  // Timer effect for total quiz time
  useEffect(() => {
    if (!isQuizStarted || isQuizFinished) return;

    const timer = setInterval(() => {
      setTotalQuizTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted, isQuizFinished]);

  // Handler for time up on a question
  const handleTimeUp = () => {
    if (!selectedOption) {
      // If no option selected, record as unanswered
      const currentQuestion = questions[currentQuestionIndex];
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestionIndex] = {
        questionId: currentQuestion.id,
        userAnswer: null,
        isCorrect: false,
        timeSpent: TIME_PER_QUESTION
      };
      
      setUserAnswers(updatedAnswers);
    }
    
    setIsAnswerRevealed(true);
  };

  // Handler for total quiz time up
  const handleQuizTimeUp = () => {
    finishQuiz();
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (isAnswerRevealed) return;
    setSelectedOption(option);
  };

  // Handle revealing the answer
  const handleRevealAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Record the answer
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      userAnswer: selectedOption,
      isCorrect,
      timeSpent: TIME_PER_QUESTION - timeRemaining
    };
    
    setUserAnswers(updatedAnswers);
    setIsAnswerRevealed(true);
  };

  // Handle moving to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setTimeRemaining(TIME_PER_QUESTION);
    } else {
      finishQuiz();
    }
  };

  // Start the quiz
  const startQuiz = () => {
    setIsQuizStarted(true);
    setTimeRemaining(TIME_PER_QUESTION);
    setTotalQuizTime(TOTAL_QUIZ_TIME);
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(questions.length).fill(null));
  };

  // Finish the quiz and calculate scores
  const finishQuiz = () => {
    setIsQuizFinished(true);
    
    // Calculate scores
    const correct = userAnswers.filter(answer => answer && answer.isCorrect).length;
    const answered = userAnswers.filter(answer => answer && answer.userAnswer !== null).length;
    const timeBonus = Math.floor(totalQuizTime / 10); // 1 point for every 10 seconds remaining
    
    const scoreData = {
      correct,
      incorrect: answered - correct,
      unanswered: questions.length - answered,
      totalScore: correct * 10, // 10 points per correct answer
      timeBonus,
      finalScore: (correct * 10) + timeBonus
    };
    
    setScoreData(scoreData);
    setShowResults(true);
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
    setIsQuizStarted(false);
    setIsQuizFinished(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setTimeRemaining(TIME_PER_QUESTION);
    setTotalQuizTime(TOTAL_QUIZ_TIME);
    setUserAnswers([]);
    
    // Shuffle questions again
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, QUESTIONS_PER_QUIZ);
    setQuestions(selected);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Share results
  const handleShareResults = () => {
    const text = `I scored ${scoreData.finalScore} points (${scoreData.correct}/${questions.length} correct) on JavaScript MCQ Quiz! #JavaScriptQuiz #CodingChallenge`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My JavaScript Quiz Results',
        text: text,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(text + ' ' + window.location.href)
        .then(() => {
          alert('Results copied to clipboard!');
        })
        .catch(console.error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <QuizContainer maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center" py={8}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Loading quiz questions...
          </Typography>
        </Box>
      </QuizContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <QuizContainer maxWidth="md">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </QuizContainer>
    );
  }

  // Not enough questions
  if (questions.length < QUESTIONS_PER_QUIZ) {
    return (
      <QuizContainer maxWidth="md">
        <Alert severity="warning" sx={{ mb: 3 }}>
          Not enough questions available. Please add more questions to start a quiz.
        </Alert>
      </QuizContainer>
    );
  }

  // Quiz start screen
  if (!isQuizStarted) {
    return (
      <QuizContainer maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <QuizCard elevation={3}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                JavaScript MCQ Quiz
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" color="text.secondary" paragraph>
                Test your JavaScript knowledge with this interactive quiz!
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quiz Rules:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>The quiz contains {QUESTIONS_PER_QUIZ} questions about JavaScript</li>
                <li>You have {TIME_PER_QUESTION} seconds to answer each question</li>
                <li>Total quiz time is limited to {TOTAL_QUIZ_TIME / 60} minutes</li>
                <li>Each correct answer is worth 10 points</li>
                <li>You'll get a time bonus for finishing early</li>
                <li>Click "Next" after selecting your answer to see if you're correct</li>
              </Typography>
            </Box>
            
            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                size="large"
                onClick={startQuiz}
                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              >
                Start Quiz
              </Button>
            </Box>
          </QuizCard>
        </motion.div>
      </QuizContainer>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <QuizContainer maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <QuizCard elevation={3}>
            <Box textAlign="center" mb={4}>
              <TrophyIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Quiz Completed!
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Box>
            
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    Your Score
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" fontWeight="bold">
                      {scoreData.finalScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      points
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`${scoreData.correct} correct`}
                      color="success"
                      variant="outlined"
                    />
                    <Chip 
                      label={`${scoreData.incorrect} incorrect`}
                      color="error"
                      variant="outlined"
                    />
                    <Chip 
                      label={`${scoreData.unanswered} unanswered`}
                      color="default"
                      variant="outlined"
                    />
                    <Chip 
                      label={`+${scoreData.timeBonus} time bonus`}
                      color="info"
                      variant="outlined"
                      icon={<ClockIcon />}
                    />
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    Performance
                  </Typography>
                  
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Accuracy
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={questions.length > 0 ? (scoreData.correct / questions.length) * 100 : 0} 
                        color="success"
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {Math.round((scoreData.correct / questions.length) * 100)}%
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Time Used
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={100 - (totalQuizTime / TOTAL_QUIZ_TIME * 100)}
                        color="info"
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {formatTime(TOTAL_QUIZ_TIME - totalQuizTime)} of {formatTime(TOTAL_QUIZ_TIME)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Questions Review
              </Typography>
              
              {questions.map((question, index) => {
                const answer = userAnswers[index];
                const isCorrect = answer && answer.isCorrect;
                const isUnanswered = !answer || answer.userAnswer === null;
                
                return (
                  <Card 
                    key={index} 
                    variant="outlined"
                    sx={{ 
                      mb: 2,
                      borderColor: isCorrect 
                        ? 'success.main' 
                        : isUnanswered 
                          ? 'grey.400'
                          : 'error.main'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <QuestionNumber>{index + 1}</QuestionNumber>
                        <Typography variant="body1" fontWeight={500}>
                          {question.question}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ ml: 7, mt: 1 }}>
                        {isUnanswered ? (
                          <Typography variant="body2" color="text.secondary">
                            You didn't answer this question.
                          </Typography>
                        ) : (
                          <Box>
                            <Typography variant="body2">
                              Your answer: {' '}
                              <Box component="span" fontWeight={500} color={isCorrect ? 'success.main' : 'error.main'}>
                                {answer.userAnswer}
                              </Box>
                              {' '}
                              {isCorrect 
                                ? <CheckCircleIcon fontSize="small" color="success" />
                                : <CancelIcon fontSize="small" color="error" />
                              }
                            </Typography>
                            
                            {!isCorrect && (
                              <Typography variant="body2" color="success.main" fontWeight={500}>
                                Correct answer: {question.correctAnswer}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<RestartIcon />}
                onClick={handleRestartQuiz}
              >
                Restart Quiz
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShareIcon />}
                onClick={handleShareResults}
              >
                Share Results
              </Button>
            </Box>
          </QuizCard>
        </motion.div>
      </QuizContainer>
    );
  }

  // Current question screen
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  const timeRunningOut = timeRemaining <= 5;

  return (
    <QuizContainer maxWidth="md">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3 }}
        >
          <QuizCard elevation={3}>
            {/* Timer and progress */}
            <Box sx={{ mb: 4, position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <TimerContainer timeRunningOut={timeRunningOut}>
                  <ClockIcon sx={{ mr: 1, color: timeRunningOut ? 'error.main' : 'inherit' }} />
                  <Typography variant="body2">
                    Question Time: {formatTime(timeRemaining)}
                  </Typography>
                </TimerContainer>
                
                <Typography variant="body2" color="text.secondary">
                  Total Time: {formatTime(totalQuizTime)}
                </Typography>
              </Box>
              
              <ProgressContainer>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </Typography>
                  <Chip
                    size="small"
                    label={currentQuestion.difficulty.toUpperCase()}
                    color={
                      currentQuestion.difficulty === 'easy' ? 'success' :
                      currentQuestion.difficulty === 'medium' ? 'warning' : 'error'
                    }
                    variant="outlined"
                  />
                </Box>
              </ProgressContainer>
            </Box>
            
            {/* Question */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 500,
                  lineHeight: 1.4
                }}
              >
                {currentQuestion.question}
              </Typography>
              {currentQuestion.code && (
                <Box 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'grey.900', 
                    color: 'grey.100',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                    mt: 2
                  }}
                >
                  {currentQuestion.code}
                </Box>
              )}
            </Box>
            
            {/* Options */}
            <Box sx={{ mb: 4 }}>
              {currentQuestion.options.map((option, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D...
                const isSelected = selectedOption === option;
                const isCorrect = isAnswerRevealed && option === currentQuestion.correctAnswer;
                const isIncorrect = isAnswerRevealed && isSelected && option !== currentQuestion.correctAnswer;
                
                return (
                  <motion.div
                    key={option}
                    variants={optionVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <OptionCard
                      onClick={() => handleOptionSelect(option)}
                      selected={isSelected}
                      correct={isCorrect}
                      incorrect={isIncorrect}
                      revealed={isAnswerRevealed}
                    >
                      <OptionLetter
                        selected={isSelected}
                        correct={isCorrect}
                        incorrect={isIncorrect}
                      >
                        {letter}
                      </OptionLetter>
                      
                      <Typography variant="body1">
                        {option}
                      </Typography>
                      
                      {isAnswerRevealed && (
                        <OptionResult correct={isCorrect}>
                          {isCorrect && <CheckCircleIcon color="success" />}
                          {isIncorrect && <CancelIcon color="error" />}
                        </OptionResult>
                      )}
                    </OptionCard>
                  </motion.div>
                );
              })}
            </Box>
            
            {/* Explanation (shown after answering) */}
            {isAnswerRevealed && currentQuestion.explanation && (
              <Fade in={isAnswerRevealed} timeout={500}>
                <Box 
                  sx={{ 
                    p: 2, 
                    mb: 4, 
                    backgroundColor: alpha('#e3f2fd', 0.5), 
                    borderRadius: 1,
                    border: '1px solid #bbdefb'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                    Explanation:
                  </Typography>
                  <Typography variant="body2">
                    {currentQuestion.explanation}
                  </Typography>
                </Box>
              </Fade>
            )}
            
            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {isAnswerRevealed 
                  ? currentQuestionIndex < questions.length - 1 
                    ? "Click Next to continue" 
                    : "Click Next to finish the quiz"
                  : "Select an answer and click Check"
                }
              </Typography>
              
              {isAnswerRevealed ? (
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<NavigateNextIcon />}
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Quiz"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!selectedOption}
                  onClick={handleRevealAnswer}
                >
                  Check Answer
                </Button>
              )}
            </Box>
          </QuizCard>
        </motion.div>
      </AnimatePresence>
    </QuizContainer>
  );
};

export default QuizExperience;
