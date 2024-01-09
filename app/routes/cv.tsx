export default function CV() {
  // The most outrageous tailwind classes I ever wrote.
  return (
    <div className="p-4 leading-tight max-w-4xl mx-auto pt-10 [&:not(:last-child)]:*:mb-8 [&:not(:last-child)]:*:pb-8 [&:not(:last-child)]:*:border-b-2 pb-16">
      <Profile />

      <WhatIWant />

      <WorkHistory />

      <Education />
    </div>
  );
}

const WhatIWant = () => (
  <div className="grid grid-cols-9 gap-4">
    <div className="col-span-9 md:col-span-2">
      <h2 className="my-0 text-3xl">What I’m looking for</h2>
    </div>
    <div className="col-span-9 md:col-span-7">
      <div className="mb-4  *:text-base">
        <p>
          I’m primarily interested in remote, full-time roles where I can grow
          into the next stage of my career. I’m interested in working for a
          company that values its users, its team, and building great products.
          I like the vibe of:
        </p>

        <ul className="*:text-base *:my-1">
          <li>
            <a href="https://linear.app/method/introduction">Linear</a>
          </li>
          <li>
            <a href="https://thebrowser.company/values/">The Browser Company</a>
          </li>
          <li>
            <a href="https://www.are.na/blog/on-motivation">Are.na</a>
          </li>
        </ul>

        <p>
          If you like these companies vibes too, then I’d love to hear from you.
        </p>
      </div>
    </div>
  </div>
);

const Profile = () => (
  <div className="grid grid-cols-5 gap-4 ">
    <h1 className="col-span-5 md:col-span-1 my-0 text-3xl">John Whiles</h1>
    <div className="col-span-3">
      <p className=" text-base">
        I am a product-minded software engineer with 7 years of experience
        working at high-growth companies. I prefer to work across the full stack
        and deliver features end-to-end. I built the micro SaaS app{" "}
        <a
          className="not-italic font-sans text-base"
          href="https://www.coachtracker.net"
        >
          Coachtracker
        </a>{" "}
        and write regularly on my{" "}
        <a
          className="not-italic font-sans text-base"
          href="https://johnwhiles.com/"
        >
          personal website
        </a>
        .
      </p>
      <p className=" text-base">
        I have extensive professional experience writing TypeScript, Node.js and
        React. I’ve also worked in Ruby, Go, and Haskell. On the infrastructure
        side I’ve worked with AWS, Docker, and Terraform. I’m always happy to be
        learning new languages and tools.
      </p>
    </div>
    <ul className="my-0 list-none">
      <li>
        <a href="https://github.com/jwhiles">Github</a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/john-whiles/">LinkedIn</a>
      </li>
      <li>
        <a href="https://johnwhiles.com">Website</a>
      </li>
      <li>
        <a href="mailto:cv@johnwhiles.com">Email</a>
      </li>
    </ul>
  </div>
);

