import mongoose from "mongoose";
import { Job } from "./models/jobModel.js";
import { User } from "./models/userModel.js";
import { mongoDBURL } from "./config.js";

async function createMockJobs() {
  try {
    await mongoose.connect(mongoDBURL);

    // Get the first admin user to use as postedBy
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("No admin user found. Please run createAdmin.js first.");
      return;
    }

    // Mock jobs data
    const mockJobs = [
      {
        title: "Senior React Developer",
        company: "Tech Solutions Inc.",
        location: "San Francisco, CA",
        type: "full-time",
        salary: "$120,000 - $160,000",
        description:
          "We are looking for an experienced React developer to join our dynamic team. You will be responsible for building responsive web applications and mentoring junior developers.",
        requirements:
          "5+ years of experience with React, TypeScript, and Node.js. Experience with Redux, REST APIs, and Git.",
        benefits:
          "Health insurance, 401k matching, remote work options, professional development budget",
        skills: ["React", "TypeScript", "Node.js", "Redux", "REST API"],
        experience: "senior",
        category: "Frontend Development",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 30),
        ),
        contactEmail: "jobs@techsolutions.com",
        postedBy: adminUser._id,
      },
      {
        title: "Full Stack JavaScript Developer",
        company: "Creative Web Agency",
        location: "New York, NY",
        type: "full-time",
        salary: "$90,000 - $130,000",
        description:
          "Join our creative team to build beautiful and functional web applications. Work with modern technologies and collaborate with designers and product managers.",
        requirements:
          "3+ years of experience with MERN stack. Experience with MongoDB, Express, and deployment.",
        benefits:
          "Competitive salary, health benefits, flexible working hours, learning allowance",
        skills: ["MongoDB", "Express", "React", "Node.js", "MERN Stack"],
        experience: "mid",
        category: "Full Stack Development",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 25),
        ),
        contactEmail: "careers@creativeagency.com",
        postedBy: adminUser._id,
      },
      {
        title: "Backend Node.js Developer",
        company: "CloudBase Systems",
        location: "Austin, TX",
        type: "full-time",
        salary: "$100,000 - $150,000",
        description:
          "Build scalable backend systems and APIs for our cloud platform. Work with microservices, databases, and real-time applications.",
        requirements:
          "4+ years of Node.js experience. Knowledge of PostgreSQL, Redis, and Docker.",
        benefits:
          "Stock options, health insurance, remote-friendly, annual bonus, tech budget",
        skills: ["Node.js", "PostgreSQL", "Redis", "Docker", "Microservices"],
        experience: "mid",
        category: "Backend Development",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 35),
        ),
        contactEmail: "hiring@cloudbsystems.com",
        postedBy: adminUser._id,
      },
      {
        title: "Frontend UI/UX Developer",
        company: "Design Studio Co.",
        location: "Los Angeles, CA",
        type: "full-time",
        salary: "$80,000 - $120,000",
        description:
          "Create stunning user interfaces and improve user experience. Work closely with designers to implement pixel-perfect designs.",
        requirements:
          "3+ years of frontend development. Strong CSS skills, responsive design experience.",
        benefits:
          "Creative environment, flexible hours, health insurance, professional growth",
        skills: ["React", "CSS", "JavaScript", "Figma", "Responsive Design"],
        experience: "mid",
        category: "Frontend Development",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 20),
        ),
        contactEmail: "jobs@designstudio.com",
        postedBy: adminUser._id,
      },
      {
        title: "Junior Web Developer",
        company: "StartUp Innovations",
        location: "Remote",
        type: "full-time",
        salary: "$50,000 - $70,000",
        description:
          "Great opportunity for junior developers to grow and learn. Work on real projects under mentorship of experienced developers.",
        requirements:
          "Basic knowledge of HTML, CSS, JavaScript. Willing to learn and grow.",
        benefits:
          "Mentorship program, learning opportunities, health insurance, remote work",
        skills: ["JavaScript", "HTML", "CSS", "React basics"],
        experience: "entry",
        category: "Web Development",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 40),
        ),
        contactEmail: "careers@startupinnovations.com",
        postedBy: adminUser._id,
      },
      {
        title: "DevOps Engineer",
        company: "Infrastructure Pro",
        location: "Chicago, IL",
        type: "full-time",
        salary: "$110,000 - $160,000",
        description:
          "Manage and optimize our cloud infrastructure. Work with AWS, Kubernetes, and CI/CD pipelines.",
        requirements:
          "5+ years of DevOps experience. AWS or GCP certification preferred.",
        benefits:
          "Competitive salary, stock options, health insurance, conference budget",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
        experience: "senior",
        category: "DevOps",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 28),
        ),
        contactEmail: "jobs@infrastrpro.com",
        postedBy: adminUser._id,
      },
      {
        title: "Data Analyst",
        company: "Analytics First",
        location: "Boston, MA",
        type: "full-time",
        salary: "$75,000 - $110,000",
        description:
          "Analyze data and provide insights to drive business decisions. Work with Python, SQL, and visualization tools.",
        requirements:
          "3+ years of data analysis experience. Strong SQL and Python skills.",
        benefits:
          "Health insurance, flexible hours, professional development, bonus structure",
        skills: ["Python", "SQL", "Tableau", "Data Analysis", "Excel"],
        experience: "mid",
        category: "Data Science",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 32),
        ),
        contactEmail: "hiring@analyticsfirst.com",
        postedBy: adminUser._id,
      },
      {
        title: "Web Designer",
        company: "Creative Minds Agency",
        location: "Miami, FL",
        type: "part-time",
        salary: "$40 - $60/hour",
        description:
          "Design beautiful and functional websites. Collaborate with developers to bring designs to life.",
        requirements:
          "2+ years of design experience. Proficiency in Figma, Adobe XD.",
        benefits:
          "Flexible hours, remote option, creative projects, competitive hourly rate",
        skills: [
          "Figma",
          "Adobe XD",
          "UI Design",
          "Wireframing",
          "Prototyping",
        ],
        experience: "mid",
        category: "Design",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 22),
        ),
        contactEmail: "design@creativeminds.com",
        postedBy: adminUser._id,
      },
      {
        title: "QA Automation Engineer",
        company: "Quality Assurance Plus",
        location: "Seattle, WA",
        type: "full-time",
        salary: "$85,000 - $125,000",
        description:
          "Build and maintain automated testing frameworks. Ensure quality of our applications through comprehensive testing.",
        requirements:
          "3+ years of QA automation experience. Knowledge of Selenium, Jest, and testing frameworks.",
        benefits:
          "Health insurance, learning budget, remote flexibility, team events",
        skills: ["Selenium", "Jest", "Testing", "JavaScript", "Automation"],
        experience: "mid",
        category: "QA Engineering",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 27),
        ),
        contactEmail: "jobs@qaplus.com",
        postedBy: adminUser._id,
      },
      {
        title: "Freelance React Developer",
        company: "Project Hub",
        location: "Remote",
        type: "freelance",
        salary: "$50 - $100/hour",
        description:
          "Work on short-term and long-term React projects. Flexible engagement based on project requirements.",
        requirements:
          "2+ years of React experience. Portfolio of completed projects.",
        benefits: "Flexible schedule, competitive rates, diverse projects",
        skills: ["React", "JavaScript", "REST API", "Git"],
        experience: "mid",
        category: "Frontend Development",
        applicationDeadline: new Date(
          new Date().setDate(new Date().getDate() + 45),
        ),
        contactEmail: "projects@projecthub.com",
        postedBy: adminUser._id,
      },
    ];

    // Check if jobs already exist
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      console.log(`${existingJobs} jobs already exist in the database.`);
      console.log("Skipping mock job creation.");
      return;
    }

    // Create jobs
    const createdJobs = await Job.insertMany(mockJobs);

    console.log(`\n✅ Successfully created ${createdJobs.length} mock jobs!`);
    console.log("\nJobs created:");
    createdJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} at ${job.company}`);
    });
  } catch (error) {
    console.error("Error creating mock jobs:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createMockJobs();
