using Microsoft.EntityFrameworkCore;
using CodeThinker.Infrastructure.Persistence;
using CodeThinker.Domain.Entities;

namespace CodeThinker.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedDataAsync(ApplicationDbContext context)
    {
        // Check if data already exists
        if (await context.Tracks.AnyAsync())
        {
            return; // Database already seeded
        }

        // Seed C# Tracks
        var csharpTracks = await SeedCSharpTracksAsync(context);
        
        // Seed C# Challenges
        await SeedCSharpChallengesAsync(context, csharpTracks);
        
        // Seed Achievements
        await SeedAchievementsAsync(context);

        await context.SaveChangesAsync();
    }

    private static async Task<List<Track>> SeedCSharpTracksAsync(ApplicationDbContext context)
    {
        var tracks = new List<Track>
        {
            new Track
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Title = "C# Fundamentals",
                Description = "Learn the basics of C# programming language including syntax, variables, control flow, and basic concepts.",
                Difficulty = "Beginner",
                Topics = new List<string> { "syntax", "variables", "control-flow", "methods", "arrays", "strings" },
                Status = "published",
                EstimatedHours = 40,
                Tags = new List<string> { "beginner", "csharp", "fundamentals" },
                ProgressTotal = 100
            },
            new Track
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Title = "C# Object-Oriented Programming",
                Description = "Master object-oriented programming concepts in C# including classes, objects, inheritance, polymorphism, and encapsulation.",
                Difficulty = "Intermediate",
                Topics = new List<string> { "classes", "objects", "inheritance", "polymorphism", "encapsulation", "interfaces" },
                Status = "published",
                EstimatedHours = 60,
                Tags = new List<string> { "intermediate", "csharp", "oop" },
                ProgressTotal = 100
            },
            new Track
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Title = "C# Advanced Features",
                Description = "Explore advanced C# features including LINQ, async programming, delegates, events, and generics.",
                Difficulty = "Advanced",
                Topics = new List<string> { "linq", "async-await", "delegates", "events", "generics", "reflection" },
                Status = "published",
                EstimatedHours = 80,
                Tags = new List<string> { "advanced", "csharp", "linq", "async" },
                ProgressTotal = 100
            },
            new Track
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Title = "C# Web Development",
                Description = "Build web applications using C# with ASP.NET Core, REST APIs, and modern web development practices.",
                Difficulty = "Advanced",
                Topics = new List<string> { "aspnet-core", "web-api", "rest", "mvc", "entity-framework", "blazor" },
                Status = "published",
                EstimatedHours = 100,
                Tags = new List<string> { "advanced", "csharp", "web", "aspnet" },
                ProgressTotal = 100
            }
        };

        await context.Tracks.AddRangeAsync(tracks);
        return tracks;
    }

    private static async Task SeedCSharpChallengesAsync(ApplicationDbContext context, List<Track> tracks)
    {
        var fundamentalsTrack = tracks.First(t => t.Title == "C# Fundamentals");
        var oopTrack = tracks.First(t => t.Title == "C# Object-Oriented Programming");
        var advancedTrack = tracks.First(t => t.Title == "C# Advanced Features");
        var webTrack = tracks.First(t => t.Title == "C# Web Development");

        var challenges = new List<Challenge>();

        // C# Fundamentals Challenges
        challenges.AddRange(new[]
        {
            new Challenge
            {
                Id = Guid.Parse("10000001-0001-0001-0001-000000000001"),
                Title = "Hello World in C#",
                Description = "Write your first C# program that displays 'Hello, World!' to the console.",
                Difficulty = "Easy",
                Topics = new List<string> { "syntax", "console" },
                Status = "published",
                EstimatedHours = 1,
                Tags = new List<string> { "beginner", "syntax" },
                TrackId = fundamentalsTrack.Id,
                ProgressTotal = 100,
                Solution = "Console.WriteLine(\"Hello, World!\");"
            },
            new Challenge
            {
                Id = Guid.Parse("10000001-0001-0001-0001-000000000002"),
                Title = "Variables and Data Types",
                Description = "Declare variables of different data types (int, double, string, bool) and print their values.",
                Difficulty = "Easy",
                Topics = new List<string> { "variables", "data-types" },
                Status = "published",
                EstimatedHours = 2,
                Tags = new List<string> { "beginner", "variables" },
                TrackId = fundamentalsTrack.Id,
                ProgressTotal = 100,
                Solution = "int age = 25;\ndouble salary = 50000.50;\nstring name = \"John\";\nbool isStudent = true;\nConsole.WriteLine($\"Name: {name}, Age: {age}, Salary: {salary}, Student: {isStudent}\");"
            },
            new Challenge
            {
                Id = Guid.Parse("10000001-0001-0001-0001-000000000003"),
                Title = "Conditional Statements",
                Description = "Write a program that checks if a number is positive, negative, or zero using if-else statements.",
                Difficulty = "Easy",
                Topics = new List<string> { "if-else", "conditions" },
                Status = "published",
                EstimatedHours = 2,
                Tags = new List<string> { "beginner", "conditions" },
                TrackId = fundamentalsTrack.Id,
                ProgressTotal = 100,
                Solution = "int number = 5;\nif (number > 0)\n    Console.WriteLine(\"Positive\");\nelse if (number < 0)\n    Console.WriteLine(\"Negative\");\nelse\n    Console.WriteLine(\"Zero\");"
            },
            new Challenge
            {
                Id = Guid.Parse("10000001-0001-0001-0001-000000000004"),
                Title = "Loops and Iteration",
                Description = "Print numbers from 1 to 10 using a for loop, then print even numbers using a while loop.",
                Difficulty = "Easy",
                Topics = new List<string> { "for-loop", "while-loop" },
                Status = "published",
                EstimatedHours = 3,
                Tags = new List<string> { "beginner", "loops" },
                TrackId = fundamentalsTrack.Id,
                ProgressTotal = 100,
                Solution = "// For loop: 1 to 10\nfor (int i = 1; i <= 10; i++)\n    Console.WriteLine(i);\n\n// While loop: even numbers\nint num = 2;\nwhile (num <= 10)\n{\n    Console.WriteLine(num);\n    num += 2;\n}"
            },
            new Challenge
            {
                Id = Guid.Parse("10000001-0001-0001-0001-000000000005"),
                Title = "Arrays and Lists",
                Description = "Create an array of integers and calculate their sum. Create a list of strings and print each in uppercase.",
                Difficulty = "Easy",
                Topics = new List<string> { "arrays", "lists" },
                Status = "published",
                EstimatedHours = 3,
                Tags = new List<string> { "beginner", "collections" },
                TrackId = fundamentalsTrack.Id,
                ProgressTotal = 100,
                Solution = "// Array sum\nint[] numbers = { 1, 2, 3, 4, 5 };\nint sum = 0;\nforeach (int num in numbers)\n    sum += num;\nConsole.WriteLine($\"Sum: {sum}\");\n\n// List uppercase\nList<string> names = new List<string> { \"alice\", \"bob\", \"charlie\" };\nforeach (string name in names)\n    Console.WriteLine(name.ToUpper());"
            }
        });

        // C# OOP Challenges
        challenges.AddRange(new[]
        {
            new Challenge
            {
                Id = Guid.Parse("20000001-0001-0001-0001-000000000001"),
                Title = "Create Your First Class",
                Description = "Create a Person class with properties for Name and Age, and a method to introduce themselves.",
                Difficulty = "Medium",
                Topics = new List<string> { "classes", "properties", "methods" },
                Status = "published",
                EstimatedHours = 4,
                Tags = new List<string> { "intermediate", "classes" },
                TrackId = oopTrack.Id,
                ProgressTotal = 100,
                Solution = "public class Person\n{\n    public string Name { get; set; }\n    public int Age { get; set; }\n    \n    public void Introduce()\n    {\n        Console.WriteLine($\"Hi, I'm {Name} and I'm {Age} years old.\");\n    }\n}"
            },
            new Challenge
            {
                Id = Guid.Parse("20000001-0001-0001-0001-000000000002"),
                Title = "Constructor and Overloading",
                Description = "Create a Book class with multiple constructors and demonstrate constructor overloading.",
                Difficulty = "Medium",
                Topics = new List<string> { "constructors", "overloading" },
                Status = "published",
                EstimatedHours = 4,
                Tags = new List<string> { "intermediate", "constructors" },
                TrackId = oopTrack.Id,
                ProgressTotal = 100,
                Solution = "public class Book\n{\n    public string Title { get; set; }\n    public string Author { get; set; }\n    public int Year { get; set; }\n    \n    public Book(string title, string author)\n    {\n        Title = title;\n        Author = author;\n        Year = DateTime.Now.Year;\n    }\n    \n    public Book(string title, string author, int year)\n    {\n        Title = title;\n        Author = author;\n        Year = year;\n    }\n}"
            },
            new Challenge
            {
                Id = Guid.Parse("20000001-0001-0001-0001-000000000003"),
                Title = "Inheritance and Base Classes",
                Description = "Create an Animal base class and Dog and Cat derived classes that override methods.",
                Difficulty = "Medium",
                Topics = new List<string> { "inheritance", "base-class", "override" },
                Status = "published",
                EstimatedHours = 5,
                Tags = new List<string> { "intermediate", "inheritance" },
                TrackId = oopTrack.Id,
                ProgressTotal = 100,
                Solution = "public abstract class Animal\n{\n    public string Name { get; set; }\n    \n    public abstract void MakeSound();\n}\n\npublic class Dog : Animal\n{\n    public override void MakeSound()\n    {\n        Console.WriteLine($\"{Name} says: Woof!\");\n    }\n}\n\npublic class Cat : Animal\n{\n    public override void MakeSound()\n    {\n        Console.WriteLine($\"{Name} says: Meow!\");\n    }\n}"
            }
        });

        // C# Advanced Challenges
        challenges.AddRange(new[]
        {
            new Challenge
            {
                Id = Guid.Parse("30000001-0001-0001-0001-000000000001"),
                Title = "LINQ Query Basics",
                Description = "Use LINQ to filter, sort, and project data from a collection of objects.",
                Difficulty = "Medium",
                Topics = new List<string> { "linq", "query-syntax", "method-syntax" },
                Status = "published",
                EstimatedHours = 4,
                Tags = new List<string> { "advanced", "linq" },
                TrackId = advancedTrack.Id,
                ProgressTotal = 100,
                Solution = "var students = new List<Student>\n{\n    new Student { Name = \"Alice\", Grade = 85 },\n    new Student { Name = \"Bob\", Grade = 92 },\n    new Student { Name = \"Charlie\", Grade = 78 }\n};\n\n// Filter and sort\nvar topStudents = students\n    .Where(s => s.Grade >= 80)\n    .OrderByDescending(s => s.Grade)\n    .Select(s => new { s.Name, s.Grade });\n\nforeach (var student in topStudents)\n    Console.WriteLine($\"{student.Name}: {student.Grade}\");"
            },
            new Challenge
            {
                Id = Guid.Parse("30000001-0001-0001-0001-000000000002"),
                Title = "Async and Await",
                Description = "Create an async method that downloads data from a website and processes it.",
                Difficulty = "Hard",
                Topics = new List<string> { "async", "await", "task" },
                Status = "published",
                EstimatedHours = 6,
                Tags = new List<string> { "advanced", "async" },
                TrackId = advancedTrack.Id,
                ProgressTotal = 100,
                Solution = "using System.Net.Http;\n\npublic async Task<string> DownloadWebsiteAsync(string url)\n{\n    using var client = new HttpClient();\n    var response = await client.GetStringAsync(url);\n    return response;\n}\n\npublic async Task ProcessWebsiteAsync(string url)\n{\n    try\n    {\n        var content = await DownloadWebsiteAsync(url);\n        Console.WriteLine($\"Downloaded {content.Length} characters\");\n        // Process content here\n    }\n    catch (Exception ex)\n    {\n        Console.WriteLine($\"Error: {ex.Message}\");\n    }\n}"
            }
        });

        await context.Challenges.AddRangeAsync(challenges);
    }

    private static async Task SeedAchievementsAsync(ApplicationDbContext context)
    {
        var achievements = new List<Achievement>
        {
            new Achievement
            {
                Id = Guid.Parse("90000001-0001-0001-0001-000000000001"),
                Title = "First Steps",
                Description = "Complete your first C# challenge",
                Icon = "🎯",
                Category = "milestone",
                Rarity = "Common",
                Points = 10,
                ProgressRequired = 1
            },
            new Achievement
            {
                Id = Guid.Parse("90000001-0001-0001-0001-000000000002"),
                Title = "C# Beginner",
                Description = "Complete 5 C# Fundamentals challenges",
                Icon = "🌟",
                Category = "progress",
                Rarity = "Common",
                Points = 25,
                ProgressRequired = 5
            },
            new Achievement
            {
                Id = Guid.Parse("90000001-0001-0001-0001-000000000003"),
                Title = "OOP Master",
                Description = "Complete all Object-Oriented Programming challenges",
                Icon = "🏆",
                Category = "mastery",
                Rarity = "Rare",
                Points = 50,
                ProgressRequired = 3
            },
            new Achievement
            {
                Id = Guid.Parse("90000001-0001-0001-0001-000000000004"),
                Title = "Async Expert",
                Description = "Complete an async programming challenge",
                Icon = "⚡",
                Category = "skill",
                Rarity = "Rare",
                Points = 35,
                ProgressRequired = 1
            },
            new Achievement
            {
                Id = Guid.Parse("90000001-0001-0001-0001-000000000005"),
                Title = "Track Completer",
                Description = "Complete an entire learning track",
                Icon = "🎓",
                Category = "milestone",
                Rarity = "Epic",
                Points = 100,
                ProgressRequired = 1
            },
            new Achievement
            {
                Id = Guid.Parse("90000001-0001-0001-0001-000000000006"),
                Title = "7-Day Streak",
                Description = "Maintain a 7-day learning streak",
                Icon = "🔥",
                Category = "consistency",
                Rarity = "Uncommon",
                Points = 30,
                ProgressRequired = 7
            },
            new Achievement
            {
                Id = Guid.Parse("90000001-0001-0001-0001-000000000007"),
                Title = "LINQ Legend",
                Description = "Complete all LINQ challenges",
                Icon = "📊",
                Category = "skill",
                Rarity = "Rare",
                Points = 40,
                ProgressRequired = 1
            },
            new Achievement
            {
                Id = Guid.Parse("90000001-0001-0001-0001-000000000008"),
                Title = "Code Warrior",
                Description = "Complete 10 challenges total",
                Icon = "⚔️",
                Category = "progress",
                Rarity = "Uncommon",
                Points = 45,
                ProgressRequired = 10
            }
        };

        await context.Achievements.AddRangeAsync(achievements);
    }
}
