import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BuildIcon from '@mui/icons-material/Build';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddIcon from '@mui/icons-material/Add';

const Maintenance = () => {
  const [maintenanceTasks, setMaintenanceTasks] = useState([
    {
      id: 1,
      title: 'Clean Gutters and Downspouts',
      description: 'Remove leaves, debris, and blockages from gutters and downspouts to ensure proper water flow.',
      frequency: 'Monthly',
      lastCompleted: '2023-10-15',
      nextDue: '2023-11-15',
      isOverdue: true,
      completed: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Inspect and Clean First Flush Diverter',
      description: 'Check the first flush diverter for proper operation and clean accumulated debris.',
      frequency: 'Quarterly',
      lastCompleted: '2023-09-01',
      nextDue: '2023-12-01',
      isOverdue: false,
      completed: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Replace Filter Media',
      description: 'Replace the filter media in the filtration system to maintain water quality.',
      frequency: 'Annually',
      lastCompleted: '2023-01-10',
      nextDue: '2024-01-10',
      isOverdue: false,
      completed: false,
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Inspect Storage Tank',
      description: 'Check storage tank for cracks, leaks, and sediment buildup. Clean if necessary.',
      frequency: 'Semi-annually',
      lastCompleted: '2023-06-15',
      nextDue: '2023-12-15',
      isOverdue: false,
      completed: false,
      priority: 'high'
    },
    {
      id: 5,
      title: 'Test Water Quality',
      description: 'Conduct water quality tests to ensure the harvested rainwater meets required standards.',
      frequency: 'Quarterly',
      lastCompleted: '2023-08-20',
      nextDue: '2023-11-20',
      isOverdue: false,
      completed: false,
      priority: 'high'
    },
    {
      id: 6,
      title: 'Clean Recharge Pit',
      description: 'Remove silt and debris from the recharge pit to maintain infiltration capacity.',
      frequency: 'Annually',
      lastCompleted: '2023-03-05',
      nextDue: '2024-03-05',
      isOverdue: false,
      completed: false,
      priority: 'medium'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    frequency: 'Monthly',
    priority: 'medium'
  });

  const handleTaskCompletion = (id) => {
    setMaintenanceTasks(maintenanceTasks.map(task => {
      if (task.id === id) {
        const today = new Date();
        let nextDue;
        
        switch(task.frequency) {
          case 'Weekly':
            nextDue = new Date(today.setDate(today.getDate() + 7));
            break;
          case 'Monthly':
            nextDue = new Date(today.setMonth(today.getMonth() + 1));
            break;
          case 'Quarterly':
            nextDue = new Date(today.setMonth(today.getMonth() + 3));
            break;
          case 'Semi-annually':
            nextDue = new Date(today.setMonth(today.getMonth() + 6));
            break;
          case 'Annually':
            nextDue = new Date(today.setFullYear(today.getFullYear() + 1));
            break;
          default:
            nextDue = new Date(today.setMonth(today.getMonth() + 1));
        }
        
        return {
          ...task,
          completed: !task.completed,
          lastCompleted: today.toISOString().split('T')[0],
          nextDue: nextDue.toISOString().split('T')[0],
          isOverdue: false
        };
      }
      return task;
    }));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value
    });
  };

  const handleAddTask = () => {
    const today = new Date();
    let nextDue;
    
    switch(newTask.frequency) {
      case 'Weekly':
        nextDue = new Date(today.setDate(today.getDate() + 7));
        break;
      case 'Monthly':
        nextDue = new Date(today.setMonth(today.getMonth() + 1));
        break;
      case 'Quarterly':
        nextDue = new Date(today.setMonth(today.getMonth() + 3));
        break;
      case 'Semi-annually':
        nextDue = new Date(today.setMonth(today.getMonth() + 6));
        break;
      case 'Annually':
        nextDue = new Date(today.setFullYear(today.getFullYear() + 1));
        break;
      default:
        nextDue = new Date(today.setMonth(today.getMonth() + 1));
    }
    
    const newTaskItem = {
      id: maintenanceTasks.length + 1,
      ...newTask,
      lastCompleted: 'Never',
      nextDue: nextDue.toISOString().split('T')[0],
      isOverdue: false,
      completed: false
    };
    
    setMaintenanceTasks([...maintenanceTasks, newTaskItem]);
    setNewTask({
      title: '',
      description: '',
      frequency: 'Monthly',
      priority: 'medium'
    });
    handleCloseDialog();
  };

  const getOverdueTasks = () => {
    return maintenanceTasks.filter(task => task.isOverdue && !task.completed);
  };

  const getUpcomingTasks = () => {
    return maintenanceTasks.filter(task => !task.isOverdue && !task.completed);
  };

  const getCompletedTasks = () => {
    return maintenanceTasks.filter(task => task.completed);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high':
        return 'error.main';
      case 'medium':
        return 'warning.main';
      case 'low':
        return 'success.main';
      default:
        return 'info.main';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BuildIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Maintenance Schedule
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Keep your rainwater harvesting system in optimal condition with regular maintenance.
      </Typography>
      
      {getOverdueTasks().length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1">
            You have {getOverdueTasks().length} overdue maintenance {getOverdueTasks().length === 1 ? 'task' : 'tasks'} that require attention.
          </Typography>
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Maintenance Tasks
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Add Task
              </Button>
            </Box>
            
            {getOverdueTasks().length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'error.main', display: 'flex', alignItems: 'center' }}>
                  <WarningAmberIcon sx={{ mr: 1 }} />
                  Overdue
                </Typography>
                {getOverdueTasks().map((task) => (
                  <Accordion key={task.id} sx={{ mb: 1, border: '1px solid', borderColor: 'error.light' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.completed}
                            onChange={() => handleTaskCompletion(task.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={task.title}
                        sx={{ width: '100%' }}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {task.description}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Frequency:
                          </Typography>
                          <Typography variant="body2">
                            {task.frequency}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Last Completed:
                          </Typography>
                          <Typography variant="body2">
                            {task.lastCompleted}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Due Date:
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            {task.nextDue} (Overdue)
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Priority:
                          </Typography>
                          <Typography variant="body2" sx={{ color: getPriorityColor(task.priority) }}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 1 }} />
                Upcoming
              </Typography>
              {getUpcomingTasks().map((task) => (
                <Accordion key={task.id} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleTaskCompletion(task.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label={task.title}
                      sx={{ width: '100%' }}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      {task.description}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Frequency:
                        </Typography>
                        <Typography variant="body2">
                          {task.frequency}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Last Completed:
                        </Typography>
                        <Typography variant="body2">
                          {task.lastCompleted}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Due Date:
                        </Typography>
                        <Typography variant="body2">
                          {task.nextDue}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Priority:
                        </Typography>
                        <Typography variant="body2" sx={{ color: getPriorityColor(task.priority) }}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            
            {getCompletedTasks().length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'success.main', display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                  Completed
                </Typography>
                {getCompletedTasks().map((task) => (
                  <Accordion key={task.id} sx={{ mb: 1, bgcolor: 'success.light' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.completed}
                            onChange={() => handleTaskCompletion(task.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={<Typography sx={{ textDecoration: 'line-through' }}>{task.title}</Typography>}
                        sx={{ width: '100%' }}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {task.description}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Frequency:
                          </Typography>
                          <Typography variant="body2">
                            {task.frequency}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Completed On:
                          </Typography>
                          <Typography variant="body2">
                            {task.lastCompleted}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Next Due:
                          </Typography>
                          <Typography variant="body2">
                            {task.nextDue}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Maintenance Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" paragraph>
              Regular maintenance ensures optimal performance of your rainwater harvesting system and extends its lifespan.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              General Guidelines:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Inspect your system after heavy rainfall events
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Keep records of all maintenance activities
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Clean filters more frequently during monsoon season
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Check for mosquito breeding in open water storage
                </Typography>
              </li>
            </ul>
          </Paper>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Need Professional Help?
              </Typography>
              <Typography variant="body2" paragraph>
                Our certified technicians can perform comprehensive system maintenance and troubleshooting.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Schedule Service
              </Button>
              <Button size="small">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Maintenance Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={handleNewTaskChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newTask.description}
            onChange={handleNewTaskChange}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            name="frequency"
            label="Frequency"
            fullWidth
            variant="outlined"
            value={newTask.frequency}
            onChange={handleNewTaskChange}
            sx={{ mb: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Semi-annually">Semi-annually</option>
            <option value="Annually">Annually</option>
          </TextField>
          <TextField
            select
            margin="dense"
            name="priority"
            label="Priority"
            fullWidth
            variant="outlined"
            value={newTask.priority}
            onChange={handleNewTaskChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" disabled={!newTask.title || !newTask.description}>
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Maintenance;