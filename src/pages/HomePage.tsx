import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import BarChartIcon from '@mui/icons-material/BarChart';
import GradeIcon from '@mui/icons-material/Grade';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', // adjust for header height
        bgcolor: 'background.default',
        backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1470&q=80)', // new background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: 'common.white',
        pt: 12,
        pb: 8,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.6)',
          zIndex: 1,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Typography variant={isSm ? 'h3' : 'h2'} component="h1" fontWeight="bold" gutterBottom>
          Revolutionize Your Exam Experience
        </Typography>
        <Typography variant="h6" component="p" mb={4} sx={{ opacity: 0.9 }}>
          Create, deliver, and grade exams effortlessly on one intuitive platform.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/auth/register')}
            sx={{ minWidth: 140 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/auth/login')}
            sx={{ minWidth: 140, color: 'common.white', borderColor: 'common.white' }}
          >
            Log In
          </Button>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, mt: 12 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid {...({item: true, xs: 12, md: 4} as any)}>
            <Paper
              elevation={6}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: 'text.primary',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <EmojiObjectsIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Easy Exam Creation
              </Typography>
              <Typography>
                Intuitive editor to craft diverse question types and customize exams quickly.
              </Typography>
            </Paper>
          </Grid>

          <Grid {...({item: true, xs: 12, md: 4} as any)}>
            <Paper
              elevation={6}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: 'text.primary',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <BarChartIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Real-time Analytics
              </Typography>
              <Typography>
                Visualize student performance and exam statistics in real-time dashboards.
              </Typography>
            </Paper>
          </Grid>

          <Grid {...({item: true, xs: 12, md: 4} as any)}>
            <Paper
              elevation={6}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: 'text.primary',
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <GradeIcon sx={{ fontSize: 50, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Simplified Grading
              </Typography>
              <Typography>
                Automate grading and provide timely feedback with ease and accuracy.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
      <Box

        component="footer"

        sx={{

          py: 3,

          bgcolor: 'primary.dark',

          color: 'primary.contrastText',

          textAlign: 'center',

          fontSize: '0.875rem',

          mt: 'auto',

        }}

      >

        © {new Date().getFullYear()} ExamPlatform. All rights reserved.

      </Box>
      </>
  );
};

export default HomePage;