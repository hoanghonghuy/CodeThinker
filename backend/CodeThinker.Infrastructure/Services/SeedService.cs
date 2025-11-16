using CodeThinker.Domain.Entities;
using CodeThinker.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CodeThinker.Infrastructure.Services;

public interface ISeedService
{
    Task SeedTracksAndChallengesAsync();
}

public class SeedService : ISeedService
{
    private readonly ApplicationDbContext _context;

    public SeedService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedTracksAndChallengesAsync()
    {
        if (await _context.Tracks.AnyAsync())
        {
            // Already seeded
            return;
        }

        var tracks = new List<Track>
        {
            new Track
            {
                Id = Guid.NewGuid(),
                Title = "Python Foundations",
                Description = "Learn Python basics: variables, control flow, functions, and data structures.",
                Difficulty = "Beginner",
                Topics = new List<string> { "Python", "Programming Basics", "Data Structures" },
                Tags = new List<string> { "python", "beginner", "fundamentals" },
                Status = "published",
                EstimatedHours = 20,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Track
            {
                Id = Guid.NewGuid(),
                Title = "Web Development with React",
                Description = "Build modern web apps with React, hooks, routing, and state management.",
                Difficulty = "Intermediate",
                Topics = new List<string> { "React", "JavaScript", "Frontend", "Web" },
                Tags = new List<string> { "react", "javascript", "frontend", "web" },
                Status = "published",
                EstimatedHours = 35,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Track
            {
                Id = Guid.NewGuid(),
                Title = "Data Structures & Algorithms",
                Description = "Master arrays, linked lists, trees, sorting, and graph algorithms.",
                Difficulty = "Intermediate",
                Topics = new List<string> { "Algorithms", "Data Structures", "Problem Solving" },
                Tags = new List<string> { "algorithms", "data-structures", "dsa" },
                Status = "published",
                EstimatedHours = 40,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Track
            {
                Id = Guid.NewGuid(),
                Title = "SQL & Database Fundamentals",
                Description = "Learn SQL queries, joins, indexing, and database design principles.",
                Difficulty = "Beginner",
                Topics = new List<string> { "SQL", "Database", "Queries" },
                Tags = new List<string> { "sql", "database", "postgres" },
                Status = "published",
                EstimatedHours = 25,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _context.Tracks.AddRangeAsync(tracks);
        await _context.SaveChangesAsync();

        // Seed challenges for each track
        var pythonTrack = tracks.First(t => t.Title == "Python Foundations");
        var pythonChallenges = new List<Challenge>
        {
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "Hello World & Variables",
                Description = "Write a program that prints 'Hello, World!' and stores your name in a variable.",
                Difficulty = "Easy",
                Topics = new List<string> { "Python", "Variables", "Printing" },
                Tags = new List<string> { "python", "variables", "print" },
                Status = "published",
                TrackId = pythonTrack.Id,
                EstimatedHours = 1,
                Solution = "# Example solution\nname = 'Your Name'\nprint('Hello, World!')\nprint(name)",
                Hints = "[\"Use the print() function to output text.\", \"Variables are created by assignment: name = 'value'.\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "Sum of Even Numbers",
                Description = "Given a list of integers, return the sum of all even numbers.",
                Difficulty = "Easy",
                Topics = new List<string> { "Python", "Loops", "Lists", "Conditionals" },
                Tags = new List<string> { "python", "loops", "lists", "conditionals" },
                Status = "published",
                TrackId = pythonTrack.Id,
                EstimatedHours = 2,
                Solution = "def sum_even_numbers(numbers):\n    return sum(num for num in numbers if num % 2 == 0)",
                Hints = "[\"Iterate through the list using a loop.\", \"Use the modulo operator (%) to check for even numbers.\", \"Accumulate the sum in a variable.\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "Simple Calculator Function",
                Description = "Create a function that takes two numbers and an operator (+, -, *, /) and returns the result.",
                Difficulty = "Medium",
                Topics = new List<string> { "Python", "Functions", "Arithmetic", "Error Handling" },
                Tags = new List<string> { "python", "functions", "arithmetic", "error-handling" },
                Status = "published",
                TrackId = pythonTrack.Id,
                EstimatedHours = 3,
                Solution = "def calculator(a, b, operator):\n    if operator == '+':\n        return a + b\n    elif operator == '-':\n        return a - b\n    elif operator == '*':\n        return a * b\n    elif operator == '/':\n        if b == 0:\n            raise ValueError('Division by zero')\n        return a / b\n    else:\n        raise ValueError('Invalid operator')",
                Hints = "[\"Use if-elif-else to handle different operators.\", \"Handle division by zero as a special case.\", \"Return the result of the operation.\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        var reactTrack = tracks.First(t => t.Title == "Web Development with React");
        var reactChallenges = new List<Challenge>
        {
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "Create a Counter Component",
                Description = "Build a React component with a count state and buttons to increment/decrement.",
                Difficulty = "Easy",
                Topics = new List<string> { "React", "useState", "Components", "JSX" },
                Tags = new List<string> { "react", "hooks", "state", "components" },
                Status = "published",
                TrackId = reactTrack.Id,
                EstimatedHours = 2,
                Solution = "import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n    </div>\n  );\n}",
                Hints = "[\"Use the useState hook to manage state.\", \"Create button elements with onClick handlers.\", \"Display the current count in the component.\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "Todo List with CRUD",
                Description = "Create a todo list component that can add, delete, and toggle todos.",
                Difficulty = "Medium",
                Topics = new List<string> { "React", "useState", "Lists", "Forms", "Event Handling" },
                Tags = new List<string> { "react", "todo", "crud", "forms" },
                Status = "published",
                TrackId = reactTrack.Id,
                EstimatedHours = 4,
                Solution = "import React, { useState } from 'react';\n\nfunction TodoList() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState('');\n\n  const addTodo = () => {\n    if (input.trim()) {\n      setTodos([...todos, { id: Date.now(), text: input, done: false }]);\n      setInput('');\n    }\n  };\n\n  const toggleTodo = (id) => {\n    setTodos(todos.map(todo => \n      todo.id === id ? { ...todo, done: !todo.done } : todo\n    ));\n  };\n\n  const deleteTodo = (id) => {\n    setTodos(todos.filter(todo => todo.id !== id));\n  };\n\n  return (\n    <div>\n      <input value={input} onChange={(e) => setInput(e.target.value)} />\n      <button onClick={addTodo}>Add</button>\n      <ul>\n        {todos.map(todo => (\n          <li key={todo.id}>\n            <span onClick={() => toggleTodo(todo.id)} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>\n              {todo.text}\n            </span>\n            <button onClick={() => deleteTodo(todo.id)}>Delete</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}",
                Hints = "[\"Use an array in state to store todos.\", \"Each todo should have an id, text, and done status.\", \"Implement add, toggle, and delete functions.\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        var dsaTrack = tracks.First(t => t.Title == "Data Structures & Algorithms");
        var dsaChallenges = new List<Challenge>
        {
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "Find Maximum in Array",
                Description = "Write a function that finds the maximum value in an unsorted array.",
                Difficulty = "Easy",
                Topics = new List<string> { "Algorithms", "Arrays", "Iteration" },
                Tags = new List<string> { "algorithms", "arrays", "max" },
                Status = "published",
                TrackId = dsaTrack.Id,
                EstimatedHours = 1,
                Solution = "def find_max(arr):\n    if not arr:\n        return None\n    max_val = arr[0]\n    for num in arr[1:]:\n        if num > max_val:\n            max_val = num\n    return max_val",
                Hints = "[\"Handle empty array case.\", \"Initialize max with first element.\", \"Iterate and update max when larger value found.\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "Binary Search Implementation",
                Description = "Implement binary search to find an element in a sorted array.",
                Difficulty = "Medium",
                Topics = new List<string> { "Algorithms", "Binary Search", "Arrays", "Recursion" },
                Tags = new List<string> { "algorithms", "binary-search", "arrays" },
                Status = "published",
                TrackId = dsaTrack.Id,
                EstimatedHours = 3,
                Solution = "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
                Hints = "[\"Use two pointers: left and right.\", \"Calculate mid index each iteration.\", \"Compare target with middle element and adjust pointers.\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        var sqlTrack = tracks.First(t => t.Title == "SQL & Database Fundamentals");
        var sqlChallenges = new List<Challenge>
        {
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "Basic SELECT Queries",
                Description = "Write SQL queries to select, filter, and sort data from a users table.",
                Difficulty = "Easy",
                Topics = new List<string> { "SQL", "SELECT", "WHERE", "ORDER BY" },
                Tags = new List<string> { "sql", "select", "where", "order-by" },
                Status = "published",
                TrackId = sqlTrack.Id,
                EstimatedHours = 2,
                Solution = "-- Select all users\nSELECT * FROM users;\n\n-- Select active users only\nSELECT * FROM users WHERE status = 'active';\n\n-- Select users sorted by registration date\nSELECT * FROM users ORDER BY created_at DESC;",
                Hints = "[\"Use SELECT * to select all columns.\", \"Use WHERE clause to filter rows.\", \"Use ORDER BY to sort results (ASC/DESC).\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Challenge
            {
                Id = Guid.NewGuid(),
                Title = "JOINs and Aggregations",
                Description = "Write queries using INNER JOIN and aggregate functions like COUNT, AVG.",
                Difficulty = "Medium",
                Topics = new List<string> { "SQL", "JOIN", "Aggregate Functions", "GROUP BY" },
                Tags = new List<string> { "sql", "joins", "aggregates", "group-by" },
                Status = "published",
                TrackId = sqlTrack.Id,
                EstimatedHours = 3,
                Solution = "-- Count orders per user\nSELECT u.name, COUNT(o.id) as order_count\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name;\n\n-- Average order value per user\nSELECT u.name, AVG(o.total) as avg_order\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name;",
                Hints = "[\"Use INNER JOIN to combine related tables.\", \"Use COUNT(), AVG(), SUM() for aggregations.\", \"Use GROUP BY to group rows before aggregating.\"]",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _context.Challenges.AddRangeAsync(pythonChallenges);
        await _context.Challenges.AddRangeAsync(reactChallenges);
        await _context.Challenges.AddRangeAsync(dsaChallenges);
        await _context.Challenges.AddRangeAsync(sqlChallenges);
        await _context.SaveChangesAsync();
    }
}
