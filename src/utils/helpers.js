// Group todos by date
export const groupByDate = (todos) => {
  const groups = {};
  
  todos.forEach(todo => {
    const date = new Date(todo.dueDate).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(todo);
  });
  
  return groups;
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

// Get priority color class
export const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'priority-medium';
  }
};

// Get status color class
export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-success';
    case 'in-progress':
      return 'bg-warning';
    case 'pending':
      return 'bg-secondary';
    default:
      return 'bg-secondary';
  }
};

// Generate mock data
export const generateMockTodos = () => {
  const todos = [];
  const titles = [
    'Complete project proposal',
    'Review client feedback',
    'Update website content',
    'Prepare presentation slides',
    'Schedule team meeting',
    'Fix bug in authentication',
    'Write unit tests',
    'Update documentation',
    'Deploy to production',
    'Review code changes'
  ];
  
  const priorities = ['High', 'Medium', 'Low'];
  const statuses = ['pending', 'in-progress', 'completed'];
  
  for (let i = 0; i < 15; i++) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    todos.push({
      id: i + 1,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: `Description for ${titles[Math.floor(Math.random() * titles.length)]}`,
      dueDate: dueDate.toISOString().split('T')[0],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: status,
      completed: status === 'completed',
      createdAt: new Date().toISOString()
    });
  }
  
  return todos;
};

// Generate mock notifications
export const generateMockNotifications = () => {
  return [
    {
      id: 1,
      title: 'Task Due Soon',
      message: 'Complete project proposal is due in 2 hours',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 2,
      title: 'Task Completed',
      message: 'Review client feedback has been marked as completed',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: 3,
      title: 'Status Updated',
      message: 'Update website content status changed to in-progress',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    },
    {
      id: 4,
      title: 'Reminder',
      message: 'Don\'t forget to prepare presentation slides for tomorrow',
      type: 'primary',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ];
};