const workHistory: WorkEntryProps[] = [
  {
    companyName: "Roost",
    jobTitle: "CTO",
    technologies: ["TypeScript", "Node.js", "Remix", "PostgreSQL"],
    startDate: "September 2023",
    endDate: "December 2023",
    experienceBulletPoints: [
      "At Roost I was responsible for the initial technical direction of the company.",
      "I built MVPs of potential Roost products, including a tool for managing rental properties and identifying property investment opportunities.",
      "I worked closely with the CEO and COO to define the company’s strategy and direction.",
    ],
  },
  {
    companyName: "Contentful",
    jobTitle: "Senior Software Engineer",
    technologies: [
      "TypeScript",
      "Node.js",
      "React",
      "Go",
      "PostgreSQL",
      "Ruby on Rails",
    ],
    startDate: "March 2020",
    endDate: "September 2023",
    experienceBulletPoints: [
      "Managed Contentful’s fleet of PostgreSQL databases, including leading a project to perform major version upgrades across the entire fleet with zero downtime for customers.",
      "Made extensive contributions to Contentful’s app framework.",
      "Rebuilt the front-end technical interview, improving the experience for interviewers and candidates.",
      "Helped several engineers onboard successfully into the Company by providing mentorship and guidance.",
    ],
  },
  {
    companyName: "Soundcloud",
    jobTitle: "Frontend Engineer",
    technologies: ["JavaScript", "Backbone.js"],
    startDate: "June 2019",
    endDate: "March 2020",
    experienceBulletPoints: [
      "Worked on Soundcloud’s music publishing product, allowing users to publish their music to other platforms.",
      "Implemented a system that allowed users to tag each other in comments.",
      "Improved page load times on an internal admin tool by multiple orders of magnitude.",
    ],
  },
  {
    companyName: "Habito",
    jobTitle: "Senior Software Engineer",
    technologies: ["Haskell", "PureScript", "React"],
    startDate: "July 2018",
    endDate: "June 2019",
    experienceBulletPoints: [
      "As part of a two-person team, rebuilt Habito’s design system and styling, including building a design system that improved the accessibility of the product.",
      "Implemented the dynamic mortgage interview, which is the core of Habito’s user journey.",
    ],
  },
  {
    companyName: "Trainline",
    jobTitle: "Senior Software Engineer",
    technologies: ["TypeScript", "React", "Node.js"],
    startDate: "January 2018",
    endDate: "July 2018",
    experienceBulletPoints: [
      "Moved one of The Trainline’s busiest services from C# to Node.js, improving performance and maintainability.",
      "Improved The Trainline’s internal design system.",
    ],
  },
  {
    companyName: "Just Giving",
    jobTitle: "Senior Software Engineer",
    technologies: ["TypeScript", "React"],
    startDate: "March 2017",
    endDate: "January 2018",
    experienceBulletPoints: [
      "Built a rich UI for a new financial reporting service.",

      "Maintained our design system’s component library.",
      `Led a TypeScript migration, ensuring that our builds continued to work, and helped the rest of the team get used to TypeScript.`,
    ],
  },
];

interface WorkEntryProps {
  companyName: string;
  jobTitle: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  experienceBulletPoints: string[];
}

const WorkHistory = () => {
  return (
    <div className="grid grid-cols-9 gap-4">
      <div className="col-span-9 md:col-span-2">
        <h2 className="my-0 text-3xl">Professional Experience</h2>
      </div>
      <ol className="col-span-9 md:col-span-7">
        {workHistory.map((x) => (
          <WorkEntry key={x.companyName} {...x} />
        ))}
      </ol>
    </div>
  );
};

const WorkEntry = ({
  companyName,
  jobTitle,
  technologies,
  startDate,
  endDate,
  experienceBulletPoints,
}: WorkEntryProps) => {
  return (
    <div className="grid grid-cols-6 gap-8 mb-4 last:mb-0">
      <div className="col-span-2">
        <h3 className="mt-0 mb-1 text-xl">{companyName}</h3>
        <p className="mb-1 text-sm">{jobTitle}</p>
        <p className="text-xs">
          {startDate} - {endDate}
        </p>
        <ul className="list-none ml-0">
          {technologies.map((x) => (
            <li key={x} className="text-xs text-slate-400 my-1">
              {x}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-4">
        <ul className="my-0 [&>*]:my-2 [&>*]:text-sm">
          {experienceBulletPoints.map((x) => (
            <li key={x} className="my-1">
              {x}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Education = () => {
  return (
    <div className="grid grid-cols-9 gap-4">
      <div className="col-span-9 md:col-span-2">
        <h2 className="my-0 text-3xl">Education</h2>
      </div>

      <ol className="col-span-9 md:col-span-7">
        <div className="grid grid-cols-6 gap-8 mb-4">
          <div className="col-span-2">
            <h3 className="mt-0 mb-1 text-xl">Founders and Coders</h3>
            <p className="text-xs mb-0">2016 - 2017</p>
          </div>

          <p className="col-span-4 text-base">Student developer</p>
        </div>

        <div className="grid grid-cols-6 gap-8">
          <div className="col-span-2">
            <h3 className="mt-0 mb-1 text-xl">
              Royal Holloway, University of London
            </h3>
            <p className="text-xs mb-0">2010 - 2013</p>
          </div>

          <p className="col-span-4 text-base">
            BA Politics with Philosophy (2:1)
          </p>
        </div>
      </ol>
    </div>
  );
};

// const Skills = () => {
//   return (
//     <div className="grid grid-cols-9 gap-4">
//       <div className="col-span-2">
//         <h2 className="my-0 text-3xl">Skills</h2>
//       </div>

//       <ol className="col-span-7">
//         <li>TypeScript</li>
//         <li>React</li>
//       </ol>
//     </div>
//   );
// };
