import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { cssAnimations } from '../utils/animations';

const AnimatedCard = ({ title, description, image, buttonText, onClick, delay = 0 }) => {
  return (
    <Card 
      className={`${cssAnimations.fadeIn} ${cssAnimations.hover}`}
      style={{ animationDelay: `${delay}ms` }}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
          className="transition-transform duration-500 hover:scale-105"
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" className={cssAnimations.slideIn}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className={cssAnimations.fadeIn}>
          {description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {buttonText && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onClick}
              className="transition-all duration-300 hover:shadow-lg"
            >
              {buttonText}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnimatedCard;